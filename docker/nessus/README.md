# Nessus

* [Install](https://docs.tenable.com/nessus/Content/InstallNessus.htm)
* [Downloads](https://www.tenable.com/downloads/nessus)

```bash
# base image
docker run --rm --name phusion phusion/baseimage:bionic-1.0.0-amd64
docker exec -it phusion bash

# build
docker build -t strawhatsec/nessus ./docker/nessus

# run
docker run --rm --name nessus -p 8834:8834 strawhatsec/nessus

# access
docker exec -it nessus bash
tail -f /var/log/nessus/stdout

# ui registration
https://localhost:8834
```

Alternative manual registration of `Nessus Essentials`

```bash
# get challenge code from the cli
/opt/nessus/sbin/nessuscli fetch --challenge

# get activation code (via email): uuid format in capital case
https://www.tenable.com/products/nessus/nessus-essentials

# get license and plugins link
https://plugins.nessus.org/v2/offline.php

# copy TENABLE LICENSE
vim nessus.license
# register license
/opt/nessus/sbin/nessuscli fetch --register-offline nessus.license
# restart
supervisorctl restart nessus

# how to update plugins
https://docs.tenable.com/nessus/Content/DownloadAndCopyPlugins.htm
```

## Development

Only the latest version is available to download, update the Dockerfile ARGs

* `id` / `NESSUS_VERSION_ID`
* `file` / `NESSUS_VERSION`
* `meta_data.sha256` / `NESSUS_PACKAGE_CHECKSUM`

```bash
http https://www.tenable.com/downloads/api/v1/public/pages/nessus | \
  jq '.downloads[] | select(.file | contains("ubuntu1110_amd64.deb"))'

# example
{
  "id": 12222,
  "file": "Nessus-8.13.1-ubuntu1110_amd64.deb",
  "name": "Nessus-8.13.1-ubuntu1110_amd64.deb",
  "size": 43753376,
  "description": "Ubuntu 11.10, 12.04, 12.10, 13.04, 13.10, 14.04, 16.04, 17.10, 18.04, and 20.04 AMD64",
  "sort_order": null,
  "created_at": "2020-12-16T17:59:32.788Z",
  "updated_at": "2020-12-16T18:34:08.675Z",
  "page_id": 60,
  "meta_data": {
    "md5": "f3d521f95319d498145f70fe59a0a21d",
    "sha256": "52f4fcb298b98bba4873d057df4f0b7eb3a55f6fc803309ecf7a70e16d25ec97",
    "product": "Nessus - 8.13.1",
    "version": "8.13.1",
    "product_type": "default",
    "release_date": "12/11/2020",
    "product_notes": null,
    "product_release_date": "12/16/2020"
  },
  "publish": true,
  "required_auth": null,
  "type": "download"
}
```
