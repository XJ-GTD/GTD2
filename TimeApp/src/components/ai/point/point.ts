import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {UtilService} from "../../../service/util-service/util.service";
import {AssistantService} from "../../../service/cordova/assistant.service";
import {InputComponent} from "../input/input";
import {EmitService} from "../../../service/util-service/emit.service";

/**
 * Generated class for the Hb01Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'PointComponent',
  template: `
    <div class="aitool" #aitool>
      <b class=" speaking  danger" #light>
        <div class="spinner" (click)="listenStart()">
          <canvas #canvas></canvas>
        </div>
      </b>

      <div class="inputioc" (click)="inputstart()">
        <img src="./assets/imgs/h-input.png">
      </div>
      <InputComponent #inputComponent></InputComponent>
    </div>
  `,
})
export class PointComponent {
  @ViewChild('canvas')
  canvas: ElementRef;
  @ViewChild('light')
  light: ElementRef;
  @ViewChild('aitool')
  aitool: ElementRef;

  @ViewChild('inputComponent')
  inputComponent: InputComponent;

  ctx: any;
  width: number;
  height: number;
  rotation = 0;
  dots:Array<Dot>;
  DOTS_AMOUNT = 1000;

  speed: number = 0.0004;

  statusListener:boolean = false;

  constructor(private utilService: UtilService,
              private assistantService: AssistantService,
              private _renderer: Renderer2,
              private emitService:EmitService) {

    this.assistantService.startWakeUp();
    this.emitService.registerListener((b)=>{
      this.statusListener = b;
      if (b){
        this.speed = 0.004;
        this._renderer.removeClass(this.light.nativeElement, "danger");
      }else{
        this._renderer.addClass(this.light.nativeElement, "danger");
        this.speed = 0.0004;
      }
    });
    // this.emitService.registerSpeak((b)=>{
    //   if (b){
    //     this.assistantService.stopWakeUp();
    //   }else{
    //     this.assistantService.startWakeUp();
    //   }
    // })
  }

  inputstart() {
    this.inputComponent.inputStart();
  }

   listenStart() {
    if (!this.statusListener) this.assistantService.listenAudio();
    else this.assistantService.stopListenAudio();

     // if (this.statusListener){
     //   this.speed = 0.004;
     //   this._renderer.removeClass(this.light.nativeElement, "danger");
     //   this.statusListener = !this.statusListener;
     // }else {
     //   this._renderer.addClass(this.light.nativeElement, "danger");
     //   this.speed = 0.0004;
     //   this.statusListener = !this.statusListener;
     //
     // }
  }

  ngOnInit(): void {
    //this._renderer.setStyle(this.aitool.nativeElement, "top", window.innerHeight);

    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.dots= new Array<Dot>();

    this.width = this.canvas.nativeElement.width ;
    this.height = this.canvas.nativeElement.height;

// Populate the dots array with random dots
    this.createDots();

// Render the scene
    window.requestAnimationFrame((a) => {
      this.render(a);
    });

  }


  createDots() {
    // Empty the array of dots
    let GLOBE_RADIUS = this.width * 0.8;
    let GLOBE_CENTER_Z = GLOBE_RADIUS * -1;
    let PROJECTION_CENTER_X = this.width / 2;
    let PROJECTION_CENTER_Y = this.height / 2;
    let FIELD_OF_VIEW = this.width;

    // Create a new dot based on the amount needed
    for (let i = 0; i < this.DOTS_AMOUNT; i++) {
      const theta = Math.random() * 2 * Math.PI; // Random value between [0, 2PI]
      const phi = Math.acos((Math.random() * 2) - 1); // Random value between [-1, 1];
      let a = this.utilService.rand(0.5, 1.1);
      let rad = this.utilService.rand(1, 7);
      let rgba = "";
      let color = this.utilService.randInt(0, 10)
      if (color < 6) {
        rgba = "rgba(102,200,201," + a + ")"
      } else if (color < 9 && color >6){
        rgba = "rgba(132,48,148," + a + ")"
      }else{
        rgba = "rgba(219,74,57," + a + ")"
      }

      // Calculate the [x, y, z] coordinates of the dot along the globe
      const x = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
      const y = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);
      const z = (GLOBE_RADIUS * Math.cos(phi)) + GLOBE_CENTER_Z;
      this.dots.push(new Dot(x, y, z,this.ctx, GLOBE_CENTER_Z, FIELD_OF_VIEW, PROJECTION_CENTER_X, PROJECTION_CENTER_Y, rad, rgba));
    }
  }

  /* ====================== */
  /* ======== RENDER ====== */

  /* ====================== */
  render(a) {
    // Clear the scene
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Increase the globe rotation
    this.rotation = a * this.speed;

    const sineRotation = Math.sin(this.rotation); // Sine of the rotation
    const cosineRotation = Math.cos(this.rotation); // Cosine of the rotation

    // Loop through the dots array and draw every dot
    for (var i = 0; i < this.dots.length; i++) {
      this.dots[i].draw(sineRotation, cosineRotation);
    }

    window.requestAnimationFrame((a) => {
      this.render(a);
    });
  }

}

class Dot {
  x: number;
  y: number;
  z: number;
  xProject: number;
  yProject: number;
  sizeProjection: number;
  ctx: any;
  GLOBE_CENTER_Z: number;
  FIELD_OF_VIEW: number;
  PROJECTION_CENTER_X: number;
  PROJECTION_CENTER_Y: number;
  DOT_RADIUS: number;
  rgba: string;

  constructor(x, y, z, ctx, GLOBE_CENTER_Z, FIELD_OF_VIEW, PROJECTION_CENTER_X, PROJECTION_CENTER_Y, DOT_RADIUS, rgba) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.z = z;

    this.xProject = 0;
    this.yProject = 0;
    this.sizeProjection = 0;

    this.GLOBE_CENTER_Z = GLOBE_CENTER_Z;
    this.FIELD_OF_VIEW = FIELD_OF_VIEW;
    this.PROJECTION_CENTER_X = PROJECTION_CENTER_X;
    this.PROJECTION_CENTER_Y = PROJECTION_CENTER_Y;
    this.DOT_RADIUS = DOT_RADIUS;
    this.rgba = rgba;


  }

  // Do some math to project the 3D position into the 2D canvas
  project(sin, cos) {
    const rotX = cos * this.x + sin * (this.z - this.GLOBE_CENTER_Z);
    const rotZ = -sin * this.x + cos * (this.z - this.GLOBE_CENTER_Z) + this.GLOBE_CENTER_Z;
    this.sizeProjection = this.FIELD_OF_VIEW / (this.FIELD_OF_VIEW - rotZ);
    this.xProject = (rotX * this.sizeProjection) + this.PROJECTION_CENTER_X;
    this.yProject = (this.y * this.sizeProjection) + this.PROJECTION_CENTER_Y;
  }

  // Draw the dot on the canvas
  draw(sin, cos) {
    this.project(sin, cos);
    // ctx.fillRect(this.xProject - DOT_RADIUS, this.yProject - DOT_RADIUS, DOT_RADIUS * 2 * this.sizeProjection, DOT_RADIUS * 2 * this.sizeProjection);
    this.ctx.beginPath();
    this.ctx.arc(this.xProject, this.yProject, this.DOT_RADIUS * this.sizeProjection, 0, Math.PI);
    //let rgba = 'rgba(29,13,178, 1)'
    //this.ctx.fillStyle = 'rgba(29,13,178, 1)';
    this.ctx.fillStyle = this.rgba;
    this.ctx.closePath();
    this.ctx.fill();
  }
}

