# Municipal Implementation Toolbox
Updating the Connections2045 Municipal Implementation Toolbox to a more interactive tool

## Build Process
For the entire folder:
- npx babel js --out-dir build
- copy the files in the build folder over to staging

For individual files:
- cd js
- npx babel filename.js --out-file filename-compiled.js
- copy the compiled files over to staging