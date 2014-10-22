#! /bin/bash
# This will install everything in the home directory
# of the account you install it in. If you use
# it as the default start-up script of when creating
# an instance using gcloud, that will be /home/root.

# Change this to the host of your CloudSQL or MySQL database
HOST="YourHost"

# Change this to your username and password for your databse instance
USER="YourUserName"
PWD="YourPassword"

cd $HOME
sudo apt-get update
sudo apt-get -y install build-essential
sudo apt-get -y install build-essential libxml2-dev libproj-dev libjson0-dev libgeos-dev xsltproc docbook-xsl docbook-mathml
sudo apt-get -y install libproj-dev
sudo apt-get -y install libgdal-dev
sudo apt-get -y install gdal-bin
sudo apt-get -y install python-gdal
sudo apt-get -y install git
sudo apt-get -y install mysql-client-core-5.5
sudo apt-get -y install python g++ make checkinstall
sudo apt-get -y install unzip
sudo apt-get -y install libpq-dev
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
cd $HOME
mkdir src
cd src
git clone http://github.com/ManoMarks/node-mysqlspatial-server.git
cd $HOME
mkdir data
cd data
wget http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/110m/cultural/110m_cultural.zip
unzip 110m_cultural.zip
cd 110m_cultural
cd $HOME
src=$(mktemp -d) && cd $src
wget -N http://nodejs.org/dist/node-latest.tar.gz
tar xzvf node-latest.tar.gz && cd node-v*
./configure
fakeroot checkinstall -y --install=no --pkgversion $(echo $(pwd) | sed -n -re's/.+node-v(.+)$/\1/p') make -j$(($(nproc)+1)) install
sudo dpkg -i node_*
cd $HOME/src/node-mysqlspatial-server
sudo npm install
ogr2ogr -f "MySQL" MySQL:"Markers,host=$HOST,user=$USER,password=$PWD" -lco engine=MYISAM ne_110m_admin_0_countries.shp -nln countries
