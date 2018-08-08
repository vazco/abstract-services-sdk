<h1 align="center">
    <a href="https://github.com/vazco">vazco</a>/Abstract Services SDK
</h1>

&nbsp;

<h3 align="center">
  -- Abandonware. This package is deprecated! --
</h3>

&nbsp;

This is abstract frame that helps with build SDK for your Universe Services Server.
This package provides:
- AbstractServicesSDK, which is a simple services manager with option to generate web tokens.
- AbstractService - an abstract representation of client service. You can use connection methods on browser/server environment. 

### AbstractServicesSDK
This is an abstract class of services manager, mostly used to getting instance of some service and to generate webTokens for the clients.
Web tokens should be generated on server side \(to protect a public key against unauthorized using\)

#### Methods

##### AbstractServicesSDK#constructor({url, appId, publicKeyString = '', ServiceClasses = {}}) ServiceClasses['serviceName'] = serviceClass
##### AbstractServicesSDK#generateWebToken({userId = '', groupId = '', sessionId = '', hash = '', ttl = 86400} = {}) *\(expected to be used on server side\)*
##### AbstractServicesSDK#getService(name) returns promise with service
##### AbstractServicesSDK#setToken(token, serviceName='default') sets token `x-app-token` used by default universe auth for services
Parameter token can be type of `string` or `function`, which returns token directly as a `string` or promise with token.
serviceName - can set token/tokenGetter to proper service or to all as a default.

### AbstractService

#### Methods
##### AbstractService#getServiceName() Name of current service
##### AbstractService#getAppId() AppID for service
##### AbstractService#getBaseURL() Url to the host of service
##### AbstractService#setToken(token) sets token `x-app-token` used by default universe auth for services
Parameter token can be type of `string` or `function`, which returns token directly as a `string` or promise with token.
##### AbstractService#request(config=)
##### AbstractService#get(config=)
##### AbstractService#delete(config=)
##### AbstractService#head(config=)
##### AbstractService#post(data[, config=])
##### AbstractService#put(data[, config=])
##### AbstractService#patch(data[, config=])
##### AbstractService#sendStream(onStream[, config=])

#### Request Config
These are the available config options for making requests.

```js
{
   // `baseURL` will be prepended to `url` unless `url` is absolute.
   // It can be convenient to set `baseURL` for an instance of service to pass relative URLs
   // to methods of that instance.
   baseURL: 'https://some-domain.com/service/:serviceName',
   
  // `url` is the server URL that will be added to baseURL unless `url` is absolute
  url: '', // default

  // `method` is the request method to be used when making the request
  method: 'get', // default
  
  // `transformRequest` allows changes to the request data before it is sent to the server
  // This is only applicable for request methods 'PUT', 'POST', and 'PATCH'
  // The last function in the array must return a string, an ArrayBuffer, or a Stream
  transformRequest: [function (data) {
    // Do whatever you want to transform the data

    return data;
  }],

  // `transformResponse` allows changes to the response data to be made before
  // it is passed to then/catch
  transformResponse: [function (data) {
    // Do whatever you want to transform the data

    return data;
  }],

  // `headers` are custom headers to be sent
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` are the URL parameters to be sent with the request
  // Must be a plain object or a URLSearchParams object
  params: {
    prop1: 12345
  },

  // `paramsSerializer` is an optional function in charge of serializing `params`
  // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
  paramsSerializer: function(params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },

  // `data` is the data to be sent as the request body
  // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
  // When no `transformRequest` is set, must be of one of the following types:
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - Browser only: FormData, File, Blob
  // - Node only: Stream
  data: {
    firstName: 'Fred'
  },

  // `timeout` specifies the number of milliseconds before the request times out.
  // If the request takes longer than `timeout`, the request will be aborted.
  timeout: 1000,

  // `withCredentials` indicates whether or not cross-site Access-Control requests
  withCredentials: false, // default

  // `adapter` allows custom handling of requests which makes testing easier.
  // Return a promise and supply a valid response (see [response docs](#response-api)).
  adapter: function (config) {
    /* ... */
  },

  // `auth` indicates that HTTP Basic auth should be used, and supplies credentials.
  // This will set an `Authorization` header, overwriting any existing but you can use `x-app-id` or `x-app-token`
  // `Authorization` custom headers you have set using `headers`.
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },

  // `responseType` indicates the type of data that the server will respond with
  // options are 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json', // default

  // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
  xsrfCookieName: 'XSRF-TOKEN', // default

  // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
  xsrfHeaderName: 'X-XSRF-TOKEN', // default

  // `onUploadProgress` allows handling of progress events for uploads
  onUploadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `onDownloadProgress` allows handling of progress events for downloads
  onDownloadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `maxContentLength` defines the max size of the http response content allowed
  maxContentLength: 2000,

  // `validateStatus` defines whether to resolve or reject the promise for a given
  // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
  // or `undefined`), the promise will be resolved; otherwise, the promise will be
  // rejected.
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },

  // `maxRedirects` defines the maximum number of redirects to follow in node.js.
  // If set to 0, no redirects will be followed.
  maxRedirects: 5, // default

  // `httpAgent` and `httpsAgent` define a custom agent to be used when performing http
  // and https requests, respectively, in node.js. This allows to configure options like
  // `keepAlive` that are not enabled by default.
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

  // 'proxy' defines the hostname and port of the proxy server
  // `auth` indicates that HTTP Basic auth should be used to connect to the proxy, and supplies credentials.
  // This will set an `Proxy-Authorization` header, overwriting any existing `Proxy-Authorization` custom headers you have set using `headers`.
  proxy: {
    host: '127.0.0.1',
    port: 9000,
    auth: : {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  }
}
```
#### Response Schema
The response for a request contains the following information.

```js
{
  // `data` is the response that was provided by the server
  data: {},

  // `status` is the HTTP status code from the server response
  status: 200,

  // `statusText` is the HTTP status message from the server response
  statusText: 'OK',

  // `headers` the headers that the server responded with
  headers: {},

  // `config` is the config that was provided to `service` for the request
  config: {}
}
```

#### Stream Socket

Abstract Service Class has also implemented the socket communication with remote service via binary socket.
Function `myService.sendStream(onStream[,config])` will initiate a binary socket connection.

The Callback `onStream(stream, client)` will be launched just after connection, so this is the place where you can write something to socket.

- `stream.write`
- `stream.end`
- `stream.send`
- `stream.destroy`
- `stream.pause`
- `stream.resume`
- `stream.pipe`
- `stream.on('eventName', () => {})`
- `stream.once('eventName', () => {})`
- `stream.off('eventName', () => {})`

  
### stream.id

A id number identifying the stream. Unique to the given client, but not globally.

### stream.readable

Whether stream is readable.

### stream.writable

Whether stream is writable.

### stream.paused

Whether stream is paused.

### stream.pause()

Pause the stream.

### stream.resume()

Resume the stream.

### stream.end()

Sends an end message, triggering the `end` event and marks `stream.readable` false but does not close the socket.


### stream.write(data)

Returns `true` if data is written immediately or `false` if data is buffered in socket.

Writes `data` through the connection. `data` can be any JSON compatible type or binary data. Note data will not be chunked. `client.send` should be used for chunking.

### stream.destroy()

Immediately closed the socket.

### stream.pipe(destination, [options])

This is a Stream.prototype method available on all Streams.

See:
http://nodejs.org/api/stream.html#stream_stream_pipe_destination_options

### Event: 'data'

`function (data) { }`

Is emitted when data is received through the socket.

For non-binary types, data is received verbatim as sent.

On Node.js, binary data is received as `Buffer`.

On browsers, binary data is received as `ArrayBuffer`.

### Event: 'pause'

`function () { }`

Is emitted when stream is paused.

### Event: 'resume'

`function () { }`

Is emitted when stream is resumed.

### Event: 'end'

`function () { }`

Is emitted when `stream.end` has been called. `stream.readable` is set to `false`.

### Event: 'close'

`function () { }`

Emitted when the connection is destroyed or its underlying socket is closed.


### Event: 'drain'

`function () { }`

Emitted when the underlying socket buffer has drained. Used for stream pipe internals.

### Event: 'error'

`function (error) { }`

If the client emits an error, this event is emitted (errors from the underlying net.Socket are forwarded here). `stream.readable` and `stream.writable` are set to `false`.


## Linting

* ESLINT support is added to the project.
* It's configured for ES2015 and inherited configurations from [graphql/graphql-js](https://github.com/graphql/graphql-js).
* Use `npm run lint` to lint your code and `npm run lintfix` to fix common issues.

## Testing

* You can write test under `__test__` directory anywhere inside `lib` including sub-directories.
* Then run `npm test` to test your code. (It'll lint your code as well).
* You can also run `npm run testonly` to run tests without linting.

## ES2015 Setup

* ES2015 support is added with babel6.
* After you publish your project to NPM, it can be run on older node versions and browsers without the support of Babel.
* This project uses ES2015 and some of the upcoming features like `async await`.
* You can change them with adding and removing [presets](http://jamesknelson.com/the-six-things-you-need-to-know-about-babel-6/).
* All the polyfills you use are taken from the local `babel-runtime` package. So, this package won't add any global polyfills and pollute the global namespace.

### License

<img src="https://vazco.eu/banner.png" align="right">

**Like every package maintained by [Vazco](https://vazco.eu/), Abstract Services SDK is [MIT licensed](https://github.com/vazco/uniforms/blob/master/LICENSE).**
