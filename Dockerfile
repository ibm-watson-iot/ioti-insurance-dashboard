FROM nginx

MAINTAINER "Fatih Ulusoy" <ulusoy@de.ibm.com>

# Install NodeJs-6
RUN apt-get update &&\
    apt-get install -y sudo curl git gnupg2 &&\
    curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - &&\
    apt-get install -y nodejs &&\
    npm install -g bower &&\
    npm install -g brunch

WORKDIR /iot4i-starter-dashboard
COPY package.json package-lock.json bower.json /iot4i-starter-dashboard/
RUN npm install &&\
    bower install --allow-root

ADD . /iot4i-starter-dashboard

RUN brunch build

RUN cp -a ./public/. /usr/share/nginx/html/ &&\
    rm -rf app &&\
    rm -rf bower_components &&\
    rm -rf node_modules &&\
    rm -rf public

# expose both the HTTP (80) and HTTPS (443) ports
EXPOSE 80 443
