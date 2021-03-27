# Reverse

[![Docker Cloud Build Status][build-image]][build-url]

[build-image]: https://img.shields.io/docker/cloud/build/strawhatsec/reverse?style=flat-square
[build-url]: https://hub.docker.com/r/strawhatsec/reverse

```bash
# build
docker build -t strawhatsec/reverse ./docker/reverse

# run and access
docker run --rm --name reverse -p 5900:5900 -v "$(pwd):/share" strawhatsec/reverse
docker exec -it reverse bash

# vnc
vncviewer localhost:5900
```

## Android

* [Apktool](https://ibotpeaches.github.io/Apktool)
* [dex2jar](https://github.com/pxb1988/dex2jar)
* [JD-GUI](http://java-decompiler.github.io)
* [APK Studio](https://github.com/vaibhavpandeyvpz/apkstudio) *TODO*
    - [AppImage](https://appimage.org)
    - Alpine [issue](https://github.com/AppImage/AppImageKit/issues/1015)

## Binary

* [Radare2](https://www.radare.org)
* [Ghidra](https://ghidra-sre.org)

*TODO* Alternatives
* [Cutter](https://cutter.re)
* [IDA](https://www.hex-rays.com/products/ida)
* [QIRA](https://qira.me)
