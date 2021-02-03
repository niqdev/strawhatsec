# Metasploit

Metasploit and SearchSploit

* [Documentation](https://docs.rapid7.com/metasploit)
* [Exploit Database](https://www.exploit-db.com)

Alternative docker images

* [rapid7/metasploit-framework](https://github.com/rapid7/metasploit-framework/blob/master/Dockerfile)
* [fcolista/alpine-metasploit](https://github.com/fcolista/alpine-metasploit/blob/master/Dockerfile)

```bash
# base image
docker run --rm -it --name alpine ruby:2.7.2-alpine3.13 ash

# build
docker build -t strawhatsec/metasploit ./docker/metasploit

# run and access
docker run --rm -it --name metasploit -p 4444:4444 strawhatsec/metasploit [msfconsole|searchsploit]
```
