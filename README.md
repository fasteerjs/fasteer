# Fasteer.js

Small library too bootstrap Fastify in your Node.js project built with TypeScript.

## Getting Started

Getting started is easy. You can hook Fasteer in your already existing Fastify instance.

### Installation

```s
$ npm i @fasteerjs/fasteer
# or if you are using Yarn
$ yarn add @fasteerjs/fasteer
```

### Initializition

You can add Fasteer with the hookFastify() function.

```ts
import { hookFastify } from "@fasteerjs/fasteer"

const fasteer = hookFastify({
  port: 4200,
  controllers: [`${__dirname}/controllers/AppController.ts`],
  // ... your settings here
})

fasteer
  .listen()
  .then(address => console.log("Fasteer started!"))
  .catch(error => console.log(error))
```

And that is all! You can even hook Fasteer to an existing Fastify instance

```ts
import { hookFastify } from "@fasteerjs/fasteer"
import fastify from "fastify"

const app = fastify()

const fasteer = hookFastify(
  {
    // ...settings
  },
  app
) // <-- Fastify

// ...
```

## Controllers

### Importing controllers

#### When using Fasteer

All controllers are registered via the `controllers` property in options passed to the `hookFastify` function

For example: 
```ts
import path from "path"
import { hookFastify } from "@fasteerjs/fasteer"

const app = hookFastify({
  controllers: [
    path.join(__dirname, "controllers", "YourController.ts") // Registering a Specific Controller
    path.join(__dirname, "controllers", "*Controller.ts") // Registering all *Controller.ts files under the controllers folder
  ]
})
```
You can use any glob syntax while defining a path for a controller, as Fasteer uses Glob under the hood.

#### Standalone

If you only want to use Fasteer's Controllers, you can use the `useControllers` hook.

For example:
```ts
import path from "path"
import { useControllers } from "@fasteerjs/fasteer"
import fastify from "fastify"

const app = fastify()

useControllers(app, {
  controllers: [
    path.join(__dirname, "controllers", "YourController.ts") // Registering a Specific Controller
    path.join(__dirname, "controllers", "*Controller.ts") // Registering all *Controller.ts files under the controllers folder
  ]
})
```
Of course you can also define a global route prefix for all controllers as you can accomplish with hookFastify.
You just need to pass the `globalPrefix` property to the options
```ts
// ...

useControllers(app, {
  controllers: [ 
    // ...
  ],
  globalPrefix: "/api"
})
```
this will prefix all registered controller's routes with `/api`.

## Available Options

These are all the available configuration options.

### Port

(Required)
<br>

```ts
port: number | string
```

Port for the application. When a string is passed, it is casted to a Number.

### Host

(Optional)

```ts
host?: string
```

Hostname to bind the application for. By default it is "127.0.0.1".

### Controllers

(Required)
<br>

```ts
controllers: string | string[]
```

You can register paths for your controllers.
It can either be a string or array of strings.

You can also use a glob syntax for paths, see [glob](https://www.npmjs.com/package/glob).

<br>

Example:

```ts
controllers: [
  path.join(__dirname, "controllers", "**", "*.ts"),
  path.join(__dirname, "SpecialController.ts"),
]
```

### Global Prefix

(Optional)

<br>

```ts
globalPrefix?: string
```

Adds to a global prefix to controller routes. For example if you set globalPrefix to "/api", all routes will start with "/api". By default it is "/".

### CORS

(Optional)

<br>

```ts
cors?: boolean | string
```

Enables the `fastify-cors` plugin. By default it is `false`. When set to a string, it sets the value of the `Access-Control-Allow-Origin` header.

Examples:

```ts
cors: true // Access-Control-Allow-Origin: *
cors: "domain.tld" // Access-Control-Allow-Origin: domain.tld
```

### Helmet

(Optional)

<br>

```ts
helmet?: boolean | Parameters<typeof helmet>[0]
```

Enables the `fastify-helmet` plugin. by default it is `false`. Setting it to a boolean either enables it with default settings or disables it. You can also pass an object which is settings for helmet, for more information see [helmet documentation](https://helmetjs.github.io/).

### Error Handler

(Optional)

<br>

```ts
errorHandler?: (
  this: FastifyInstance,
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => void;
```

Handles exceptions that occur in requests. By default is just handles the response and sends out Error 500 / 419 based on whether it is a validation error, and also sends a stack trace in development mode.

### Development

(Optional)

<br>

```ts
development?: boolean;
```

Enables or disables the development mode. When enabled, additional debug information is provided, like stack trace in response. By default it is set to false.

# Credits

2020 &copy; Filip Vottus &ndash; All Rights Reserved

## Used Open Source Software

- Fastify (+ plugins)
  - https://github.com/fastify
- Glob
  - https://github.com/isaacs/node-glob

# License

Fasteer.js is licensed under MIT. See the LICENSE file.
