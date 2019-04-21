#!/bin/bash

if [[ $TRAVIS_OS_NAME == 'osx' ]]; then
  security delete-keychain ios-build.keychain

  rm -f ~/Library/MobileDevice/Provisioning\ Profiles/$IOS_PROFILE_NAME.mobileprovision
  #rm -f ~/Library/MobileDevice/Provisioning\ Profiles/team.mobileprovision
fi
