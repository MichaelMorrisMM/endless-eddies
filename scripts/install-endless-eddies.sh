#!/bin/bash
# tested with ubuntu-16.04.5-server

# install tomcat8
apt-get -y update
apt-get -y install tomcat8

# get the latest endless-eddies release bundle which includes:
#  - endless_eddies.db # sqlite database with empty tables
#  - endless-eddies.war # java web archive for tomcat
#  - setenv.sh # tomcat environment setup file
cd $(mktemp -d)
wget https://github.com/MichaelMorrisMM/endless-eddies/releases/download/v0.0.2/endless-eddies.tar.gz
tar xf endless-eddies.tar.gz
cd endless-eddies

# setup the sqlite database
export ENDLESS_EDDIES_CONFIG_DIR=/var/lib/endless-eddies/
mkdir -p $ENDLESS_EDDIES_CONFIG_DIR
mv endless_eddies.db $ENDLESS_EDDIES_CONFIG_DIR
chown -R tomcat8:tomcat8 $ENDLESS_EDDIES_CONFIG_DIR

# setup the endless-eddies tomcat environment
mv setenv.sh /usr/share/tomcat8/bin/

# install the tomcat webapp
mv endless-eddies.war /var/lib/tomcat8/webapps/

# restart the tomcat service
systemctl restart tomcat8
