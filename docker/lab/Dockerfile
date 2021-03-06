FROM edgelevel/alpine-xfce-vnc:web

RUN apk add --no-cache \
  openssh \
  openvpn

RUN apk add --no-cache \
  nmap \
  nmap-scripts \
  tcpdump \
  proxychains-ng \
  exiftool \
  john

# add gui
RUN apk add --no-cache \
  wireshark   

# add fuzzer
# alternative: dirb, dirbuster, dirsearch
RUN go install github.com/OJ/gobuster/v3@latest && \
  go get -u github.com/ffuf/ffuf

# add privesc
RUN git clone --depth 1 https://github.com/carlospolop/privilege-escalation-awesome-scripts-suite.git \
  /opt/privilege-escalation-awesome-scripts-suite && \
  git clone --depth 1 https://github.com/rebootuser/LinEnum.git \
  /opt/LinEnum
