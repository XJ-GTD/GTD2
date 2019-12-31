#!/bin/sh

ps -ef | grep cdc-1.0.0-SNAPSHOT-fat.jar | grep -v grep |awk '{print $2}' | xargs kill -9
