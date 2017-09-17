# twilio-chat-js-cordova-example
This repository contains example Cordova app with Twilio Programmable Chat client usage.
App is running on both iOS and Android (full functionality with FCM and APN pushes including).

## Chat functionality
Twilio Programmable Chat functionality achieved using [cordova-plugin-twilio-chat](https://www.npmjs.com/package/cordova-plugin-twilio-chat) plugin. Additionally in this project there is [chat-client-helper.js](www/js/chat-client-helper.js), which subscribes to all events which Chat library emits, logs it in console and shows on screen once user is logged in.

## Pushes
You will have to create the FCM and APN credentials and certificates by yourself and pass it respectively in iOS and Android projects (through xcode in the iOS project and through `google-services.json` for Android).

You will need to create credentials in the [Twilio Console](https://www.twilio.com/console/chat/credentials) with created certificates and app identifiers and store it in `configuration.json` file. 

For getting push registration id on the iOS/Android device this example uses [phonegap-plugin-push](https://github.com/phonegap/phonegap-plugin-push). Due to this plugin nature it wraps push message to it's own interface and to be able to process the received push in the Chat lib, in this example we are re-building raw notification from PhoneGap's push in the [phonegap-push-reparser.js](www/js/phonegap-push-reparser.js).   

Keep in mind, that to send pushes you have to turn on the push features for your service instance via [Twilio Console](https://www.twilio.com/console/chat) 

## Token provider and Chat configuration
Token is provided by locally running [express.js app](app.js). The app uses ngrok to expose the token provider to the internet - be careful with exposing your actual credentials and secrets to the internet.

Configuration for token provider is stored in the `configuration.json` file. The example with correct structure can be learned from [configuration.example.json](configuration.example.json):
* `tokenGenerator` contains keys needed for token composition (`accountSid`, `signingKeySid`, `signingKeySecret` and `serviceSid` keys) and Credential SIDs for APN and FCM you've created earlier (`fcm` and `apn` keys). 
* `ngrokSubdomain` is optional field if you want to start ngrok with predefined subdomain for token generation
```
{
  "tokenGenerator": {
    "accountSid": "ACxxx",
    "signingKeySid": "SKxxx",
    "signingKeySecret": "xxx",
    "serviceSid": "ISxxx",
    "fcm": "CRxxx",
    "apn": "CRxxx"
  },
  "ngrokSubdomain": "somengroksubdomain"
}
```

Token provider runs on port `3002` on `localhost` and is exposed to the internet with `ngrok` help.

Token provider has multiple exposed endpoints:
 * http://localhost:3002/token (and `http://<yourngroksubdomain>.ngrok.io/token`) token generator GET endpoint, takes in query parameters `identity` and `pushChannel` (`fcm` or `apns`)
 * http://localhost:3002/configuration (and `http://<yourngroksubdomain>.ngrok.io/configuration`) exposes full `configuration.json` for debugging the app

Additionally, ngrok exposes it's own status and inspect endpoint at http://localhost:4040

## Creating your own sample Cordova application with Twilio Chat

### Create new project  
Create new Cordova project with help of cli: `cordova create <project-path> <id> <display-name>`.
 
This repository project was made with this command: `cordova create twilio-chat-js-cordova-example com.twilio.rtd.chat.js.cordova TwilioChatJsCordova`

### Add necessary Cordova plugins to the project:
```
cordova plugin add cordova-plugin-twilio-chat
cordova plugin add cordova-plugin-twilio-common
cordova plugin add phonegap-plugin-push
cordova plugin add cordova-plugin-console
```  
        
### Local Token Provider setup
1. install required node.js modules: `npm install --save-dev body-parser cors express ngrok twilio`
2. create `configuration.json` file in the root folder of the project and fill it with your data (here is the sample [configuration.example.json](configuration.example.json))
3. copy files from this repository: `app.js` and `token-provider.js` to your project root
4. add following section to your project's `package.json`: 
``` 
"scripts": {
    "tokenProvider": "node app.js"
},
```   

### Add Cordova project files to your project
recursively copy `www` folder from this repository to your project

### Android setup 
1. add Android platform to your project: `cordova platform add android`
2. get your `google-services.json` from Firebase Console and put to the root of project
3. add `<resource-file src="google-services.json" target="google-services.json" />` to the `config.xml` inside `<platform name="android">...</platform>` section.
4. try to build your Android project with `cordova build android`

### iOS setup 
1. add iOS platform to your project: `cordova platform add iOS`
2. do the `pod install` inside `platform/ios/` folder 
3. open `<your-project-name>.xcworkspace` file with XCode:
  * add signing profile (we recommend to use automatic signing) to your project
  * enable Push in Capabilities section
4. try to build your iOS project with `cordova build iOS`

## Running the app
1. start the Token Provider with `npm run tokenProvicer` and remember the ngrok url printed in the console.
2. launch the app on Android (`cordova run android`) or iOS (through XCode or with `cordova run ios`)
3. in the login view of the app enter username and token provider host (the ngrok url you've remembered earlier) and press Login button

## TODO
* PushNotification Cordova plugin blocking main thread on iOS for some reason