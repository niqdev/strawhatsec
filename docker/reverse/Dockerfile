FROM edgelevel/alpine-xfce-vnc:base

ARG APKTOOL_VERSION="2.5.0"
ARG DEX2JAR_VERSION="2.1-SNAPSHOT"
ARG JDGUI_VERSION="1.6.6"

RUN apk add --no-cache \
  openjdk11-jdk
  
RUN apk add --no-cache \
  firefox-esr \
  xfce4-terminal

# setup apktool
RUN mkdir -p /opt/apktool/ && \
  wget -q -O /opt/apktool/apktool_${APKTOOL_VERSION}.jar \
  https://bitbucket.org/iBotPeaches/apktool/downloads/apktool_${APKTOOL_VERSION}.jar && \
  ln -sf /opt/apktool/apktool_${APKTOOL_VERSION}.jar /opt/apktool/apktool.jar && \
  echo "java -jar /opt/apktool/apktool.jar" > /usr/local/bin/apktool && \
  chmod u+x /usr/local/bin/apktool

# setup dex2jar
RUN mkdir -p /opt/dex2jar/ && \
  wget -q -O /opt/dex2jar/dex-tools-${DEX2JAR_VERSION}.zip \
  https://github.com/pxb1988/dex2jar/files/1867564/dex-tools-${DEX2JAR_VERSION}.zip && \
  unzip /opt/dex2jar/dex-tools-${DEX2JAR_VERSION}.zip -d /opt/dex2jar && \
  mv /opt/dex2jar/dex-tools-${DEX2JAR_VERSION} /opt/dex2jar/dex-tools && \
  ln -sf /opt/dex2jar/dex-tools/d2j-dex2jar.sh /usr/local/bin/dex2jar

# setup jd-gui
RUN mkdir -p /opt/jd-gui/ && \
  wget -q -O /opt/jd-gui/jd-gui-${JDGUI_VERSION}.jar \
  https://github.com/java-decompiler/jd-gui/releases/download/v${JDGUI_VERSION}/jd-gui-${JDGUI_VERSION}.jar && \
  ln -sf /opt/jd-gui/jd-gui-${JDGUI_VERSION}.jar /opt/jd-gui/jd-gui.jar && \
  echo "java -jar /opt/jd-gui/jd-gui.jar" > /usr/local/bin/jd-gui && \
  chmod u+x /usr/local/bin/jd-gui
