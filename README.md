# Three.js TypeScript client template


## Features

- **TypeScript** supported
- **Webpack** integrated

## Technical Documentation

-[Colyseus](https://www.colyseus.io/)
-[Typescript](https://www.typescriptlang.org/docs/)
-[Three.js](https://threejs.org/)
 
## Installation
1.Get the server connection link at (https://console.colyseus.io/login)
Clone the template repository
```
git clone https://github.com/ApteroSAS/arena-client.git
```

To be able to build the client application, you'll need to enter in the folder, and install the required dependencies first.
```
cd ArenaClient
npm install
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
 
# Configuration 
## Connecting to server
to configur the client application and connect it to the server go to the 
![Connecting to server](image.png)
![Joining to a room](image.png)
