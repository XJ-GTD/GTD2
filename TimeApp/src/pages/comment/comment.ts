import {ChangeDetectorRef, Component, ViewChild,} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, ModalController, } from 'ionic-angular';
import {ModalBoxComponent} from "../../components/modal-box/modal-box";

@IonicPage()
@Component({
  selector: 'page-comment',
  template: `
  <modal-box title="备注" [buttons]="buttons" (onSave)="save()" (onCancel)="cancel()" (onRecord)="record($event)">

    <ion-grid>

      <ion-row class="limitRow font-small-x">
        <span>{{snlength}} / 80 </span>
      </ion-row>

      <ion-row class="snRow">
        <div class="sn font-large-x">
          <ion-textarea   placeholder="备注"  class="memo-set" rows="8" [(ngModel)]="bz" class="font-large-x" [maxlength]="80"  (ionChange)="changeTitle()" ></ion-textarea>
        </div>
      </ion-row>
    </ion-grid>
  </modal-box>
  `
})
export class CommentPage {

  @ViewChild(ModalBoxComponent)
  modalBoxComponent:ModalBoxComponent;


  buttons: any = {
    record:true,
    save: true,
    cancel: true
  };

  snlength:number = 0;


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
        this.snlength = this.bz.length;
      }
    }
  }



  ionViewDidEnter() {
  }

  ngAfterViewInit(){

    this.modalBoxComponent.setBoxContent();


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

  changeTitle() {
    this.snlength =  this.bz.length;

  }
}
