FROM edgelevel/alpine-xfce-vnc:base

ARG BURP_VERSION=2020.12.1

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
  ln -sf /opt/burp/burpsuite_community_v${BURP_VERSION}.jar /opt/burp/burpsuite.jar && \
  chmod u+x /usr/local/bin/burpsuite /usr/local/bin/install_firefox_foxy_proxy
