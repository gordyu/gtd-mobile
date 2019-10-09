# gtd-mobile
- Android Studio: 
`ionic cordova emulate android`
- Connected Android Device: 
`ionic cordova run android --device -lc` 
(-l for refresh on updates to code; -c for console logs)

- Mac Xcode:
Download Xcode (gigantic application)
`xcode-select --install`
`sudo npm i -g ios-deploy --unsafe-prem=true` 
Open the project in XCode
Add a certificate under Signing & Capabilities
Select device
Click play button
Wait a very long time for emulated iOS phone to boot