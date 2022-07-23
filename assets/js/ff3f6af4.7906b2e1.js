"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[809],{4765:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>u,frontMatter:()=>o,metadata:()=>i,toc:()=>s});var a=n(3117),r=(n(7294),n(3905));const o={sidebar_position:3,id:"digitalocean",title:"Hack The Box (DigitalOcean)"},l="Hack The Box (DigitalOcean)",i={unversionedId:"htb/digitalocean",id:"htb/digitalocean",title:"Hack The Box (DigitalOcean)",description:"* HTB",source:"@site/../docs/htb/digitalocean.md",sourceDirName:"htb",slug:"/htb/digitalocean",permalink:"/strawhatsec/docs/htb/digitalocean",draft:!1,tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3,id:"digitalocean",title:"Hack The Box (DigitalOcean)"},sidebar:"tutorialSidebar",previous:{title:"Laboratory",permalink:"/strawhatsec/docs/htb/lab"},next:{title:"Setup",permalink:"/strawhatsec/docs/docker/setup"}},c={},s=[{value:"Lab",id:"lab",level:2}],p={toc:s};function u(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"hack-the-box-digitalocean"},"Hack The Box (DigitalOcean)"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://www.hackthebox.eu"},"HTB")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://www.digitalocean.com/docs"},"DigitalOcean")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://www.digitalocean.com/docs/apis-clis/doctl"},"doctl")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://tigervnc.org"},"TigerVNC"))),(0,r.kt)("h2",{id:"lab"},"Lab"),(0,r.kt)("p",null,"Setup SSH key (first time only)"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'DO_SSH_KEY="do_htb"\n\n# create new key pair\nssh-keygen -t rsa -b 4096 -C $DO_SSH_KEY -N "" -f ~/.ssh/$DO_SSH_KEY\n\n# add ssh key\n# https://cloud.digitalocean.com/account/security\nxclip -sel clip < ~/.ssh/$DO_SSH_KEY.pub\n\n# verify fingerprint\ndoctl compute ssh-key list -o json | \\\n  jq -r --arg DO_SSH_KEY $DO_SSH_KEY \'.[] | select(.name | contains($DO_SSH_KEY)) | .fingerprint\'\n')),(0,r.kt)("p",null,"Setup lab"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"# list available images\nmake do-images\n\n# list droplets\nmake do-list\n\n# create droplet (with docker)\nmake do-create\n\n# delete droplet\nmake do-delete\n")),(0,r.kt)("p",null,"Start lab"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"# access droplet\nmake do-access\n\n# clone repo\ngit clone https://github.com/niqdev/strawhatsec.git && \\\n  cd strawhatsec && \\\n  apt install make\n\n# start lab\nmake htb-up\nmake htb-down\nmake htb-logs\n")),(0,r.kt)("p",null,"Access lab locally"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'# download vpn config to "./ctf/htb/*.ovpn"\nhttps://www.hackthebox.eu/home/htb/access/ovpnfile\n\n# (wait for containers to start) upload vpn config from local machine into shared container volume\nmake do-htb-vpn\n\n# tunnel docker ports LOCAL_PORT:PUBLIC_IP:REMOTE_PORT\nmake do-htb-tunnel\n\n# vnc\n# lab: 5900/6080\n# reverse: 5901\n# burpsuite: 5902\nvncviewer localhost:5900\nhttp://localhost:6080\n\n# access containers [lab|reverse|burpsuite|metasploit]\ndocker exec -it htb-lab bash\n\n# connect to htb\nopenvpn /share/*.ovpn\n\n# wordlists path\nll /usr/share/wordlists\n# tools path\nll /opt\n')),(0,r.kt)("p",null,"Start temporary containers"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"# ubuntu\ndocker run --rm --name phusion -v htb_wordlists:/share phusion/baseimage:master-amd64\ndocker exec -it phusion bash\n\napt update\napt install hashcat\n\n# https://hashcat.net/wiki/doku.php?id=example_hashes\nhashcat -a 3 -m <HASH_MODE> '<HASH_VALUE>' /share/rockyou.txt\n")))}u.isMDXComponent=!0},3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>h});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=a.createContext({}),s=function(e){var t=a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=s(e.components);return a.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,c=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),d=s(n),h=r,m=d["".concat(c,".").concat(h)]||d[h]||u[h]||o;return n?a.createElement(m,l(l({ref:t},p),{},{components:n})):a.createElement(m,l({ref:t},p))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,l=new Array(o);l[0]=d;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:r,l[1]=i;for(var s=2;s<o;s++)l[s]=n[s];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"}}]);