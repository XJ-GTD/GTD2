#!/bin/sh

cd /opt/gtd2
git pull

cd /opt/gtd2/TimeApp
ionic cordova run browser -lcs --address 0.0.0.0

