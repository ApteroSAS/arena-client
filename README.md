# Three.js TypeScript client template


## Features

- **TypeScript** supported
- **Webpack** integrated

## Technical Documentation

-[Colyseus](https://www.colyseus.io/)
-[Typescript](https://www.typescriptlang.org/docs/)
-[Three.js](https://threejs.org/)
 
## Installation
1.Get the server connection link at [Arena](https://console.colyseus.io/login)

2.Clone the repository
```
git clone https://github.com/ApteroSAS/arena-client.git
```

3.To be able to build the client application, you'll need to enter in the folder, and install the required dependencies first.
```
cd ArenaClient
npm install
```
4.To configure the client application and connect it to the server go to the webpack config file an add the endpoint link
```
  plugins: [
        new webpack.DefinePlugin({
          "process.env.ENDPOINT": JSON.stringify("ws://localhost:2567")
        })
      ]
```
## How to run

```
npm run start
```

Webpack has been pre-configured to provide a auto opening development server with live reload support. After running above command, your browser will automatically open http://localhost:9999/ and serve the Three.js scene.  

Making code changes will auto reload the served webpage and reflect changes made.


# Building for production

```
npm run build
```

Webpack has been pre-configured to build the project to `./dist` with support for source mapping.
 
![Connecting to server](image.png)
![Joining to a room](image.png)
