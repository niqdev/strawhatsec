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
TODO
```

## Login MC SafeSearch

Log in with MC SafeSearch's original user credentials

```bash
TODO
```

## Meta Geo Stalking

Determine the answer to John's security question

```bash
TODO
```

## Misplaced Signature File

Access a misplaced SIEM signature file.
```bash
TODO
```
```bash
TODO
```

## NFT Takeover

Take over the wallet containing our official Soul Bound Token (NFT).

```bash
TODO
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
TODO
```
