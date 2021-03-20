FROM edgelevel/alpine-xfce-vnc:base

ARG APKTOOL_VERSION="2.5.0"
ARG DEX2JAR_VERSION="2.1-SNAPSHOT"
ARG JDGUI_VERSION="1.6.6"
ARG GHIDRA_VERSION="9.2.2_PUBLIC_20201229"
ARG GHIDRA_CHECKSUM="8cf8806dd5b8b7c7826f04fad8b86fc7e07ea380eae497f3035f8c974de72cf8"
  
RUN apk add --no-cache \
  firefox-esr \
  xfce4-terminal

RUN apk add --no-cache \
  openjdk11-jdk

RUN apk add --no-cache \
  musl-dev \
  gcc \
  make \
  gdb

# setup apktool
RUN mkdir -p /opt/apktool/ && \
  wget -q -O /opt/apktool/apktool_${APKTOOL_VERSION}.jar \
  https://bitbucket.org/iBotPeaches/apktool/downloads/apktool_${APKTOOL_VERSION}.jar && \
  ln -sf /opt/apktool/apktool_${APKTOOL_VERSION}.jar /opt/apktool/apktool.jar && \
  echo "java -jar /opt/apktool/apktool.jar" > /usr/local/bin/apktool && \
  chmod u+x /usr/local/bin/apktool

# setup dex2jar
# TODO fix hardcoded url `../files/1867564/..`
RUN mkdir -p /opt/dex2jar/ && \
  wget -q -O /opt/dex2jar/dex-tools-${DEX2JAR_VERSION}.zip \
  https://github.com/pxb1988/dex2jar/files/1867564/dex-tools-${DEX2JAR_VERSION}.zip && \
  unzip -q /opt/dex2jar/dex-tools-${DEX2JAR_VERSION}.zip -d /opt/dex2jar && \
  mv /opt/dex2jar/dex-tools-${DEX2JAR_VERSION} /opt/dex2jar/dex-tools && \
  ln -sf /opt/dex2jar/dex-tools/d2j-dex2jar.sh /usr/local/bin/dex2jar

# setup jd-gui
RUN mkdir -p /opt/jd-gui/ && \
  wget -q -O /opt/jd-gui/jd-gui-${JDGUI_VERSION}.jar \
  https://github.com/java-decompiler/jd-gui/releases/download/v${JDGUI_VERSION}/jd-gui-${JDGUI_VERSION}.jar && \
  ln -sf /opt/jd-gui/jd-gui-${JDGUI_VERSION}.jar /opt/jd-gui/jd-gui.jar && \
  echo "java -jar /opt/jd-gui/jd-gui.jar" > /usr/local/bin/jd-gui && \
  chmod u+x /usr/local/bin/jd-gui

# setup ghidra
RUN mkdir -p /opt/ghidra/ && \
  wget -q -O /opt/ghidra/ghidra_${GHIDRA_VERSION}.zip \
  https://ghidra-sre.org/ghidra_${GHIDRA_VERSION}.zip && \
  echo "${GHIDRA_CHECKSUM}  /opt/ghidra/ghidra_${GHIDRA_VERSION}.zip" | sha256sum -c && \
  unzip -q /opt/ghidra/ghidra_${GHIDRA_VERSION}.zip -d /tmp/ghidra/ && \
  mv /tmp/ghidra/ghidra_* /opt/ghidra/ghidra_PUBLIC && \
  ln -sf /opt/ghidra/ghidra_PUBLIC/ghidraRun /usr/local/bin/ghidra
