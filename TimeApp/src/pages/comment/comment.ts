import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, ModalController, Scroll, TextInput} from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import {ModalBoxComponent} from "../../components/modal-box/modal-box";

@IonicPage()
@Component({
  selector: 'page-comment',
  template: `
  <modal-box title="备注" [buttons]="buttons" (onSave)="save()" (onCancel)="cancel()">
    <ion-textarea  #textarea placeholder="备注"  class="memo-set" rows="8" [(ngModel)]="bz" ></ion-textarea>
  </modal-box>
  `
})
export class CommentPage {

  @ViewChild(ModalBoxComponent)
  modalBoxComponent:ModalBoxComponent;

  @ViewChild("input")
  textarea: TextInput;

  buttons: any = {
    remove: false,
    share: false,
    save: true,
    cancel: true
  };


  bz: string = "";  //备注

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              private keyboard: Keyboard) {
    if (this.navParams && this.navParams.data) {
      let value = this.navParams.data.value;

      if (value) {
        this.bz = value;
      }
    }
  }

  ionViewDidEnter() {

    this.modalBoxComponent.setBoxContent();

    this.textarea.setFocus();
  }

  save() {
    let data: Object = {bz: this.bz};
    this.viewCtrl.dismiss(data);
  }

  cancel() {
    this.navCtrl.pop();
  }
}
