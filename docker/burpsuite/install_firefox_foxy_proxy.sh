#!/bin/ash

echo "Download FoxyProxy add-on ..."
# https://addons.mozilla.org/en-US/firefox/addon/foxyproxy-standard
wget -q -P /tmp https://addons.mozilla.org/firefox/downloads/latest/2464/addon-2464-latest.xpi

echo "Continue the installation on Firefox ..."
firefox /tmp/addon-2464-latest.xpi &
