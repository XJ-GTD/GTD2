import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, TextInput} from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import {AssistantService} from "../../../service/cordova/assistant.service";

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
      <div class="waper">
        <ion-textarea class="text" #input></ion-textarea>
        <button (click)="confirm()">发送</button>
      </div>
    </ion-content>
  `
})
export class InputComponent {
  @ViewChild("input")
  input: TextInput

  constructor(private _renderer: Renderer2, private el: ElementRef,
              private keyboard: Keyboard,
              private assistantService: AssistantService
  ) {

  }

  ngOnInit() {

    this.keyboard.onKeyboardHide().subscribe(next => {
      setTimeout(()=>{
        this._renderer.setStyle(this.el.nativeElement, "transform", "translateY(-9999px)");
        //this._renderer.setStyle(this.el.nativeElement, "display", "none");
      },100);
      this.input.setBlur();

    }, error1 => {
      setTimeout(()=>{
        this._renderer.setStyle(this.el.nativeElement, "transform", "translateY(-9999px)");
        //this._renderer.setStyle(this.el.nativeElement, "display", "none");
      },100);
      this.input.setBlur();

    });
    this.input.blur.subscribe(next => {
      setTimeout(()=>{
        //this._renderer.setStyle(this.el.nativeElement, "transform", "translateY(-9999px)");
        //this._renderer.setStyle(this.el.nativeElement, "display", "none");
      },100);
      this.input.setBlur();

    }, error1 => {
      setTimeout(()=>{
        this._renderer.setStyle(this.el.nativeElement, "transform", "translateY(-9999px)");
        //this._renderer.setStyle(this.el.nativeElement, "display", "none");
      },100);
      this.input.setBlur();

    });
  }


  inputStart() {
    this._renderer.setStyle(this.el.nativeElement, "transform", "translateY(0px)");
    this.input.clearTextInput();
    this.input.setFocus();
  }

  confirm() {
    console.log("打的文字是======》"+ this.input.value );
    if (this.input.value != null && this.input.value != "") {
      this.assistantService.listenText(this.input.value);
    }

    this._renderer.setStyle(this.el.nativeElement, "transform", "translateY(-9999px)");
    //this._renderer.setStyle(this.el.nativeElement, "display", "none");
    this.input.setBlur();
  }

}



