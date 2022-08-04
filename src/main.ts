import { App } from './app/app';


export class Main {

    private app: App;

    constructor() {
        this.app = new App(document.getElementById('three-canvas') as HTMLCanvasElement, window.innerWidth, window.innerHeight);
       
        window.addEventListener("resize", this.resize);
       
       
    }
    private resize = (): void => {
        this.app.resize(window.innerWidth, window.innerHeight);
    }
   async join(){
    await this.app.join();
    this.app.render(); 
   // await this.app.getRooms();
             
    }

}


//for(var i=0;i<1000;i++){
    var mn=new Main();
    mn.join();
//}

