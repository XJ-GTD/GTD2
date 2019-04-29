#!/bin/sh

ps -ef | grep ini-1.0.0-SNAPSHOT-fat.jar | grep -v grep |awk '{print $2}' | xargs kill -9
