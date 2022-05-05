import THREE, { PerspectiveCamera, Scene, TextureLoader, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Cube, Sphere } from "./shapes";
import * as Colyseus from "colyseus.js"; 

export class App {

    private renderer: WebGLRenderer;
    private scene: Scene;
    private camera: PerspectiveCamera;
    private controls: OrbitControls;

    private cube: Cube;
    private my_room: Colyseus.Room;
    private client:Colyseus.Client;
    private playerEntities: { [id: string]: THREE.Mesh } = {};
    private allRooms: { [roomId: string]: Colyseus.Room} = {};

     constructor(canvasElem: HTMLCanvasElement, width: number, height: number) {

        this.scene = new Scene();
        this.scene.background = new TextureLoader().load("./assets/textures/background.png");

        this.camera = new PerspectiveCamera(50, width / height, 1, 1000);
        this.camera.lookAt(new Vector3(0, 0, 0));
        this.camera.position.z = 5;

        this.renderer = new WebGLRenderer({
            antialias: true,
            canvas: canvasElem
        });
        
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        this.cube=new Cube();
        this.resize(width, height);
        // verifier si j'ai crée une salle pour rien
        this.my_room=new Colyseus.Room('');
        //ws://ex-rnj.colyseus.de:2567
        //this.client=new Colyseus.Client('wss://n2bcu0.colyseus.de');
        this.client=new Colyseus.Client('ws://localhost:2567');
        console.log('test',this.client);
        
    }

      render() {
        this.cube.rotate();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.render());
       
        this.roam();
        this.move();
        
        this.my_room.send('move',{x:this.cube.position.x,
          y:this.cube.position.y,
          xr:this.cube.rotation.x,
          yr:this.cube.rotation.y
          });

         //console.log('test',this.my_room.state.playersFromOtherRooms);
         
    };
 
      move(){
      this.roam();
      this.cube.position.setX(this.cube.position.x+0.01);
      this.cube.position.setY(this.cube.position.y+0.01);
      
    }
   async join() {
    try {
       const room = await this.client.joinOrCreate("my_room");
       this.my_room = room;
       this.my_room.onStateChange(() => {
       
       });
       /*
       this.my_room.onMessage('foo', (bar) => {
        console.log('hello red');
      });
      */
      
       this.my_room.state.players.onAdd = (player: any, key: any) => {
         //if(player.color=='red'){
          //this.my_room.send('chat',{key:key});
         //}
        // console.log('color',player.color);
         // the current player
         if (room.sessionId == key) {
           this.cube.position.setX(player.x);
           this.cube.position.setY(player.y);
           this.cube.position.setZ(player.z);
           this.playerEntities[key] = this.cube;
         }
         else {
           //console.log('here');
           //console.log('color',player);
           
           this.playerEntities[key] = new Cube();
           this.playerEntities[key].position.setX(player.x);
           this.playerEntities[key].position.setY(player.y);
           this.playerEntities[key].position.setZ(player.z);
           
            
           player.onChange = (changes: any) => {
        
            this.playerEntities[key].position.setX(changes[0].value);
            this.playerEntities[key].position.setY(changes[1].value);
           this.playerEntities[key].rotation.set(changes[2].value,changes[3].value,0);
             
           };
           

         }
         // change the cube color
       (<any>this.playerEntities[key].material).color.setColorName(player.color);
        
        this.scene.add(this.playerEntities[key]);
       };
       this.my_room.state.playersFromOtherRooms.onAdd=(playerr:any,key:any)=>{
       
        this.playerEntities[key] = new Cube();
        this.playerEntities[key].position.setX(playerr.x);
        this.playerEntities[key].position.setY(playerr.y);
        this.playerEntities[key].position.setZ(playerr.z);
        playerr.onChange = (changes: any) => {   
          if(this.playerEntities[key]!=null)
          {
            this.playerEntities[key].position.setX(changes[0].value);
            this.playerEntities[key].position.setY(changes[1].value);
            this.playerEntities[key].rotation.set(changes[2].value,changes[3].value,0);
          }
         
       
         
       };
       (<any>this.playerEntities[key].material).color.setColorName(playerr.color);       
        this.scene.add(this.playerEntities[key]);
      }
       this.my_room.state.players.onRemove = (player: any, sessionId: any) => {
        // destroy entity
        this.scene.remove(this.playerEntities[sessionId]);
        this.playerEntities[sessionId].geometry.dispose();
        (<any>this.playerEntities[sessionId].material).dispose();
        (<any>this.playerEntities[sessionId])= undefined;
       // (<any>this.playerEntities[sessionId]).destroy();
      
        // clear local reference
        delete this.playerEntities[sessionId];
      };
      this.my_room.state.playersFromOtherRooms.onRemove = (player: any, sessionId: any) => {
        // destroy entity
        this.scene.remove(this.playerEntities[sessionId]);
        this.playerEntities[sessionId].geometry.dispose();
        (<any>this.playerEntities[sessionId].material).dispose();
        (<any>this.playerEntities[sessionId])= undefined;
       // (<any>this.playerEntities[sessionId]).destroy();
        // clear local reference
        delete this.playerEntities[sessionId];
      };

     } catch (e) {
       console.log("JOIN ERROR", e);
     }
        
  
    }
   public async getRooms()
    {
      try{
        const lobby = await this.client.joinOrCreate("lobby");
        lobby.onMessage("rooms", (rooms) => {
          //console.log(rooms);
        });
        
        // this function is called when a client join a room 
        lobby.onMessage("+", ([roomId, room]) => {
          //console.log('joined');
          if (this.allRooms[roomId] == null) {
            this.allRooms[roomId] = room;
          } 
            for (var key in this.allRooms) {
              //console.log(this.allRooms[key]);
          }
      });
// this function is called when a client leave a room 
      lobby.onMessage("-", (roomId) => {
         //console.log('leave');
      });
      }
      catch(e){
        console.log(e);
      }
    }
    //generate random value
    private randCoOrd(){
        let x = Math.random() * 2 + 1;
        return x *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
      
      }
      private isOutOfBoundsX(x:any){
       ///return ((x >= window.innerWidth / 2) || (x <= (0 - window.innerWidth / 2)));
        return ((x >= 2));
      }
    
      private isOutOfBoundsY(y:any){
       //return ((y >=  window.innerHeight / 2) || (y <= (0 -  window.innerHeight / 2)));
       return ((y >= 2)); 
      }
    
    public resize(width: number, height: number) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    public roam(){
       
        let x = this.cube.position.x;
        let y = this.cube.position.y;
    
        if(this.isOutOfBoundsX(x)){
          this.cube.position.setX(this.cube.position.x*-1);
        }
    
        if(this.isOutOfBoundsY(y)){
            this.cube.position.setY(this.cube.position.y*-1);
        }
      }
     public delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }


}