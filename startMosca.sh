#!/bin/bash  
echo "Startin Mosca"  
cd ~/iot_docs/chapter2/broker
mosca -c index.js -v | pino-pretty ;cd ~/iot_docs/chapter2/api-engine-base && npm start ; mongod
