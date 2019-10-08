import {ChangeDetectorRef, Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, ModalController, Scroll, TextInput} from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import {ModalBoxComponent} from "../../components/modal-box/modal-box";
import {AssistantService} from "../../service/cordova/assistant.service";
import {EmitService} from "../../service/util-service/emit.service";

@IonicPage()
@Component({
  selector: 'page-comment',
  template: `
  <modal-box title="备注" [buttons]="buttons" (onSave)="save()" (onCancel)="cancel()" (onRecord)="record($event)">
    <ion-textarea  #textarea placeholder="备注"  class="memo-set" rows="8" [(ngModel)]="bz" class="font-large-x"></ion-textarea>
  </modal-box>
  `
})
export class CommentPage {

  @ViewChild(ModalBoxComponent)
  modalBoxComponent:ModalBoxComponent;

  @ViewChild("textarea")
  textarea: TextInput;

  buttons: any = {
    record:true,
    save: true,
    cancel: true
  };


  bz: string = "";  //备注

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              private changeDetectorRef: ChangeDetectorRef,) {
    if (this.navParams && this.navParams.data) {
      let value = this.navParams.data.value;

      if (value) {
        this.bz = value;
      }
    }
  }



  ionViewDidEnter() {
  }

  ngAfterViewInit(){

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

  record(text){
    this.bz = text;
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }
}
