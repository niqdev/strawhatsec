# Burp Suite

[![Docker Cloud Build Status][build-image]][build-url]

[build-image]: https://img.shields.io/docker/cloud/build/strawhatsec/burpsuite?style=flat-square
[build-url]: https://hub.docker.com/r/strawhatsec/burpsuite

* [Academy](https://portswigger.net/web-security)
* [FoxyProxy](https://getfoxyproxy.org)

```bash
# base image
docker run --rm --name alpine-xfce-vnc -p 5900:5900 -p 6080:6080 --hostname alpine edgelevel/alpine-xfce-vnc
docker exec -it alpine-xfce-vnc bash

# build
docker build -t strawhatsec/burpsuite ./docker/burpsuite

# run and access
docker run --rm --name burpsuite -p 5900:5900 -p 6080:6080 -p 8080:8081 strawhatsec/burpsuite
docker exec -it burpsuite bash

# vnc
vncviewer localhost:5900
http://localhost:6080

# install foxy-proxy
install_firefox_foxy_proxy

# start on port 8080
burpsuite
```
