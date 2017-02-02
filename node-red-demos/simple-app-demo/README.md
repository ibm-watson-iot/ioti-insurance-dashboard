
# Overview
A demo web application using [node-red-contrib-ibm-ioti](https://github.com/alronz/node-red-contrib-ibm-ioti) and IBM service [IoT for insurance](https://console.ng.bluemix.net/docs/services/IotInsurance/index.html). 


# How to run

This application is designed to be deployed and run in IBM Bluemix. In order to do that, just click the below button. 

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/alronz/iot4i-example-demo-app.git)

After deploying the application, you can access the node-red editor from the main page, then you can find the node-red flow used in this application. To check the UI generated by this node-red flow, you can access it under the route "**/ui**".

To add security for the node-red editor, you can set the below environmental variables in the app dashboard in Bluemix then restart the app:

```
NODE_RED_USERNAME // the user name
NODE_RED_PASSWORD // the passowrd
``` 


# Connect the app to IBM IoT for Insurance service

provide an environmental variable in Bluemix called **uri** which is the same as the one found in the IBM IoT for insurance service console, then restage the app.


# Flow used

The flow used in this application can be found in [flow.json](./defaults/flow.json). 

 