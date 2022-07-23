---
sidebar_position: 2
id: lab
title: Laboratory
---

# Laboratory

```bash
docker run --rm --name lab-kali --hostname kali -it kalilinux/kali-rolling

nmap -n -Pn -sC -sV -p- --min-rate 1000 -oA nmap.out -v 10.129.143.222

telnet <IP> <PORT>
```

https://www.kali.org/docs/containers/using-kali-docker-images/
