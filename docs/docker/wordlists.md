---
sidebar_position: 2
title: wordlists
---

# wordlists

[![Docker CI][build-image]][build-url]

[build-image]: https://github.com/niqdev/strawhatsec/actions/workflows/docker-ci.yml/badge.svg
[build-url]: https://hub.docker.com/r/strawhatsec/wordlists

* [SecLists](https://github.com/danielmiessler/SecLists)
* rockyou.txt

```bash
# base image
docker run --rm -it --name alpine alpine
docker run --rm -it --name alpine -v "$(pwd)/share:/share" alpine

# build
docker build -t strawhatsec/wordlists ./docker/wordlists

# run
docker run --rm -it --name wordlists strawhatsec/wordlists
ls -la /usr/share/wordlists
```

<!--
TODO share volume with host

https://stackoverflow.com/questions/44284484/docker-compose-share-named-volume-between-multiple-containers
https://stackoverflow.com/questions/47664107/docker-mount-to-folder-overriding-content

-->
