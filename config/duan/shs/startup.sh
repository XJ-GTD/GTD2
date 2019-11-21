#!/bin/sh

export VERTICLE_HOME=/opt/duan/shs
export VERTICLE_FILE=shs-1.0.0-SNAPSHOT-fat.jar
export VERTICLE_NAME=com.xiaoji.duan.shs.MainVerticle

ps -ef | grep shs-1.0.0-SNAPSHOT-fat.jar | grep -v grep |awk '{print $2}' | xargs kill -9

java -cp $VERTICLE_HOME/$VERTICLE_FILE io.vertx.core.Launcher run $VERTICLE_NAME -conf shs.json
