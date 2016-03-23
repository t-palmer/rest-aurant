# Installing Node.js on AWS EC2

This document explains how to deploy Node.js on an AWS EC2 AMI Linux instance. It also explains how to install and run a small test application: rest-aurant.

**rest-aurant** is a small Node.js Express application that implements a REST API to the MongoDB restaurant example dataset.

# Launch and Connect to the AWS Instance

Follow the instructions for Setting Up with Amazon EC2:
 [http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html)

Launch an Amazon Linux AMI instance. You can use a nano sized instance for testing, but you will want at least a micro for any development. To connect to your instance, use an SSH client like PuTTY. I really like MobaXterm. For more details you can go to:
 [http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2\_GetStarted.html#ec2-connect-to-instance-linux](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-connect-to-instance-linux)

Once you are connected, make sure your server has all updates:

**$ sudo yum update -y**

# Build Tools

Install the **Development Tools** that we will use to build Node.js:

**$ sudo yum groupinstall 'Development Tools' -y**

This installs at least the following tools:
git, gcc-c++, g++, make

# Node.js

To install Node.js on AMI Linux we must download the source and build it.

Download the Node.js source:

**$ git clone git://github.com/nodejs/node**

**$ cd node**

Display the available versions of Node.js. Then pick the version of Node.js to install.

**$ git tag -l**

**$ git checkout v4.4.0**

**$ ./configure**

**$ make**

**$ sudo make install**

The make will probably take at least 15 minutes.

After the make and install, verify Node.js is installed:

**$ node --version**

# Configure npm

For some reason on AMI Linux, npm doesn't work with sudo. We can work around this by the following:

**$ sudo ln -s /usr/local/bin/node /usr/bin/node**

**$ sudo ln -s /usr/local/lib/node /usr/lib/node**

**$ sudo ln -s /usr/local/bin/npm /usr/bin/npm**

**$ sudo ln -s /usr/local/bin/node-waf /usr/bin/node-waf**

# forever

Install **forever** so we can keep our node applications running even when we log off of the AWS instance.

**$ sudo npm install forever -g**

You can then start an application like this:

**$ forever start myapp.js**

For more information about forever, check out:
 [https://github.com/foreverjs/forever](https://github.com/foreverjs/forever)

# MongoDB

MongoDB provides detailed instructions for installation on AWS here:
 [https://docs.mongodb.org/manual/tutorial/install-mongodb-on-amazon/](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-amazon/)

This is a summary of the steps:

## Import the MongoDB public key

**$ sudo rpm --import https://www.mongodb.org/static/pgp/server-3.2.asc

## Configure yum

Create a  **/etc/yum.repos.d/mongodb-org-3.2.repo**  file so that you can install MongoDB directly, using yum.

**[mongodb-org-3.2]**

**name=MongoDB Repository**

**baseurl=https://repo.mongodb.org/yum/amazon/2013.03/mongodb-org/3.2/x86\_64/**

**gpgcheck=0**

**enabled=1**

If you uploaded the file to your home directory, you need to move it to the correct location:

**$ sudo mv mongodb-org-3.2.repo /etc/yum.repos.d/**

## Install MongoDB Using yum

To install the latest stable version of MongoDB, issue the following command:

**$ sudo yum install mongodb-org -y**

## Start MongoDB

You can start the  [mongod](https://docs.mongodb.org/manual/reference/program/mongod/#bin.mongod) process by issuing the following command:

**$ sudo service mongod start**

## Configure MongoDB to Start Automatically

You can optionally ensure that MongoDB will start following a system reboot by issuing the following command:

**$ sudo chkconfig mongod on**

## Optional: Disable Transparent Huge Pages

MongoDB recommends that you should [disable transparent huge pages](https://docs.mongodb.org/master/tutorial/transparent-huge-pages/) to enhance performance.

# rest-aurant

This section describes how to install and run a simple Node.js/MongoDB sample application **rest-aurant** to test your deployment.

## Import the MongoDB Sample Dataset

MongoDB provides a sample dataset of rest-aurants. Download the sample from here:

Retrieve the dataset from [https://raw.githubusercontent.com/mongodb/docs-assets/primer-dataset/dataset.json](https://raw.githubusercontent.com/mongodb/docs-assets/primer-dataset/dataset.json) and save to a file named dataset.json.

Import into MongoDB:

**$ mongoimport --db test --collection restaurants --drop --file dataset.json**

## Fork rest-aurant from GitHub

The **rest-aurant GitHub** repository is located here:
 [https://github.com/t-palmer/rest-aurant](https://github.com/t-palmer/rest-aurant)
Log into the GitHub web GUI and fork the **rest-aurant** repository. While you are there I would appreciate it if you would click on both **Star** and **Watch**. Thanks!

Clone the forked repository so you have a local copy of rest-aurant on your AWS instance:

**$ git clone https://github.com/your_github_username/rest-aurant.git**

Now change the directory to your new rest-aurant repository:

**$ cd rest-aurant**

## Deploy and Run rest-aurant

Load the rest-aurant dependencies using npm install:

**$ npm install**

Among other items this loads Express and the MongoDB Node.js driver.

Run rest-aurant using forever:

**$ forever start index.js**

## Open rest-aurant Inbound Port

By default rest-aurant will use port 3000. If you want to use another port just pass it as a parameter after index.js.

In the AWS dashboard in the Security Groups for your instance you need to allow Inbound traffic on the rest-aurant port (default: 3000).

# Test rest-aurant

Test your installation by going to:
 [http://AWS\_HOST:3000/](http://AWS_HOST:3000/)
This should show a simple message to let you know that rest-aurant is up and running.

To see the restaurant documents:
 [http://AWS\_HOST:3000/restaurants](http://AWS_HOST:3000/restaurants)

To see the list of restaurant names with their \_id:
 [http://AWS\_HOST:3000/restaurants/names](http://AWS_HOST:3000/restaurants/names)

To get a specific restaurant by its \_id use something like this:

[http://AWS\_HOST:3000/restaurants/56c7808c6247b30352829106](http://AWS_HOST:3000/restaurants/56c7808c6247b30352829106)