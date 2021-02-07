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
```

Start lab

```bash
# access droplet
make do-access

# clone repo
git clone https://github.com/niqdev/strawhatsec.git && \
  cd strawhatsec && \
  apt install make

# start lab
make htb-up
make htb-down
make htb-logs
```

Access lab locally

```bash
# download vpn config to "./ctf/htb/*.ovpn"
https://www.hackthebox.eu/home/htb/access/ovpnfile

# (wait for containers to start) upload vpn config from local machine into shared container volume
make do-htb-vpn

# tunnel docker ports LOCAL_PORT:PUBLIC_IP:REMOTE_PORT
make do-htb-tunnel

# connect vnc
vncviewer localhost:5901

# access machines
docker exec -it htb-lab bash
openvpn /share/*.ovpn

# access burpsuite from lab
http burpsuite:8081
# wordlists path
ll /usr/share/wordlists
# tools path
ll /opt
```
