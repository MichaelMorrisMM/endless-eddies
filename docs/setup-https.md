# Setting up HTTPS

### Steps
1. [Setup DNS records](#setup-dns-records)
1. [Get a SSL certificate](#get-a-ssl-certificate)
1. [Setup tomcat to use SSL](#setup-tomcat-to-use-ssl)

## Setup DNS records
You can use any domain name registrar you prefer when setting up your DNS records. As long as your domain name resolves to your server ip address you can proceed to the next step.

## Get a SSL certificate
### Prerequisites:
- Install endless eddies as normal following the instructions in the [README.md](https://github.com/MichaelMorrisMM/endless-eddies#installation-and-deployment-non-developers)
- Setup tomcat to run as the root user by editing `/etc/default/tomcat8`
```s
TOMCAT8_USER=root
TOMCAT8_GROUP=root
```
- Setup tomcat to run on port 80 by editing `/etc/tomcat8/server.xml`
```xml
<Connector port="80" protocol="HTTP/1.1"
            connectionTimeout="20000"
            URIEncoding="UTF-8"
            redirectPort="443" />
```
- Restart tomcat
  - `sudo systemctl restart tomcat8`
- Verify that everything is working correctly with your domain name on port 80

Let's Encrypt is a free, automated, and open certificate authority. These steps will get a certificate from Let's Encrypt but you can get a certificate from any other certificate authority and skip to the next step. For detailed documentation about Let's Encrypt see:
- https://letsencrypt.org/
- https://certbot.eff.org/

### Getting a cert:
- `sudo apt-get update`
- `sudo apt-get install software-properties-common`
- `sudo add-apt-repository ppa:certbot/certbot`
- `sudo apt-get update`
- `sudo apt-get install certbot`
- `sudo certbot certonly --webroot -w /var/lib/tomcat8/webapps/ROOT -d example.com`

### Renewing a cert:
- `sudo certbot renew`

## Setup tomcat to use SSL
- Install the tomcat native library
  - sudo apt-get install libtcnative-1
- Add an ssl `Listener` to your tomcat config by editing `/etc/tomcat8/server.xml`
```xml
<Listener className="org.apache.catalina.core.AprLifecycleListener" SSLEngine="on" />
 ```
- Add an ssl `Connector` to your tomcat config be editing `/etc/tomcat8/server.xml`
```xml
<Connector
    protocol="org.apache.coyote.http11.Http11AprProtocol"
    port="443" maxThreads="200"
    scheme="https" secure="true" SSLEnabled="true"
    SSLCertificateFile="/etc/letsencrypt/live/example.com/fullchain.pem"
    SSLCertificateKeyFile="/etc/letsencrypt/live/example.com/privkey.pem"
    SSLProtocol="TLSv1+TLSv1.1+TLSv1.2"/>
```
  - __NOTE: make sure `SSLCertificateFile` and `SSLCertificateKeyFile` contain the paths to your certificate files__
- Restart tomcat
  - `sudo systemctl restart tomcat8`
- Verify that everything is working correctly with your domain name and https
