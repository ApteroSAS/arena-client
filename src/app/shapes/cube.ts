import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";

export class Cube extends Mesh {

    constructor() {
        //var colors = ['red', 'green', 'yellow', 'blue', 'cyan', 'magenta'];
        //let x=Math.floor(Math.random() * (5 + 1) );
        
        super(
            new BoxGeometry(0.4,0.4, 0.4, 1, 1, 1),
            new MeshBasicMaterial({})
        );
    }

    public rotate(): void {
        this.rotation.x += 0.01;
        this.rotation.y += 0.01;
        
      
    }


}