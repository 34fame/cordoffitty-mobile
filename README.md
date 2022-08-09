# Overview

This project is a template for building a client application built with the [Quasar Framework](https://quasar.dev) and integrated with [Firebase](https://firebase.google.com).

This template provides a starting point for building a full-stack application. Out-of-the-box this template implements a complete authentication workflow using the Firebase authentication services.

# Setup

1. Clone this repo
2. Install libraries with `yarn`
3. Start with `quasar dev`
4. Stop by hitting `ctrl-c` or `cmd-c`

# Usage

This project is configured to work out-of-the-box with the [geekforceacademy/firebase-functions-template](https://github.com/geekforceacademy/firebase-functions-template) project. The `firebase-functions-template` provides the emulation of Firebase services that this client requires when running in `local` mode.

## Defaults

### Environment Variables

The `.env` file contains default settings required for this application to work properly with the Firebase emulators that are available from the `firebase-functions-template` project.

## Tips

-  This template only works as a SPA or PWA
-  If you are familiar with Firebase and its tools you can configure and run the auth emulator within this project and avoid having to use the `firebase-functions-template` project. This is only recommended if you only intend to use the Firebase authentication service.

```
pod 'RobingenzCapacitorFirebaseAuthentication/Google', :path => '../../node_modules/@robingenz/capacitor-firebase-authentication'
```

```json
{
   "appId": "com.cordoffitty.app",
   "appName": "Cordoffitty Operator",
   "bundledWebRuntime": false,
   "npmClient": "yarn",
   "webDir": "www",
   "plugins": {
      "FirebaseAuthentication": {
         "skipNativeAuth": false,
         "provider": ["google.com"]
      }
   },
   "server": {
      "url": "http://192.168.0.200:8083"
   }
}
```

```json
{
   "name": "cordoffitty",
   "version": "0.0.1",
   "description": "A Quasar Framework app",
   "private": true,
   "dependencies": {
      "@capacitor/app": "1.1.1",
      "@capacitor/cli": "3.4.0",
      "@capacitor/core": "3.4.0",
      "@capacitor/geolocation": "1.3.1",
      "@capacitor/ios": "3.4.0",
      "@capacitor/splash-screen": "^1.0.0",
      "@robingenz/capacitor-firebase-authentication": "0.4.1",
      "firebase": "9.6.5"
   },
   "author": ""
}
```
