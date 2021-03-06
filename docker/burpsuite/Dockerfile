FROM edgelevel/alpine-xfce-vnc:base

# Burp Suite Community Edition JAR
ARG BURP_VERSION="2021.2.1"
ARG BURP_CHECKSUM="b66f35739cc1154b42a002d924fadbac2e080f42c1b1d14be4848431b044dd74"

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
