# wordlists

* [SecLists](https://github.com/danielmiessler/SecLists)
* rockyou.txt

```bash
# base image
docker run --rm -it --name alpine alpine

# build
docker build -t strawhatsec/wordlists ./docker/wordlists

# run
docker run --rm -it --name wordlists -v $(pwd)/wordlists:/wordlists:ro strawhatsec/wordlists
```
