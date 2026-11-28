// Feature/test flags, set from the args passed to onStart:
//   modlock dev --watch modlock -- test
//   modlock dev --watch modlock -- auction bots=2 no-randomOwnership
// Each arg is `name`, `name=value`, `no-name`, a preset name, or `no-preset` (turns off the
// flags that preset sets itself; presets it includes are left alone). Everything defaults to
// off, so a published session (no args) runs with none of this.
// This is a leaf module: it must not import game code (keeps main.ts <-> GameMode.ts acyclic).
// To add a flag, add one line to SPEC (and to a preset if wanted), then read it with flag("name").

type BoolSpec = { readonly kind: "bool"; readonly default: boolean; readonly help: string };
type IntSpec = { readonly kind: "int"; readonly default: number; readonly help: string };

const SPEC = {
    tools:              { kind: "bool", default: false, help: "Any player can act for whoever's turn/bid/trade it is" },
    randomOwnership:    { kind: "bool", default: false, help: "Randomise property ownership at StartGame" },
    startAuction:       { kind: "bool", default: false, help: "Skip the first roll and auction a random unowned property" },
    bankruptPlayer:     { kind: "bool", default: false, help: "With startAuction, bankrupt the last player first" },
    tradeAutoConfirm:   { kind: "bool", default: false, help: "A trade 'confirm' accepts for every participant" },
    bots:               { kind: "int",  default: 0,     help: "Bots to spawn when the world loads" },
    autoStart:          { kind: "bool", default: false, help: "Whether to auto start the game on load" },
} as const satisfies Record<string, BoolSpec | IntSpec>;

// A preset expands to more args. `test` matches `modlock dev --watch modlock -- test`.
const PRESETS: Record<string, readonly string[]> = {
    test:    ["tools", "randomOwnership", "tradeAutoConfirm", "bots=5"],
    auction: ["test", "startAuction", "bankruptPlayer"],
};

export type FlagName = keyof typeof SPEC;
type FlagValue<K extends FlagName> = (typeof SPEC)[K]["kind"] extends "int" ? number : boolean;
type FlagValues = { -readonly [K in FlagName]: FlagValue<K> };

export interface SetFlagOptions {
    /** Flags this caller may not turn off (set back to their default). Attempts are skipped with a note. */
    readonly protect?: readonly FlagName[];
}
export interface SetFlagResult {
    /** Set when the arg couldn't be understood; nothing after the error was applied. */
    readonly error?: string;
    /** Things that were skipped on purpose, such as a protected flag. */
    readonly notes: readonly string[];
}

/** Options for /flag and its saved overrides: they can never switch tools (and so /flag itself) off. */
export const FROM_COMMAND: SetFlagOptions = { protect: ["tools"] };

const NAMES = Object.keys(SPEC) as FlagName[];
const byLower: Record<string, FlagName> = {};
for (const n of NAMES) byLower[n.toLowerCase()] = n;

function defaults(): FlagValues {
    const out = {} as Record<FlagName, number | boolean>;
    for (const n of NAMES) out[n] = SPEC[n].default;
    return out as FlagValues;
}

let values = defaults();
let started = false;

/** Current value of a flag. Read it at call time, not in a module-level const (that runs before onStart). */
export function flag<K extends FlagName>(name: K): FlagValue<K> {
    if (!started) console.log(`flags: "${name}" read before onStart, using the default`);
    return values[name];
}

function splitArg(arg: string): { key: string; raw: string | undefined } {
    const eq = arg.indexOf("=");
    return {
        key: (eq === -1 ? arg : arg.slice(0, eq)).trim(),
        raw: eq === -1 ? undefined : arg.slice(eq + 1).trim(),
    };
}

/** true / false for an on/off value (no value means on), undefined when it isn't one. */
function parseBool(raw: string | undefined): boolean | undefined {
    if (raw === undefined || raw === "1" || raw === "true" || raw === "on") return true;
    if (raw === "0" || raw === "false" || raw === "off") return false;
    return undefined;
}

function assign(name: FlagName, value: number | boolean, protect: readonly FlagName[], notes: string[]): void {
    const v = values as Record<FlagName, number | boolean>;
    if (protect.indexOf(name) !== -1 && value === SPEC[name].default && v[name] !== value) {
        notes.push(`${name} can't be turned off from /flag; relaunch without it after --`);
        return;
    }
    v[name] = value;
}

function apply(arg: string, protect: readonly FlagName[], notes: string[], depth: number): string | undefined {
    let { key, raw } = splitArg(arg);
    if (raw === undefined && key.toLowerCase().startsWith("no-")) {
        key = key.slice(3);
        raw = "false";
    }

    const preset = PRESETS[key.toLowerCase()];
    if (preset) {
        const on = parseBool(raw);
        if (on === undefined) return `preset "${key}" wants true/false, got "${raw}"`;
        if (on) {
            if (depth > 4) return `preset loop at "${key}"`;
            for (const a of preset) {
                const err = apply(a, protect, notes, depth + 1);
                if (err) return err;
            }
        } else {
            // Turn off only the flags this preset sets itself; presets it includes stay as they are.
            for (const a of preset) {
                const inner = splitArg(a).key.toLowerCase();
                if (PRESETS[inner]) continue;
                const name = byLower[inner];
                if (!name) return `preset "${key}" names unknown flag "${inner}"`;
                assign(name, SPEC[name].default, protect, notes);
            }
        }
        return undefined;
    }

    const name = byLower[key.toLowerCase()];
    if (!name) return `unknown flag "${key}" (flags: ${NAMES.join(", ")}; presets: ${Object.keys(PRESETS).join(", ")})`;
    if (SPEC[name].kind === "bool") {
        const on = parseBool(raw);
        if (on === undefined) return `"${name}" wants true/false, got "${raw}"`;
        assign(name, on, protect, notes);
    } else {
        const n = Number(raw);
        // `no-bots` / `bots=false` reset an int flag to its default.
        if (raw === "false" || raw === "off") assign(name, SPEC[name].default, protect, notes);
        else if (raw === undefined || raw === "" || !Number.isInteger(n)) return `"${name}" wants a whole number, got "${raw}"`;
        else assign(name, n, protect, notes);
    }
    return undefined;
}

/** Applies one `name`, `name=value`, `no-name`, preset or `no-preset`. */
export function setFlag(arg: string, options: SetFlagOptions = {}): SetFlagResult {
    const notes: string[] = [];
    const error = apply(arg, options.protect ?? [], notes, 0);
    return { error, notes };
}

/** Resets to defaults, then applies each command-line arg in order (nothing protected). Call from onStart. */
export function applyArgs(args: readonly string[]): void {
    values = defaults();
    for (const a of args) {
        const { error, notes } = setFlag(a);
        if (error) console.log(`flags: ${error}`);
        for (const note of notes) console.log(`flags: ${note}`);
    }
    started = true;
    console.log(`flags: ${describeFlags()}`);
}

/** The flags that differ from their defaults, e.g. "tools=true bots=5". */
export function describeFlags(): string {
    return NAMES.filter(n => values[n] !== SPEC[n].default)
        .map(n => `${n}=${values[n]}`)
        .join(" ") || "(all defaults)";
}