FROM edgelevel/alpine-xfce-vnc:base

# community edition JAR
ARG BURP_VERSION="2020.12.1"
ARG BURP_CHECKSUM="01ca0fc955d47f66067d7dbf19bb4665e4383fbcd2b1815bf4be7bb6b5e2bded"

RUN apk add --no-cache \
  openjdk11-jdk \
  openvpn \
  socat
  
RUN apk add --no-cache \
  firefox-esr \
  xfce4-terminal

COPY run_burpsuite.sh /usr/local/bin/burpsuite
COPY install_firefox_foxy_proxy.sh /usr/local/bin/install_firefox_foxy_proxy

# setup burp suite
RUN mkdir -pv /opt/burp/ && \
  wget -q -O /opt/burp/burpsuite_community_v${BURP_VERSION}.jar \
  https://portswigger.net/burp/releases/download?product=community\&version=${BURP_VERSION}\&type=jar && \
  echo "${BURP_CHECKSUM}  /opt/burp/burpsuite_community_v${BURP_VERSION}.jar" | sha256sum -c && \
  ln -sf /opt/burp/burpsuite_community_v${BURP_VERSION}.jar /opt/burp/burpsuite.jar && \
  chmod u+x /usr/local/bin/burpsuite /usr/local/bin/install_firefox_foxy_proxy
