FROM alpine:3.13

RUN apk add --no-cache \
  curl \
  git

RUN mkdir -p /usr/share/wordlists && \
  curl -s -k -L http://mng.bz/DzMn -o /usr/share/wordlists/rockyou.txt && \
  git clone --depth 1 https://github.com/danielmiessler/SecLists.git /usr/share/wordlists/SecLists && \
  ln -sf /usr/share/wordlists /wordlists
