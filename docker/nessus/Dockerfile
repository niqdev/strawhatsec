# Ubuntu 18.04 LTS
# http://phusion.github.io/baseimage-docker
FROM phusion/baseimage:bionic-1.0.0-amd64

# see https://www.tenable.com/downloads/nessus
ARG NESSUS_VERSION_ID="12222"
ARG NESSUS_VERSION="Nessus-8.13.1-ubuntu1110_amd64.deb"
ARG NESSUS_PACKAGE="${NESSUS_VERSION}.deb"
ARG NESSUS_PACKAGE_CHECKSUM="52f4fcb298b98bba4873d057df4f0b7eb3a55f6fc803309ecf7a70e16d25ec97"

RUN apt-get update && apt-get upgrade -y

# setup pip
RUN apt-get install -y python3-pip

# setup nessus
RUN curl -s https://www.tenable.com/downloads/api/v1/public/pages/nessus/downloads/${NESSUS_VERSION_ID}/download?i_agree_to_tenable_license_agreement=true \
  -o /tmp/${NESSUS_PACKAGE} && \
  echo "${NESSUS_PACKAGE_CHECKSUM}  /tmp/${NESSUS_PACKAGE}" | shasum -c && \
  dpkg -i /tmp/${NESSUS_PACKAGE} && \
  rm -fr /tmp/${NESSUS_PACKAGE}

# setup supervisor
ADD supervisor* /tmp/
RUN pip3 install supervisor && \
  echo_supervisord_conf > /etc/supervisord.conf && \
  sed -i -r -f /tmp/supervisor.sed /etc/supervisord.conf && \
  mkdir -pv /etc/supervisor/conf.d /var/log/nessus && \
  mv /tmp/supervisor-nessus.ini /etc/supervisor/conf.d/nessus.conf && \
  rm -fr /tmp/supervisor*

CMD ["supervisord", "-c", "/etc/supervisord.conf", "-n"]
