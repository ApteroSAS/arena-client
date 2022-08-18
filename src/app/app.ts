import THREE, {
  PerspectiveCamera,
  Scene,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from "three";

import { Cube } from "./shapes";
import * as Colyseus from "colyseus.js";
import { client } from "../network/network";
export class App {
  private renderer: WebGLRenderer;
  private scene: Scene;
  private camera: PerspectiveCamera;
  //  private controls: OrbitControls;

  private cube: Cube;
  private my_room!: Colyseus.Room;
  private client: Colyseus.Client;
  private playerEntities: { [id: string]: THREE.Mesh } = {};
  private sessionID: string = "";
  private roomID: string = "";
  private connected: boolean = false;
  private prevValue: number = 0;

  constructor(canvasElem: HTMLCanvasElement, width: number, height: number) {
    this.scene = new Scene();
    this.scene.background = new TextureLoader().load(
      "./assets/textures/background.png"
    );

    this.camera = new PerspectiveCamera(50, width / height, 1, 1000);
    this.camera.lookAt(new Vector3(0, 0, 0));
    this.camera.position.z = 5;

    this.renderer = new WebGLRenderer({
      antialias: true,
      canvas: canvasElem,
    });

    this.cube = new Cube(0.2, 0.2, 0.2);
    this.resize(width, height);
    this.client = client;
  }

  render() {
    try {
      //this.cube.rotate();
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(() => this.render());
      this.move();
    } catch (e) {
      console.log("error message", e);
    }
  }
  move() {
    if (this.connected) {
      this.roam();
      this.cube.position.setX(this.cube.position.x + 0.01);
      const lastUpdate = Date.now();
      this.my_room.send("move", {
        x: this.cube.position.x,
        y: this.cube.position.y,
        xr: this.cube.rotation.x,
        yr: this.cube.rotation.y,
        lastUpdate: lastUpdate,
      });
    }
  }
  async reconnect() {
    const tryReconnect = () => {
      console.log("try to reconnect");
      setTimeout(() => this.reconnect(), 100);
    };
    try {
      const room = await this.client.reconnect(this.roomID, this.sessionID);
      console.log("joined successfully", room);
      this.connected = true;
      this.my_room = room;
      // add listner
      this.my_room.state.players.onAdd = (player: any, key: any) => {
        this.add(player, key);
      };
      this.my_room.state.players.onRemove = (player: any, sessionId: any) => {
        this.remove(player, sessionId);
      };
      this.my_room.state.playersFromOtherRooms.onAdd = (
        player: any,
        key: any
      ) => {
        this.add(player, key);
      };
      this.my_room.state.playersFromOtherRooms.onRemove = (
        player: any,
        sessionId: any
      ) => {
        this.remove(player, sessionId);
      };
    } catch (e) {
      tryReconnect();
      console.error("join error", e);
    }
  }
  async join() {
    try {
      const room = await this.client.joinOrCreate("my_room");
      this.my_room = room;
      this.roomID = room.id;
      this.sessionID = room.sessionId;
      this.connected = true;
      this.my_room.onLeave(async () => {
        this.connected = false;
        this.my_room.connection.close();
        this.reconnect();
      });
      this.my_room.state.players.onAdd = (player: any, key: any) => {
        this.add(player, key);
      };

      this.my_room.state.playersFromOtherRooms.onAdd = (
        player: any,
        key: any
      ) => {
        this.add(player, key);
      };

      this.my_room.state.players.onRemove = (player: any, sessionId: any) => {
        this.remove(player, sessionId);
      };

      this.my_room.state.playersFromOtherRooms.onRemove = (
        player: any,
        sessionId: any
      ) => {
        this.remove(player, sessionId);
      };
    } catch (e) {
      console.log("JOIN ERROR", e);
    }
  }

  private isOutOfBoundsX(x: any) {
    return x >= 2;
  }

  private isOutOfBoundsY(y: any) {
    return y >= 2;
  }

  public resize(width: number, height: number) {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  public roam() {
    let x = this.cube.position.x;
    let y = this.cube.position.y;

    if (this.isOutOfBoundsX(x)) {
      this.cube.position.setX(this.cube.position.x * -1);
      this.cube.position.setY(this.cube.position.y + 0.5);
    }

    if (this.isOutOfBoundsY(y)) {
      this.cube.position.setY(this.cube.position.y * -1);
    }
  }
  private add(player: any, key: any) {
    if (this.my_room.sessionId == key) {
      if (this.playerEntities[key] == null) {
        this.cube.position.setX(player.x);
        this.cube.position.setY(player.y);
        this.cube.position.setZ(player.z);
        this.playerEntities[key] = this.cube;
        this.cube.position.setX(0.3);
        this.my_room.send("move", {
          x: this.cube.position.x,
          y: this.cube.position.y,
          xr: this.cube.rotation.x,
          yr: this.cube.rotation.y,
          lastUpdate: Date.now(),
        });
      }
    } else {
      let x = 0,
        y = 0,
        xr = 0,
        yr = 0;
      if (this.playerEntities[key] == null) {
        this.playerEntities[key] = new Cube(0.2, 0.2, 0.2);
      }
      this.playerEntities[key].position.setX(player.x);
      this.playerEntities[key].position.setY(player.y);
      this.playerEntities[key].position.setZ(player.z);
      this.playerEntities[key].rotation.set(player.xr, player.yr, 0);
      player.onChange = (changes: any) => {
        if (key != this.sessionID) {
          if (this.prevValue != changes[0].previousValue) {
            console.log(this.prevValue - changes[0].previousValue);
          }
          this.prevValue = changes[0].value;
        }

        changes.map((change: any) => {
          if (change.field == "x") {
            x = change.value;
          }
          if (change.field == "y") {
            y = change.value;
          }
          if (change.field == "xr") {
            xr = change.value;
          }
          if (change.field == "yr") {
            yr = change.value;
          }
        });
        this.playerEntities[key].position.set(x, y, 0);
        this.playerEntities[key].rotation.set(xr, yr, 0);
      };
    }
    // change the cube color
    (<any>this.playerEntities[key].material).color.setColorName(player.color);
    this.scene.add(this.playerEntities[key]);
  }
  private remove(player: any, sessionId: any) {
    this.scene.remove(this.playerEntities[sessionId]);
    this.playerEntities[sessionId].geometry.dispose();
    (<any>this.playerEntities[sessionId].material).dispose();
    (<any>this.playerEntities[sessionId]) = undefined;
    // (<any>this.playerEntities[sessionId]).destroy();

    // clear local reference
    delete this.playerEntities[sessionId];
  }
}
