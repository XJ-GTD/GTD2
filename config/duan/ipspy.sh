#!/bin/bash

gethostip(){
  result=`dig +short $1 | awk 'NR==1{print $0}'`
  url=$1
  #echo $result
  num=`echo $result | grep -E "^(([0-2]*[0-9]+[0-9]+)\.([0-2]*[0-9]+[0-9]+)\.([0-2]*[0-9]+[0-9]+)\.([0-2]*[0-9]+[0-9]+))$" | wc -l`
  #echo $num

  if [ $num -eq 0 ];then
    #echo "This is CNAME"
    gethostip $result
  else
    dig +short $url
  fi
}

cd /opt/duan
mkdir -p .ip/
touch .ip/ip.txt

DEFAULTDOMAIN=vpn730273091.v4.sedns.cn
IPSPYLOCK="./.ip/ipspy.lock"

if [ ! -f "${IPSPYLOCK}" ]; then
  echo "ipspy cron can go..."
  touch $IPSPYLOCK
else
  echo "preview ipspy cron still running..."
  exit 0
fi

if [[ $* = 1 ]] ; then
  IPADDRESS=$(gethostip $1)
else
  IPADDRESS=$(gethostip $DEFAULTDOMAIN)
fi

OLDIP=`cat .ip/ip.txt`

echo $DEFAULTDOMAIN
echo $IPADDRESS
echo $OLDIP

if [[ $IPADDRESS == $OLDIP ]] ; then
  echo "`date -u` not changed"
else
  service nginx restart
  if [[ $? -eq 0 ]] ; then
    echo $IPADDRESS > .ip/ip.txt
  fi
fi

rm -f $IPSPYLOCK
