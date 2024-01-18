# Juice Shop

Resources

* [Official documentation](https://owasp.org/www-project-juice-shop)
* [Pwning OWASP Juice Shop](https://pwning.owasp-juice.shop)
* [How to hack OWASP Juice Shop](https://www.youtube.com/playlist?list=PL8j1j35M7wtKXpTBE6V1RlN_pBZ4StKZw) (video)
* [r/owasp_juiceshop](https://www.reddit.com/r/owasp_juiceshop)

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

# installs and starts burp on port 8090
/hck/scripts/install_burpsuite_community.sh
/hck/scripts/install_firefox_foxy_proxy.sh
burpsuite

# starts httpie desktop
httpie-desktop
```

## Automated tasks examples

* [sqlmap](https://github.com/sqlmapproject/sqlmap)
* [NoSQLMap](https://github.com/codingo/NoSQLMap)

Docker provider
```bash
# ip of hckops network
LOCAL_IP=$(hckctl box info box-owasp-juice-shop-<RANDOM> | yq .provider.docker.ip)

# default uses /hck/share/wordlists/SecLists/Discovery/Web-Content/common.txt
hckctl task gobuster --input address=${LOCAL_IP}:3000
```

Kubernetes provider
```bash
# TODO https://github.com/sqlmapproject/sqlmap/issues/4671

hckctl task sqlmap --provider kube \
  --input address=box-owasp-juice-shop-<RANDOM>.hckops.svc.cluster.local:3000
```

## Challenges

* [Challenge hunting](https://help.owasp-juice.shop/part2)
* Score Board page (guessed) `http://juiceshop:3000/#/score-board`

<!--

# register user
curl -sS http://juiceshop:3000/api/Users/ -H 'Content-Type: application/json' --data-raw $'{"email":"a@a.com","password":"12345","passwordRepeat":"12345","securityQuestion":{"id":3,"question":"Mother\'s birth date? (MM/DD/YY)","createdAt":"2023-11-07T08:41:38.130Z","updatedAt":"2023-11-07T08:41:38.130Z"},"securityAnswer":"000000"}' | jq

# missing or skipped challenges
* Injection > SSTi
* Sensitive Data Exposure > NFT Takeover
* XML External Entities (XXE) https://owasp.org/www-community/vulnerabilities/XML_External_Entity_(XXE)_Processing

-->
