import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, TextInput} from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import {AssistantService} from "../../../service/cordova/assistant.service";
import {DataConfig} from "../../../service/config/data.config";
import {UtilService} from "../../../service/util-service/util.service";
import {EmitService} from "../../../service/util-service/emit.service";

/**
 * Generated class for 输入框 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'InputComponent',
  template: `
    <ion-content>
      <!--<div class="help">-->
        <!--<ion-grid>-->
          <!--<ion-row *ngFor="let help of helps">-->
            <!--{{help}}-->
          <!--</ion-row>-->
        <!--</ion-grid>-->
      <!--</div>-->
      <div class="waper" #waperInput>
        <ion-textarea class="text" #input></ion-textarea>
        <div class="tools">
          <button (click)="inputclose()" class="close">关闭</button>
          <button (click)="confirm()" class="send">发送</button>
        </div>
      </div>
    </ion-content>
  `
})
export class InputComponent {
  @ViewChild("input")
  input: TextInput
  @ViewChild("waperInput")
  waperInput: ElementRef

  helps:Array<string> = new Array<string>();

  constructor(private _renderer: Renderer2, private el: ElementRef,
              private keyboard: Keyboard,
              private assistantService: AssistantService,
              private util:UtilService,private emitService:EmitService,
  ) {

  }

  ngOnInit() {

    this._renderer.setStyle(this.el.nativeElement, "height", window.innerHeight + "px");

    this._renderer.setStyle(this.el.nativeElement, "width", window.innerWidth + "px");

    this._renderer.setStyle(this.el.nativeElement, "bottom",  "0px");
    //this._renderer.setStyle(this.el.nativeElement, "top",  "-6px");
    // this.keyboard.onKeyboardHide().subscribe(next => {
    //   this._renderer.setStyle(this.waperInput.nativeElement, "transform", "translateY(9999px)");
    //   setTimeout(()=>{
    //     this._renderer.setStyle(this.el.nativeElement, "display", "none");
    //   },500);
    //   this.input.setBlur();
    //
    // }, error1 => {
    //   this._renderer.setStyle(this.waperInput.nativeElement, "transform", "translateY(9999px)");
    //   setTimeout(()=>{
    //     this._renderer.setStyle(this.el.nativeElement, "display", "none");
    //   },500);
    //   this.input.setBlur();
    //
    // });
    // this.input.blur.subscribe(next => {
    //   this._renderer.setStyle(this.waperInput.nativeElement, "transform", "translateY(9999px)");
    //   setTimeout(()=>{
    //     this._renderer.setStyle(this.el.nativeElement, "display", "none");
    //   },500);
    //   this.input.setBlur();
    //
    // }, error1 => {
    //   this._renderer.setStyle(this.waperInput.nativeElement, "transform", "translateY(9999px)");
    //   setTimeout(()=>{
    //     this._renderer.setStyle(this.el.nativeElement, "display", "none");
    //   },500);
    //   this.input.setBlur();
    //
    // });
  }

  inputclose(){
    this._renderer.setStyle(this.waperInput.nativeElement, "transform", "translateY(9999px)");
      setTimeout(()=>{
        this._renderer.setStyle(this.el.nativeElement, "display", "none");
      },500);
  }

  inputStart() {
    this._renderer.setStyle(this.el.nativeElement, "display", "block");
    this._renderer.setStyle(this.waperInput.nativeElement, "transform", "translateY(0px)");
    this.input.clearTextInput();
    setTimeout(()=>{
      this.input.setFocus();
    },500);
    this.helps.splice(0, this.helps.length);
    let h = this.util.randInt(0, DataConfig.helps.length - 1);
    this.helps.push(DataConfig.helps[h]);
    let h2 = this.util.randInt(0, DataConfig.helps.length - 1);
    if(h != h2){
      this.helps.push(DataConfig.helps[h2]);
    }
  }

  confirm() {
    if (this.input.value != null && this.input.value != "") {
      this.assistantService.putText(this.input.value);
      // let  emspeech:SpeechEmData = new SpeechEmData();
      this.emitService.emitSpeechWaiting(true);
    }

    // this._renderer.setStyle(this.el.nativeElement, "display", "none");
    // this._renderer.setStyle(this.waperInput.nativeElement, "transform", "translateY(-9999px)");
    //this._renderer.setStyle(this.el.nativeElement, "display", "none");
    this.inputclose();
  }

}



