# Juice Shop

Resources

* [Official documentation](https://owasp.org/www-project-juice-shop)
* [Pwning OWASP Juice Shop](https://help.owasp-juice.shop)

## Setup

* [hckctl](https://github.com/hckops/hckctl) version `v0.12.5`

### Local setup (docker)

```bash
# starts juice-shop
hckctl box start vulnerable/owasp-juice-shop

# starts background attack box
hckctl box start parrot-sec

# connect to juice-shop
# from local machine -> localhost:3000
# from attack box    -> box-owasp-juice-shop-<RANDOM>:3000
```

### Remote setup (kubernetes)

* [kube-template](https://github.com/hckops/kube-template)

```bash
# starts the cluster
make cluster-up
make kube-config
kubectl klock -n hckops pods

# starts juice-shop
env HCK_CONFIG_BOX.SIZE=xs hckctl box start vulnerable/owasp-juice-shop --provider kube

# tunnels port 3000 locally
hckctl box open box-owasp-juice-shop-<RANDOM> --no-exec

# connects from remote attack box -> box-owasp-juice-shop-<RANDOM>.hckops.svc.cluster.local:3000
hckctl box parrot-sec --provider kube

# FIXME (linux) connects from local attack box -> hckops.local:3000
hckctl box parrot-sec
```

### Setup attack box

```bash
# adds host aliases
echo "$(dig +short box-owasp-juice-shop-<RANDOM>.hckops.svc.cluster.local) juice-shop.local juiceshop.local juice-shop juiceshop" >> /etc/hosts

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
* Score Board page (guessed) `http://juiceshop:3000/#/score-board`
