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
import {PointService} from "./point.service";

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

    <ListeningComponent #listening *ngIf="showInput"></ListeningComponent>
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

  @Input()
  hasPopper: boolean = true;

  @ViewChild('popper')
  popper: PopperComponent;
  popperShow: boolean = false;

  @Input()
  showInput: boolean = true;

  @Output() onPonintClick: EventEmitter<any> = new EventEmitter();

  constructor(private changeDetectorRef: ChangeDetectorRef) {

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

  closepopper() {
    this.popperShow = false;
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }

  ponintClick() {
    // this.emitService.emitAiTellYou({close: false, message: {title:'zhangju 邀请你',text:'QQ'}});
     this.onPonintClick.emit(this);
    // this.listening.start();
  }

  inputstart() {
    this.inputComponent.inputStart();
  }
}
