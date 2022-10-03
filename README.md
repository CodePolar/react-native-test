# React Native Test

This project uses React Native bare project setup, so be sure to have the minimun requirements to run it

## Requirements
Need to have installed at least:
* `Android SDK 12`
* `json-server` globally
* Android emulator with `Android 12` installed (use android studio pressets)

## Commands

First, start the `json-server` executing the following command in the project root
`json-server --watch db.json` 

Then, in the project root start metro and the avd using this command `npx react-native run-android`

## Features

This app includes the following views:
- Authentication
  - Register / Login
- Posts
  - Create
  - Delete
  - Update
  - List
- Profile
- Comments
  - List
  - Delete
  - Update
  - Create
- Welcome
