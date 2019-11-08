#!/bin/bash -v

if [ $TRAVIS_OS_NAME = 'osx' ]; then
  gem install xcpretty
  brew install yarn
  brew install https://raw.githubusercontent.com/kadwanev/bigboybrew/master/Library/Formula/sshpass.rb
  brew install git-lfs
  git clone --depth=50 --branch=master https://github.com/leonxi/largefiles.git $HOME/build/leonxi/largefiles
  pwd
  ls -la $HOME/build/leonxi/largefiles/cordova/plugins/baidutts/ios/
  cd $HOME/build/leonxi/largefiles
  echo "scp test"
  sshpass -e scp  -o stricthostkeychecking=no root@www.guobaa.com:/opt/duan/ipspy.cron $HOME/build/leonxi/largefiles/cordova/plugins/baidutts/ios/ipspy.cron
  echo "scp libBaiduASRSDK.a"
  sshpass -e scp  -o stricthostkeychecking=no root@www.guobaa.com:/opt/dev/largefiles/cordova/plugins/baidutts/ios/libBaiduASRSDK.a $HOME/build/leonxi/largefiles/cordova/plugins/baidutts/ios/libBaiduASRSDK.a
  echo "scp libBaiduTTSSDK.a"
  sshpass -e scp  -o stricthostkeychecking=no root@www.guobaa.com:/opt/dev/largefiles/cordova/plugins/baidutts/ios/libBaiduTTSSDK.a $HOME/build/leonxi/largefiles/cordova/plugins/baidutts/ios/libBaiduTTSSDK.a
  echo "scp finished"
  #git lfs install
  #cd $HOME/build/leonxi/largefiles/cordova/plugins/baidutts/ios/
  #git lfs pull
  ls -la $HOME/build/leonxi/largefiles/cordova/plugins/baidutts/ios/
  cd $TRAVIS_BUILD_DIR
  npm install -g ionic@4.1.2 phonegap plugman cordova@6.5.0
else
  yarn global add ionic@4.1.2 phonegap@^8.0.0 plugman cordova@6.5.0
  mkdir -p $ANDROID_HOME/licenses
  echo -e "d56f5187479451eabf01fb78af6dfcb131a6481e" >> $ANDROID_HOME/licenses/android-sdk-license
  echo -e "84831b9409646a918e30573bab4c9c91346d8abd" >> $ANDROID_HOME/licenses/android-sdk-preview-license
fi
