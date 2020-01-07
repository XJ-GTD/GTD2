import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output, Renderer2,
  ViewChild
} from '@angular/core';
import {Animation, IonicPage, Platform} from 'ionic-angular';
import {PopperComponent} from "angular-popper";

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

    <div class="inputioc" (click)="inputstart()" *ngIf="showInput" #inputComponent >
      <ion-icon class="fal fa-keyboard"></ion-icon>
    </div>
    <div class="aitool" #aitool (click)="ponintClick()">
      <b class=" speaking  moving" #light>
        <div class="spinner">
          <!--<canvas #canvas></canvas>-->
        </div>
      </b>
    </div>
    <ng-template [ngIf]="hasPopper">
      <angular-popper target=".aitool" placement="left-end" #popper [class.showNot]="!popperShow">
        <div content>
          <TellyouComponent (onShow)="showPopper($event)" (onClose)="closepopper()"></TellyouComponent>
        </div>
      </angular-popper>
    </ng-template>

    <ListeningComponent #listeningComponent *ngIf="showInput" (onListeningStart)="listeningStart()" (onListeningStop)="listeningStop()"></ListeningComponent>

  `,
})
export class PointComponent {

  private ani:Animation;
  @ViewChild('light')
  light: ElementRef;
  @ViewChild('aitool')
  aitool: ElementRef;
  @ViewChild('inputComponent')
  inputComponent: ElementRef;

  @Input()
  hasPopper: boolean = true;

  @ViewChild('popper')
  popper: PopperComponent;
  popperShow: boolean = false;

  @Input()
  showInput: boolean = true;

  @Output() onPonintClick: EventEmitter<any> = new EventEmitter();
  @Output() onInputClick: EventEmitter<any> = new EventEmitter();

  @ViewChild('listeningComponent', {read: ElementRef})
  listeningEl: ElementRef; // 直接找到子组件对应的DOM

  constructor(private changeDetectorRef: ChangeDetectorRef, private plt: Platform,
              private _renderer: Renderer2,) {


  }

  showPopper($event:any){
    this.popperShow = $event;
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
      this.popper.create();
    }
  }

  ngOnDestroy() {
  }

  ngAfterViewInit(){

    if (this.showInput){
      this.ani = new Animation(this.plt);
      this.ani
        .easing('cubic-bezier(0.0, 0.0, 0.2, 1)')
        .easingReverse('cubic-bezier(0.4, 0.0, 0.6, 1)')
        .duration(280);
      let listening = new Animation(this.plt, this.listeningEl.nativeElement);
      listening.fromTo('width',0 ,"100%");
      this.ani.add(listening);
      let aitool = new Animation(this.plt, this.aitool.nativeElement);
      aitool.fromTo('translateY',0 ,"-70px");
      aitool.fromTo('translateX',0 ,"-20px");
      aitool.fromTo('scale',1 ,0.8);
      this.ani.add(aitool);
      let input =  new Animation(this.plt, this.inputComponent.nativeElement);
      input.fromTo('scale',"1" ,0);
      this.ani.add(input);
    }
  }

  closepopper() {
    this.popperShow = false;
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }

  ponintClick() {
    // this.emitService.emitAiTellYou({close: false, message: {title:'zhangju 邀请你',text:'QQ'}});
    //    this.listeningStart(()=>{
         this.onPonintClick.emit(this);
       // });
       // setTimeout(()=>{
       //   this.listeningStop(()=>{
       //   });
       // },5000)
     // }else{
     //   this.onPonintClick.emit(this);
     // }
    // this.listening.start();
  }

  inputstart() {
    this.onInputClick.emit(this);
  }


  listeningStart(done:Function){

  if (this.ani) {
    this.ani
      .onFinish(done, true, true)
      .reverse(false).play();
    this._renderer.removeClass(this.light.nativeElement, "moving");
  }
  }
  listeningStop(done:Function){
    if (this.ani) {
      this.ani
        .onFinish(done, true, true)
        .reverse(true).play();
      this._renderer.addClass(this.light.nativeElement, "moving");
    }

  }
}
