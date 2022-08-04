import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";

export class Cube extends Mesh {
//    new BoxGeometry(0.05,0.05, 0.05, 1, 1, 1),
    constructor(x1:any,x2:any,x3:any) {
        super(
            new BoxGeometry(x1,x2,x3, 1, 1, 1),
            new MeshBasicMaterial({})
        );
    }

    public rotate(): void {
        this.rotation.x += 0.01;
        this.rotation.y += 0.01;
    }



}