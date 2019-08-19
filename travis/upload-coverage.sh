#!/bin/bash

if [ $TRAVIS_OS_NAME = 'osx' ]; then
else
  tar -czvf coverage.tar.gz ./coverage
  sshpass -e scp  -o stricthostkeychecking=no coverage.tar.gz root@www.guobaa.com:/opt/dev/coverage/coverage.tar.gz
fi
