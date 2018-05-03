#!/bin/bash
# tested with ubuntu-16.04.4-server

# install java
sudo apt-get -y update
sudo apt-get -y install openjdk-8-jdk-headless

# install tomcat 9
cd $HOME
wget ftp://apache.cs.utah.edu/apache.org/tomcat/tomcat-9/v9.0.7/bin/apache-tomcat-9.0.7.tar.gz
tar xzf apache-tomcat-9.0.7.tar.gz
mv apache-tomcat-9.0.7 apache-tomcat-9
export CATALINA_HOME=$HOME"/apache-tomcat9"

# install node.js and npm
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get -y install nodejs

# clone and build endless-eddies
cd $HOME
sudo apt-get -y install git
git clone https://github.com/MichaelMorrisMM/endless-eddies.git
cd endless-eddies
mkdir conf
export ENDLESS_EDDIES_CONFIG_DIR=$HOME"/endless-eddies/conf"
chmod u+x gradlew
./gradlew deployAll