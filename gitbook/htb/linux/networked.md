# Networked

Info

* OS: Linux
* Difficulty: easy
* IP: `10.10.10.146`

Vulnerabilities

* TODO

### Walkthrough <a href="#user-content-walkthrough" id="user-content-walkthrough"></a>

* [IppSec](http://youtube.com/watch?v=H3t3G70bakM) (video)

#### Enumeration <a href="#user-content-enumeration" id="user-content-enumeration"></a>

Nmap

```
nmap -n -Pn -sC -sV -p- --min-rate 1000 -oA nmap.out -v 10.10.10.146

# output
PORT    STATE  SERVICE VERSION
22/tcp  open   ssh     OpenSSH 7.4 (protocol 2.0)
| ssh-hostkey: 
|   2048 22:75:d7:a7:4f:81:a7:af:52:66:e5:27:44:b1:01:5b (RSA)
|   256 2d:63:28:fc:a2:99:c7:d4:35:b9:45:9a:4b:38:f9:c8 (ECDSA)
|_  256 73:cd:a0:5b:84:10:7d:a7:1c:7c:61:1d:f5:54:cf:c4 (ED25519)
80/tcp  open   http    Apache httpd 2.4.6 ((CentOS) PHP/5.4.16)
|_http-server-header: Apache/2.4.6 (CentOS) PHP/5.4.16
|_http-title: Site doesn't have a title (text/html; charset=UTF-8).
443/tcp closed https
```

```
exa -l --sort=size --reverse /git-repos/wordlists/SecLists/Discovery/Web-Content/ | head -n 20

# php extension: see "http-server-header: Apache/2.4.6 (CentOS) PHP/5.4.16"
gobuster dir \
  -u http://10.10.10.146 \
  -w /git-repos/wordlists/SecLists/Discovery/Web-Content/directory-list-2.3-small.txt \
  -t 100 \
  -x php \
  -o gobuster.out

# output
===============================================================
Gobuster v3.5
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.10.10.146
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /git-repos/wordlists/SecLists/Discovery/Web-Content/directory-list-2.3-small.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.5
[+] Extensions:              php
[+] Timeout:                 10s
===============================================================
2023/04/26 07:44:41 Starting gobuster in directory enumeration mode
===============================================================
/index.php            (Status: 200) [Size: 229]
/uploads              (Status: 301) [Size: 236] [--> http://10.10.10.146/uploads/]
/photos.php           (Status: 200) [Size: 1302]
/upload.php           (Status: 200) [Size: 169]
/lib.php              (Status: 200) [Size: 0]
/backup               (Status: 301) [Size: 235] [--> http://10.10.10.146/backup/]
```

<details>

<summary></summary>



</details>
