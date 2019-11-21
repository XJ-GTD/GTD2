#!/bin/sh

export VERTICLE_HOME=/opt/duan/ntt
export VERTICLE_FILE=ntt-1.0.0-SNAPSHOT-fat.jar
export VERTICLE_NAME=com.xiaoji.duan.ntt.MainVerticle

ps -ef | grep ntt-1.0.0-SNAPSHOT-fat.jar | grep -v grep |awk '{print $2}' | xargs kill -9

java -cp $VERTICLE_HOME/$VERTICLE_FILE io.vertx.core.Launcher run $VERTICLE_NAME -conf ntt.json
