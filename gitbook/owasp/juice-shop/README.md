# Juice Shop

Resources

* [Official documentation](https://owasp.org/www-project-juice-shop)
* [Pwning OWASP Juice Shop](https://pwning.owasp-juice.shop)

## Setup

* [hckctl](https://github.com/hckops/hckctl) version `>v0.12.6`

### Local setup (docker)

```bash
# starts juice-shop
hckctl box start vulnerable/owasp-juice-shop

# starts background attack box
hckctl box start parrot-sec

# connect to juice-shop
# from local machine -> localhost:3000
# from attack box    -> box-owasp-juice-shop-<RANDOM>:3000

# adds host alias
echo "$(dig +short box-owasp-juice-shop-<RANDOM>) juiceshop" >> /etc/hosts
```

### Remote setup (kubernetes)

* [kube-template](https://github.com/hckops/kube-template)

```bash
# starts the cluster
make cluster-up
make kube-config
# watches resources
kubectl klock -n hckops pods

# starts juice-shop
env HCK_CONFIG_BOX.SIZE=xs hckctl box start vulnerable/owasp-juice-shop --provider kube

# tunnels port 3000 locally
hckctl box open box-owasp-juice-shop-<RANDOM> --no-exec

# connects from remote attack box -> box-owasp-juice-shop-<RANDOM>.hckops.svc.cluster.local:3000
env HCK_CONFIG_BOX.SIZE=m hckctl start box parrot-sec --provider kube

# adds host alias
echo "$(dig +short box-owasp-juice-shop-<RANDOM>.hckops.svc.cluster.local) juiceshop" >> /etc/hosts

# FIXME (linux)
# connects from local temporary attack box -> hckops.local:3000
hckctl box parrot-sec
```

### Setup attack box

```bash
# default password: parrot
# vnc/noVNC copy&paste clipboard: CTRL+SHIFT+C/V
vncviewer localhost:5900

# starts burp on port 8080
burpsuite

# installs add-on
install_firefox_foxy_proxy
install_firefox_tampermonkey

# starts httpie desktop
httpie-ui
```

## Challenges

* [Challenge hunting](https://help.owasp-juice.shop/part2)
* Score Board page (guessed) `http://juiceshop:3000/#/score-board`

## Automated tasks

* [sqlmap](https://github.com/sqlmapproject/sqlmap)
* [NoSQLMap](https://github.com/codingo/NoSQLMap)

```bash
# TODO https://github.com/sqlmapproject/sqlmap/issues/4671

hckctl task sqlmap --input address=box-owasp-juice-shop-<RANDOM>.hckops.svc.cluster.local:3000 --provider kube
```
