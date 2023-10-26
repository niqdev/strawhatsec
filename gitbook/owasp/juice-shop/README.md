# Juice Shop

Resources

* [Official documentation](https://owasp.org/www-project-juice-shop)
* [Pwning OWASP Juice Shop](https://help.owasp-juice.shop)

## Setup

* [hckctl](https://github.com/hckops/hckctl)

### Local setup (docker)

```bash
# starts vulnerable box
hckctl box start vulnerable/owasp-juice-shop

# starts attack box
hckctl box start parrot-sec

# connect to vulnerable box
# from local machine -> localhost:3000
# from attack box    -> box-owasp-juice-shop-<RANDOM>:3000
```

### Remote setup (kubernetes)

Start a cluster with [kube-template](https://github.com/hckops/kube-template)
```bash
# starts the cluster
make cluster-up
make kube-config
kubectl klock -n hckops pods
```

```bash
# starts vulnerable box
env HCK_CONFIG_BOX.SIZE=xs hckctl box start vulnerable/owasp-juice-shop --provider kube

# tunnels ports locally
hckctl box open box-owasp-juice-shop-<RANDOM> --no-exec

# connect from local attack box -> hckops.local:3000
hckctl box start parrot-sec

# connect from remote attack box -> box-owasp-juice-shop-<RANDOM>.hckops.svc.cluster.local:3000
hckctl box start parrot-sec --provider kube
```

### Setup attack box

```bash
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
