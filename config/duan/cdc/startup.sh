#!/bin/sh

export VERTICLE_HOME=/opt/duan/cdc
export VERTICLE_FILE=cdc-1.0.0-SNAPSHOT-fat.jar
export VERTICLE_NAME=com.xiaoji.duan.cdc.MainVerticle

ps -ef | grep cdc-1.0.0-SNAPSHOT-fat.jar | grep -v grep |awk '{print $2}' | xargs kill -9

java -cp $VERTICLE_HOME/$VERTICLE_FILE io.vertx.core.Launcher run $VERTICLE_NAME -conf cdc.json
