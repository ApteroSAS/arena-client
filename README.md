# Three.js TypeScript colyseus arena client template
// add disc  
// how it works with arena
## Features

- **TypeScript** supported
- **Webpack** integrated

## Technical Documentation

- [Colyseus](https://www.colyseus.io/)
- [Typescript](https://www.typescriptlang.org/docs/)
- [Three.js](https://threejs.org/)
 
## Installation
1.Get the server connection link:

- Sign up for a [Arena Cloud Account](https://console.colyseus.io/register)
- Create your Arena server
- Upload your  code server,make sure to build  your code first and  then upload the content of the build folder (lib folder)
- Deploy your code server
- Utilize the Arena Dashboard to configure your server  and set the average CCU for scaling and max CCU per server
- Get the server connection link from the arena dashboard and use  it in the client configuration to connect the client with the server

2.Clone the repository
```
git clone https://github.com/ApteroSAS/arena-client.git
```

3.To be able to build the client application, you'll need to enter in the folder, and install the required dependencies first
```
cd ArenaClient
npm install
```
4.To configure the client application and connect it to the server:
# Running the server locally
If you want to run your server locally go to https://github.com/ApteroSAS/arena-server.git.
# Running the Arena Colyseus Server
If you want to run the Arena Colyseus Server, go to the webpack.prod.js file and add the endpoint that you obtain from your Arena cloud Account.
```typescript
  plugins: [
        new webpack.DefinePlugin({
          "process.env.ENDPOINT": JSON.stringify("YOUR_SERVER_URL") //replace YOUR_SERVER_URL with the connection URL that you get from arena colyseus
        })
      ]
```
## How to run

```
npm run start
```

Webpack has been pre-configured to provide a auto opening development server with live reload support. After running above command, your browser will automatically open http://localhost:9999/ and serve the Three.js scene.  

Making code changes will auto reload the served webpage and reflect changes made.


## Building for production

```
npm run build
``` 
## Connecting to server
```typescript
import { Client } from "colyseus.js";
const ENDPOINT = process.env.ENDPOINT;
export const client = new Client(ENDPOINT);
```
## Joining to a room
joinOrCreate callback is used for joining, creating room and return the  client seat reservation
```typescript
this.room = await this.client.joinOrCreate("my_room"||process.env.roomName);//roomName is the identifier set within the server parameters.
```
## OnAdd
The onAdd callback  allows the client to listen to the state of a room if another client joins it.The onAdd callback can only be used in collection of items (MapSchema, ArraySchema...).This callback  is called with the new instance and its key on holder object as argument.


The onChange callback is used to  detect changes inside a collection of non-primitive types (holding Schema instances).
```typescript
this.room.state.players.onAdd = (player: any, key: any) => {
  //add additional code here 
  player.onChange = function (changes) {
    changes.forEach((change) => {
      console.log(change.field);
      console.log(change.value);
      console.log(change.previousValue);
    });
  };
  //add additional code here 
};

```
## OnRemove
The onRemove callback can only be used in maps (MapSchema) and arrays (ArraySchema). The onRemove callback is called with the removed instance and its key on holder object as argument.
```typescript
this.room.state.players.onRemove = (player: any, sessionId: any) => {
  this.remove(player, sessionId);
  //add your logic to remove your entity from the world
};

```
## Send data to the server
The send callback is used to send a type of message to the  server(Colyseus room).
```typescript
this.room.send("move", {
    x: this.cube.position.x,
    y: this.cube.position.y,
    xr: this.cube.rotation.x,
    yr: this.cube.rotation.y,
    lastUpdate: Date.now(),
  });
  
 ```
