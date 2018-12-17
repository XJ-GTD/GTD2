import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {RelmemService} from "../../service/relmem.service";
import {UEntity} from "../../entity/u.entity";
import {PageConfig} from "../../app/page.config";


/**
 * Generated class for the PcPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pc',
  templateUrl: 'pc.html',
})
export class PcPage {

  uo:UEntity;

  name:any;
  tel:any;
  code:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private relme:RelmemService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PcPage');
    this.name = this.navParams.get("name");
    this.tel=this.navParams.get("tel");
    this.code = this.navParams.get("code");
    this.uo = this.navParams.get("uo");
  }


  submit() {
    let loader = this.loadingCtrl.create({
      content: "",
      duration: 1000
    });
    this.relme.aru(this.uo.uI,'',this.name, null, this.tel, '0',null,null,null).then(data => {
      if(data.code == 0){
        //添加成功
        console.log("添加成功::" + this.tel);
        //setroot
        let pageList = this.navCtrl.getViews().forEach(page => {
          if(page.name == PageConfig.PA_PAGE){
            this.navCtrl.popTo(page);
          } else {
            this.navCtrl.popToRoot();
          }
        });
        // this.navCtrl.push("PaPage","HzPage")
      }else{
        //添加失败
        console.log("添加失败::" + this.tel);
        loader.setContent("服务器繁忙，添加失败");
        loader.present();
      }

    }).catch(reason => {
      //添加失败
      console.log("添加失败::" + this.tel);
      loader.setContent("出错了，添加失败");
      loader.present();
    })
  }
}
