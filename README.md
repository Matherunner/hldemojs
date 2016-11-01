# hldemo.js

[![Build Status](https://travis-ci.org/Matherunner/hldemojs.svg?branch=master)](https://travis-ci.org/Matherunner/hldemojs)

A javascript port of YaLTeR's [HLDemo](https://github.com/YaLTeR/HLDemo) library.

## Building

```
yarn global add gulp-cli
yarn install
yarn release
```

The source files are written in ES6 javascript, which are transcompiled to ES5 with babel and bundled with webpack. The bundled javascript files will be created in the `dist` directory.

## Example

The following simply counts the number of frame entries a demo file has.

```html
<input type="file" id="infile" onchange="parseDemo(this.files[0])">
<p id="output"></p>
<script src="hldemo.min.js"></script>
<script>
    function parseDemo(file) {
        var demoReader = new HLDemo.DemoReader();
        demoReader.onready(function() {
            var directoryEntries = demoReader.directoryEntries;
            var count = 0;
            for (var i = 0; i < directoryEntries.length; ++i) {
                for (var j = 0; j < directoryEntries[i].frames.length; ++j) {
                    count += 1;
                }
            }
            document.getElementById("output").innerText = count + " frames in total";
        })
        demoReader.parse(file);
    }
</script>
```
