# Municipal Implementation Toolbox
DVRPC has designed this online toolbox to serve as a guide for municipalities to help implement the goals of Connections 2045, the region’s Long-range Plan. It contains resources, case studies, and model/sample ordinances for tools that are most useful for implementing the 5 Core Principles of the Plan.

## Build Process
For the entire folder:
- npx webpack --mode=production
- copy the files in the build folder over to staging

For individual files:
- cd js
- npx webpack filename.js -o ../ build/ie/filename.js
- copy the compiled files over to staging