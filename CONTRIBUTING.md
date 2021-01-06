## Before Contributing

Please read all documentation.

If in doubt ask make an issues or pull request.

Please write tests.

## About this project

There are two parts of the project

* A nodejs application that
  * starts a TCP Server that the BizHawk Lua script will connect to. 
  * Connects to Twitch and responds to chat commands / rewards and sends them to over the TCP socket

* The lua script that listens for the TCP socket and sets the state of the emulator

# Building the nodejs project

```
npm i
```

```
npm run package
```

## Running tests

```
npm test
```

# Testing the Lua script

If the Lua script is run outside of the BizHawk environment the test suite at the bottom will be run

```
lua bizhawk-crowd-shuffler.ua
```
