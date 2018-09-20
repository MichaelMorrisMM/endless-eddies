# start with latest tomcat 9 image
FROM tomcat:9
# copy endless-eddies.war into tomcat's webapps directory
ADD build/libs/endless-eddies.war /usr/local/tomcat/webapps/
# set the endless eddies config directory
ENV ENDLESS_EDDIES_CONFIG_DIR /var/lib/endless-eddies
# copy empty database into config directory
WORKDIR /var/lib/endless-eddies
ADD build/database/endless_eddies.db .
