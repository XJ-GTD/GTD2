#!/bin/bash

if [[ $TRAVIS_OS_NAME == 'osx' ]]; then
  security create-keychain -p travis ios-build.keychain
  # Make the keychain the default so identities are found
  security default-keychain -s ios-build.keychain
  # Unlock the keychain
  security unlock-keychain -p travis ios-build.keychain
  # Set keychain locking timeout to 3600 seconds
  security set-keychain-settings -t 3600 -u ios-build.keychain
   
  # Add certificates to keychain and allow codesign to access them
  security import $TRAVIS_BUILD_DIR/travis/profiles/ios/mwxing.cer -k ~/Library/Keychains/ios-build.keychain -T /usr/bin/codesign
  # 正式发布证书
  #security import $TRAVIS_BUILD_DIRtravis/profiles/ios/mwxing.cer -k ~/Library/Keychains/ios-build.keychain -T /usr/bin/codesign
  security import $TRAVIS_BUILD_DIR/travis/profiles/ios/mwxing-developer.cer -k ~/Library/Keychains/ios-build.keychain -T /usr/bin/codesign
  # 正式发布证书
  security import $TRAVIS_BUILD_DIRtravis/profiles/ios/mwxing.p12 -k ~/Library/Keychains/ios-build.keychain -P $IOS_KEY_PASSWORD -T /usr/bin/codesign
  security import $TRAVIS_BUILD_DIR/travis/profiles/ios/mwxing-developer.p12 -k ~/Library/Keychains/ios-build.keychain -P $IOS_KEY_PASSWORD -T /usr/bin/codesign
   
  echo "list keychains: "
  security list-keychains
  echo " ****** "
   
  # Put the provisioning profile in place
  mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
  #cp "./scripts/profile/team.mobileprovision" ~/Library/MobileDevice/Provisioning\ Profiles/
  cp "$TRAVIS_BUILD_DIR/travis/profiles/ios/$IOS_PROFILE_NAME.mobileprovision" ~/Library/MobileDevice/Provisioning\ Profiles/

  echo "find indentities keychains: "
  security find-identity -p codesigning  ~/Library/Keychains/ios-build.keychain
  echo " ****** "

fi
