#!/bin/bash

if [[ $# -eq 1 && $1 = "amq" ]] ; then
  cd /root/activemq-cluster/
  sh deploy-activemq.sh
elif [[ $# -eq 1 && $1 = "exe" ]] ; then
  cd /root/executor-stack/
  sh deploy-executor.sh
elif [[ $# -eq 1 && $1 = "mwx" ]] ; then
  cd /root/mwxing-stack/
  sh deploy-mwxing.sh
fi

