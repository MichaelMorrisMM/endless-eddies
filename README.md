# EndlessEddies
**Work in Progress**

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
2. Install Apache Tomcat 9 (at least 9.0.6)
    1. Define `CATALINA_HOME` system environment variable (path to Tomcat folder)
3. Install Node.js (at least 9.8.0)
    1. Update `PATH` system environment variable to include nodejs
4. Install Gradle (at least 4.6)
    1. Update `PATH` system environment variable to include gradle/bin
5. Install Angular CLI (at least 1.7.3)
6. Download SQLite 3 and run `make_database` script after defining `ENDLESS_EDDIES_CONFIG_DIR` (specified below)
7. Clone repo
8. Define `ENDLESS_EDDIES_CONFIG_DIR` system environment variable (path to working directory for application)

`gradle deployAll` will deploy the entire application to the Tomcat webapps folder. 
To start the Tomcat server, `start_tomcat.cmd` has been provided in the "scripts" folder (Windows users). 
To detect any changes, re-deploy and restart the Tomcat server. 
**NOTE:** Shutdown the Tomcat server before starting it up again. 
The Tomcat server runs at `http://localhost:8080/` by default.

For normal development, use `gradle deployJava` to deploy only the back-end code to the Tomcat server.
Then use `start_dev_server.cmd` (provided in "scripts", only for Windows users) to deploy front-end code. 
This server runs at `http://localhost:4200/` by default. 
The Angular application will automatically reload if you change any of the front-end source files.

## Angular CLI - Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Angular CLI - Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Angular CLI - Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Angular CLI - Further help
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.3.

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Icons
Material design icons provided by [Icons8](https://icons8.com/icon/new-icons/material).

**Work in Progress**
