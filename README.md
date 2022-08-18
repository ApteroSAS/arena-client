# Three.js TypeScript colyseus arena client template


## Features

- **TypeScript** supported
- **Webpack** integrated

## Technical Documentation

- [Colyseus](https://www.colyseus.io/)
- [Typescript](https://www.typescriptlang.org/docs/)
- [Three.js](https://threejs.org/)
 
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
4.To configure the client application and connect it to the server go to the webpack config file and add the endpoint link
```typescript
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
# Connecting to server
```typescript
import { Client } from "colyseus.js";
const ENDPOINT = process.env.ENDPOINT;
export const client = new Client(ENDPOINT);
```
# Joining to a room
```typescript
const room = await this.client.joinOrCreate("my_room"||process.env.room_name);
```
## OnAdd
The onAdd callback  allows the client to listen to the state of a room if another client joins, it can only be used in collection of items (MapSchema, ArraySchema...).The onAdd callback is called with the new instance and its key on holder object as argument.

```typescript
this.my_room.state.players.onAdd = (player: any, key: any) => {
  player.onChange = function (changes) {
    changes.forEach((change) => {
      console.log(change.field);
      console.log(change.value);
      console.log(change.previousValue);
    });
  };
};

```
## OnRemove
The onRemove callback can only be used in maps (MapSchema) and arrays (ArraySchema). The onRemove callback is called with the removed instance and its key on holder object as argument.
```typescript
    this.my_room.state.players.onRemove = (player: any, sessionId: any) => {
        this.remove(player, sessionId);
      };
     ```
## Send data to the room
```typescript
     this.my_room.send("move", {
          x: this.cube.position.x,
          y: this.cube.position.y,
          xr: this.cube.rotation.x,
          yr: this.cube.rotation.y,
          lastUpdate: Date.now(),
        });
     ```
