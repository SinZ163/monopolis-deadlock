# monopolis-deadlock

For the game to function, copy/move `content/maps/test.vmap` into a CSDK12 content folder and compile it with [Source2MapCompiler](https://github.com/Angel-foxxo/Source2MapCompiler) using the CSDK12 bin_cs2 and then copy the resulting `test.vpk` to `modlock/maps/`.
If you use the Change Output functionality, incremental builds will not function as it moves the resulting output.

Compile panorama side with `npm run build:panorama` or `npm run dev:panorama` for file watching

Compile the rest of the mod with `modlock build modlock` or `modlock dev --watch modlock`
