FROM ruby:2.7.2-alpine3.13

RUN apk add --no-cache \
  bash \
  git \
  openvpn

# metasploit dependencies only
RUN apk add --no-cache \
  autoconf \
  bison \
  build-base \
  libffi-dev \
  libpcap-dev \
  libxml2-dev \
  libxslt-dev \
  openssl-dev \
  ncurses \
  postgresql-dev \
  ruby-dev \
  readline-dev \
  sqlite-dev \
  yaml-dev \
  zlib-dev

# add metasploit
RUN git clone --depth 1 https://github.com/rapid7/metasploit-framework.git /usr/share/metasploit-framework && \
  cd /usr/share/metasploit-framework && \
  gem update --system && \
  bundle update --bundler && \
  bundle install && \
  ln -sf /usr/share/metasploit-framework/msfconsole /usr/local/bin/msfconsole

# add searchsploit (ignore exploitdb-papers)
COPY .searchsploit_rc /root/
RUN git clone --depth 1 https://github.com/offensive-security/exploitdb.git /opt/exploitdb && \
  ln -sf /opt/exploitdb/searchsploit /usr/local/bin/searchsploit

CMD [ "/bin/bash" ]
