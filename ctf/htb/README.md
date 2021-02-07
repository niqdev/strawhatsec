# Hack The Box

* [HTB](https://www.hackthebox.eu)
* [DigitalOcean](https://www.digitalocean.com/docs)
* [doctl](https://www.digitalocean.com/docs/apis-clis/doctl)
* [TigerVNC](https://tigervnc.org)

## Lab

Setup SSH key (first time only)

```bash
DO_SSH_KEY="do_htb"

# create new key pair
ssh-keygen -t rsa -b 4096 -C $DO_SSH_KEY -N "" -f ~/.ssh/$DO_SSH_KEY

# add ssh key
# https://cloud.digitalocean.com/account/security
xclip -sel clip < ~/.ssh/$DO_SSH_KEY.pub

# verify fingerprint
doctl compute ssh-key list -o json | \
  jq -r --arg DO_SSH_KEY $DO_SSH_KEY '.[] | select(.name | contains($DO_SSH_KEY)) | .fingerprint'
```

Setup lab

```bash
# list available images
make do-images

# list droplets
make do-list

# create droplet (with docker)
make do-create

# delete droplet
make do-delete

# access droplet
make do-access
```

---

> TODO git clone

Access UI

```bash
# tunnel docker ports LOCAL_PORT:PUBLIC_IP:REMOTE_PORT
make do-htb-tunnel

# connect vnc
vncviewer localhost:5901
```

Connect to HTB

```bash
# download vpn config to "./ctf/htb/*.ovpn"
https://www.hackthebox.eu/home/htb/access/ovpnfile

make htb-up
make htb-down
make htb-logs

# upload connection pack from local machine into container
make do-share-vpn

docker exec -it htb-lab bash
openvpn /share/*.ovpn

docker exec -it htb-lab bash

# burp-suite from lab
http burpsuite:8081
# wordlists
ll /usr/share/wordlists
# tools
ll /opt

# burp-suite from host machine
http localhost:8080
```
