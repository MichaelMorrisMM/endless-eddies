# EndlessEddies
Some programmers want to make their applications available online, but don’t have the time or knowledge to build a robust website to host them.  Endless Eddies, designed in collaboration with Professor Tony Saad from the Department of Chemical Engineering, is a framework which allows users to build a web server and application without writing any HTML, CSS, or Javascript.  Fully configurable, it dynamically builds a local database, web pages, and request forms so that the user’s program can be shared online. Account administration and authentication is provided by the framework as well, allowing users to log in and view past results from the application.  With Endless Eddies, an unlimited number of applications can be shared with little effort on the part of the programmer.

Additional user help is available in the project `Wiki`.

## Installation and Deployment (Non-Developers)
1. Download and execute [Endless Eddies installer](https://github.com/MichaelMorrisMM/endless-eddies/blob/master/scripts/install-endless-eddies.sh)
    - `curl https://raw.githubusercontent.com/MichaelMorrisMM/endless-eddies/master/scripts/install-endless-eddies.sh | sudo bash`
    - This script will:
      1. Install tomcat8
      1. Download the endless eddies release bundle
      1. Setup endless eddies
1. Use a browser to navigate to: `http://<server-ip-address>:8080/endless-eddies`

## Installation and Deployment (Developers)
1. Install Java 8 JDK (at least Update 161)
    1. Define `JAVA_HOME` system environment variable (path to JDK folder)
    2. Update `PATH` system environment variable to include jdk/bin
2. Install Apache Tomcat 8
    1. Define `CATALINA_HOME` system environment variable (path to Tomcat folder)
3. Install Node.js (at least 9.8.0)
    1. Update `PATH` system environment variable to include nodejs
4. Install Gradle (at least 4.6)
    1. Update `PATH` system environment variable to include gradle/bin
5. Install Angular CLI (at least 1.7.3)
6. Clone repo
7. Define `ENDLESS_EDDIES_CONFIG_DIR` system environment variable (path to working directory for application)
8. Download SQLite 3 and run `gradle deployDatabase`

`gradle deployWar` will deploy the entire application to the Tomcat webapps folder. 
To start the Tomcat server, `start_tomcat.cmd` has been provided in the "scripts" folder (Windows users). 
To detect any changes, re-deploy and restart the Tomcat server. 
**NOTE:** Shutdown the Tomcat server before starting it up again. 
The Tomcat server runs at `http://localhost:8080/` by default.

For normal development, use `gradle deployJava` to deploy only the back-end code to the Tomcat server and start Tomcat.
Then use `start_dev_server.cmd` (provided in "scripts", only for Windows users) to deploy front-end code. 
This second server runs at `http://localhost:4200/` by default. 
The Angular application will automatically reload if you change any of the front-end source files. Any changes to the back-end will still require a re-deploy and restart.

## HTTPS
Documentation for properly setting up your server with https (using a certificate provided by Let's Encrypt) is provided in the `docs` folder. Additionally, `gradle createSelfSignedCert` is provided to developers for convenience (this task uses the Java keytool utility).

## Docker
To create a Docker image of the application, use `gradle buildDockerImage`.

## Angular CLI - Further help
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.3.

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Icons
Material design icons provided by [Icons8](https://icons8.com/icon/new-icons/material).

## Additional Info
Endless Eddies is a senior capstone project for the University of Utah School of Computing.
