#!/bin/ash

echo "Burp Suite LISTEN on port 8081 ..."

# forward internal port 8080 and listen on 8081
socat tcp-l:8081,fork,reuseaddr tcp:127.0.0.1:8080 &

java -jar /opt/burp/burpsuite.jar
