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

* [Challenge hunting](https://help.owasp-juice.shop/part2)
* Score Board page (guessed) `http://box-owasp-juice-shop-<RANDOM>:3000/#/score-board`
