import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {UtilService} from "../../../service/util-service/util.service";
import {AssistantService} from "../../../service/cordova/assistant.service";
import {InputComponent} from "../input/input";
import {EmitService} from "../../../service/util-service/emit.service";
import {PopperComponent} from "angular-popper";
import {Subscriber} from "rxjs";
import {TimeOutService} from "../../../util/timeOutService";
import {ListeningComponent} from "./listening";

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
    
    <div class="inputioc" (click)="inputstart()" *ngIf="showInput">
      <ion-icon class="fal fa-keyboard"></ion-icon>
    </div>
      <div class="aitool" #aitool (click)="ponintClick()">
        <b class=" speaking  moving" #light>
          <div class="spinner" >
            <!--<canvas #canvas></canvas>-->
        </div>
        </b>
    </div>
    <angular-popper  target=".aitool"  placement="left-end" #popper [class.showNot] = "popperShow">
      <div content>
        <button icon-only (click)="closepopper() "><ion-icon class="fal fa-times-circle"></ion-icon></button>
        <ion-grid class="list-grid-content content">
          <ng-template ngFor let-tellyou [ngForOf]="tellYouData">
            <ion-row class="item-content">
              <div class="line font-small first-line">
                <div class="sn">
                  {{tellyou}}
                </div>
              </div>              
            </ion-row>
          </ng-template>
        </ion-grid>
      </div>
    </angular-popper>

    <ListeningComponent #listening  *ngIf="showInput"></ListeningComponent>
    <InputComponent #inputComponent></InputComponent>

  `,
})
export class PointComponent {
  @ViewChild('listening')
  listening: ListeningComponent;
  @ViewChild('light')
  light: ElementRef;
  @ViewChild('aitool')
  aitool: ElementRef;

  @ViewChild('inputComponent')
  inputComponent: InputComponent;


  @ViewChild('popper')
  popper: PopperComponent;
  popperShow:boolean = true;
  @Input()
  hasPopper:boolean = true;

  @Input()
  showInput:boolean = true;


  @Output() onPonintClick: EventEmitter<any> = new EventEmitter();

  aiTellYou:Subscriber<any>;
  tellYouData:Array<string> = new Array<string>();

  constructor(private utilService: UtilService,
              private assistantService: AssistantService,
              private _renderer: Renderer2,
              private emitService:EmitService,
              private changeDetectorRef: ChangeDetectorRef,
              private timeoutService:TimeOutService) {

    this.aiTellYou = this.emitService.registerAiTellYou(($data)=>{

      if (this.hasPopper){
        if ($data.close){
          this.popperShow = true;
        }else{
          this.popperShow = false;
          this.tellYouData.push($data.message);
          if (!this.changeDetectorRef['destroyed']) {
            this.changeDetectorRef.detectChanges();
            this.popper.create();
          }
          this.timeoutService.timeOutOnlyOne(30000,()=>{
            this.popperShow = true;
            this.tellYouData.length = 0;
            this.changeDetectorRef.detectChanges();
          },"close.home.ai.talk");
        }
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
  ngOnDestroy(){
    this.aiTellYou.unsubscribe();
  }

  closepopper(){
    this.popperShow = true;
  }

  ponintClick(){
    this.onPonintClick.emit(this);
    // this.listening.start();
  }
  inputstart() {
    this.inputComponent.inputStart();
  }

  ngOnInit(): void {
    //this._renderer.setStyle(this.aitool.nativeElement, "top", window.innerHeight);

//     this.ctx = this.canvas.nativeElement.getContext('2d');
//     this.dots= new Array<Dot>();
//
//     this.width = this.canvas.nativeElement.width ;
//     this.height = this.canvas.nativeElement.height;
//
// // Populate the dots array with random dots
//     this.createDots();
//
// // Render the scene
//     window.requestAnimationFrame((a) => {
//       this.render(a);
//     });

  }


  // createDots() {
  //   // Empty the array of dots
  //   let GLOBE_RADIUS = this.width * 0.8;
  //   let GLOBE_CENTER_Z = GLOBE_RADIUS * -1;
  //   let PROJECTION_CENTER_X = this.width / 2;
  //   let PROJECTION_CENTER_Y = this.height / 2;
  //   let FIELD_OF_VIEW = this.width;
  //
  //   // Create a new dot based on the amount needed
  //   for (let i = 0; i < this.DOTS_AMOUNT; i++) {
  //     const theta = Math.random() * 2 * Math.PI; // Random value between [0, 2PI]
  //     const phi = Math.acos((Math.random() * 2) - 1); // Random value between [-1, 1];
  //     let a = this.utilService.rand(0.5, 1.1);
  //     let rad = this.utilService.rand(1, 7);
  //     let rgba = "";
  //     let color = this.utilService.randInt(0, 10)
  //     if (color < 6) {
  //       rgba = "rgba(102,200,201," + a + ")"
  //     } else if (color < 9 && color >6){
  //       rgba = "rgba(132,48,148," + a + ")"
  //     }else{
  //       rgba = "rgba(219,74,57," + a + ")"
  //     }
  //
  //     // Calculate the [x, y, z] coordinates of the dot along the globe
  //     const x = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
  //     const y = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);
  //     const z = (GLOBE_RADIUS * Math.cos(phi)) + GLOBE_CENTER_Z;
  //     this.dots.push(new Dot(x, y, z,this.ctx, GLOBE_CENTER_Z, FIELD_OF_VIEW, PROJECTION_CENTER_X, PROJECTION_CENTER_Y, rad, rgba));
  //   }
  // }
  //
  // /* ====================== */
  // /* ======== RENDER ====== */
  //
  // /* ====================== */
  // render(a) {
  //   // Clear the scene
  //   this.ctx.clearRect(0, 0, this.width, this.height);
  //
  //   // Increase the globe rotation
  //   this.rotation = a * this.speed;
  //
  //   const sineRotation = Math.sin(this.rotation); // Sine of the rotation
  //   const cosineRotation = Math.cos(this.rotation); // Cosine of the rotation
  //
  //   // Loop through the dots array and draw every dot
  //   for (var i = 0; i < this.dots.length; i++) {
  //     this.dots[i].draw(sineRotation, cosineRotation);
  //   }
  //
  //   window.requestAnimationFrame((a) => {
  //     this.render(a);
  //   });
  // }

}

// class Dot {
//   x: number;
//   y: number;
//   z: number;
//   xProject: number;
//   yProject: number;
//   sizeProjection: number;
//   ctx: any;
//   GLOBE_CENTER_Z: number;
//   FIELD_OF_VIEW: number;
//   PROJECTION_CENTER_X: number;
//   PROJECTION_CENTER_Y: number;
//   DOT_RADIUS: number;
//   rgba: string;
//
//   constructor(x, y, z, ctx, GLOBE_CENTER_Z, FIELD_OF_VIEW, PROJECTION_CENTER_X, PROJECTION_CENTER_Y, DOT_RADIUS, rgba) {
//     this.ctx = ctx;
//     this.x = x;
//     this.y = y;
//     this.z = z;
//
//     this.xProject = 0;
//     this.yProject = 0;
//     this.sizeProjection = 0;
//
//     this.GLOBE_CENTER_Z = GLOBE_CENTER_Z;
//     this.FIELD_OF_VIEW = FIELD_OF_VIEW;
//     this.PROJECTION_CENTER_X = PROJECTION_CENTER_X;
//     this.PROJECTION_CENTER_Y = PROJECTION_CENTER_Y;
//     this.DOT_RADIUS = DOT_RADIUS;
//     this.rgba = rgba;
//
//
//   }
//
//   // Do some math to project the 3D position into the 2D canvas
//   project(sin, cos) {
//     const rotX = cos * this.x + sin * (this.z - this.GLOBE_CENTER_Z);
//     const rotZ = -sin * this.x + cos * (this.z - this.GLOBE_CENTER_Z) + this.GLOBE_CENTER_Z;
//     this.sizeProjection = this.FIELD_OF_VIEW / (this.FIELD_OF_VIEW - rotZ);
//     this.xProject = (rotX * this.sizeProjection) + this.PROJECTION_CENTER_X;
//     this.yProject = (this.y * this.sizeProjection) + this.PROJECTION_CENTER_Y;
//   }
//
//   // Draw the dot on the canvas
//   draw(sin, cos) {
//     this.project(sin, cos);
//     // ctx.fillRect(this.xProject - DOT_RADIUS, this.yProject - DOT_RADIUS, DOT_RADIUS * 2 * this.sizeProjection, DOT_RADIUS * 2 * this.sizeProjection);
//     this.ctx.beginPath();
//     this.ctx.arc(this.xProject, this.yProject, this.DOT_RADIUS * this.sizeProjection, 0, Math.PI);
//     //let rgba = 'rgba(29,13,178, 1)'
//     //this.ctx.fillStyle = 'rgba(29,13,178, 1)';
//     this.ctx.fillStyle = this.rgba;
//     this.ctx.closePath();
//     this.ctx.fill();
//   }
// }

