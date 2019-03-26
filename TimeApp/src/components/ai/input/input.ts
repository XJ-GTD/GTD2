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
      <div class="waper" #waperInput>
        <ion-textarea class="text" #input></ion-textarea>
        <button (click)="confirm()">发送</button>
      </div>
    </ion-content>
  `
})
export class InputComponent {
  @ViewChild("input")
  input: TextInput
  @ViewChild("waperInput")
  waperInput: ElementRef

  constructor(private _renderer: Renderer2, private el: ElementRef,
              private keyboard: Keyboard,
              private assistantService: AssistantService
  ) {

  }

  ngOnInit() {

    this.keyboard.onKeyboardHide().subscribe(next => {
      setTimeout(()=>{
        this._renderer.setStyle(this.el.nativeElement, "display", "none");
        this._renderer.setStyle(this.waperInput.nativeElement, "transform", "translateY(-9999px)");
      },300);
      this.input.setBlur();

    }, error1 => {
      setTimeout(()=>{
        this._renderer.setStyle(this.el.nativeElement, "display", "none");
        this._renderer.setStyle(this.waperInput.nativeElement, "transform", "translateY(-9999px)");
      },300);
      this.input.setBlur();

    });
    this.input.blur.subscribe(next => {
      this._renderer.setStyle(this.waperInput.nativeElement, "transform", "translateY(-9999px)");
      setTimeout(()=>{
        this._renderer.setStyle(this.el.nativeElement, "display", "none");
      },300);
      this.input.setBlur();

    }, error1 => {
      this._renderer.setStyle(this.waperInput.nativeElement, "transform", "translateY(-9999px)");
      setTimeout(()=>{
        this._renderer.setStyle(this.el.nativeElement, "display", "none");
      },300);
      this.input.setBlur();

    });
  }


  inputStart() {
    this._renderer.setStyle(this.el.nativeElement, "display", "block");
    this._renderer.setStyle(this.waperInput.nativeElement, "transform", "translateY(-0px)");
    this.input.clearTextInput();
    this.input.setFocus();
  }

  confirm() {
    if (this.input.value != null && this.input.value != "") {
      this.assistantService.listenText(this.input.value);
    }

    // this._renderer.setStyle(this.el.nativeElement, "display", "none");
    // this._renderer.setStyle(this.waperInput.nativeElement, "transform", "translateY(-9999px)");
    //this._renderer.setStyle(this.el.nativeElement, "display", "none");
    this.input.setBlur();
  }

}



