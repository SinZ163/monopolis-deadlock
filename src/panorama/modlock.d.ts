declare interface Modlock {
    data(handler: (data: any) => void): void;
    route(name: string, handler: (data: any) => void): void;
}
declare var Modlock: Modlock;