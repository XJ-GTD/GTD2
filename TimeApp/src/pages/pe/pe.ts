import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pe',
  templateUrl: 'pe.html',
})
export class PePage {

  indexs:any;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PePage');
    this.indexs=[{name:"张三"},{name:"李四"},{name:"王五"}]
  }

  toAddGroupMember(){
    this.navCtrl.push("PersonalAddPage")
  }

  toGroupSelect(){
    this.navCtrl.push("PgPage")
  }

  delete(select:any){
    let j  = this.indexs.indexOf(select);
    let arr: any = [];
    for(let i = 0;i<this.indexs.length-1;i++){
      if(i<j){
        arr[i]=this.indexs[i];
      }else{
        arr[i]= this.indexs[i+1];
      }
    }
    this.indexs = arr;
    console.log(j)
  }
}
