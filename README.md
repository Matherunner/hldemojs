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

The following fixes the yaw angle to 45 degrees and presents a download link to the modified demo file.

```html
<input type="file" id="infile" onchange="parseDemo(this.files[0])">
<a id="download" download="modified.dem" style="display: none">Download!</a>
<script src="hldemo.min.js"></script>
<script>
    function modifyYawAngles(directoryEntries) {
        for (var i = 0; i < directoryEntries.length; ++i) {
            for (var j = 0; j < directoryEntries[i].frames.length; ++j) {
                var frame = directoryEntries[i].frames[j];
                if (frame.type < HLDemo.CONSTS.FRAME_TYPE_MIN
                    || frame.type > HLDemo.CONSTS.FRAME_TYPE_MAX) {
                    frame.demoInfo.refParams.viewangles[1] = 45;
                }
            }
        }
    }

    function parseDemo(file) {
        var demoReader = new HLDemo.DemoReader();
        demoReader.onready(function() {
            modifyYawAngles(demoReader.directoryEntries);

            var demoWriter = new HLDemo.DemoWriter();
            var url = demoWriter.save(
                demoReader.demoSize, demoReader.header,
                demoReader.directoryEntries);
            var download = document.getElementById('download');
            download.href = url;
            download.style.display = 'block';
        });
        demoReader.parse(file);
    }
</script>
```
