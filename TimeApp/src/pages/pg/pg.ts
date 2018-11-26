import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PgPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pg',
  templateUrl: 'pg.html',
})
export class PgPage {

  indexs:any;



  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PgPage');
    this.indexs=[{"name":"张三","select":"false"},{"name":"李四","select":"false"}]
  }

  goBack() {
    this.navCtrl.pop();
  }

  showSelect(){
    console.log("点击确定")
    var i = this.indexs.length;
    for(let j = 0;j<i;j++){
      if(this.indexs[j].select == true){
        console.log(this.indexs[j])
      }
    }
  }

}
