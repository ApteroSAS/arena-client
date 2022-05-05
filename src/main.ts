import { App } from './app/app';


class Main {

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
    await this.app.getRooms();
             
    }

}

var mn=new Main();
mn.join();
