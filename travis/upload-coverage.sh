#!/bin/bash

if [ $TRAVIS_OS_NAME = 'linux' ]; then
  tar -czvf coverage.$TRAVIS_BUILD_NUMBER.tar.gz ./coverage
  sshpass -e scp  -o stricthostkeychecking=no coverage.$TRAVIS_BUILD_NUMBER.tar.gz root@www.guobaa.com:/opt/dev/coverage/coverage.$TRAVIS_BUILD_NUMBER.tar.gz
fi
