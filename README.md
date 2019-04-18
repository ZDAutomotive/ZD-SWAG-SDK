# ZD-SWAG-SDK

[![NPM](https://nodei.co/npm/zd-swag-sdk.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/zd-swag-sdk/)

The official ZD-SWAG SDK for JavaScript, available for Node.js backends

### In Node.js

The preferred way to install the ZD-SWAG SDK for Node.js is to use the
[npm](http://npmjs.org) package manager for Node.js. Simply type the following
into a terminal window:

```sh
npm install zd-swag-sdk --save
```

## Usage and Getting Started

In a JavaScript(Node.js) file:

```javascript
// import the entire SDK
var swag = require('zd-swag-sdk');
// initialize an individual service
var androidTA = new swag.AndroidProberProxy();
```

In a browser with webpack and babel:

```javascript
import AndroidProberProxy from 'zd-swag-sdk/services/android-prober-proxy'
const androidTA = new AndroidProberProxy({
  host: 'example.com',
  port: 1234
});
```

## Opening Issues
If you encounter a bug with the ZD-SWAG SDK for JavaScript we would like to hear
about it. Search the [existing issues](https://github.com/ZDAutomotive/ZD-SWAG-SDK/issues)
and try to make sure your problem doesn’t already exist before opening a new
issue. It’s helpful if you include the version of the SDK, Node.js or browser
environment and OS you’re using. Please include a stack trace and reduced repro
case when appropriate, too.

The GitHub issues are intended for bug reports and feature requests. For help
and questions with using the ZD-SWAG SDK for JavaScript please make use of the
resources listed in the [Getting Help](https://github.com/ZDAutomotive/ZD-SWAG-SDK#getting-help)
section. There are limited resources available for handling issues and by
keeping the list of open issues lean we can respond in a timely manner.

## Supported Services

Please see [SERVICES.md](./SERVICES.md) for a list of supported services.

## Extended Services

Please see Wiki for extended services not listed in the supported services

## License

This SDK is distributed under the
[MIT License](https://spdx.org/licenses/MIT.html),

