import {Component, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import {JhService} from "../../service/jh.service";

/**
 * Generated class for the SzPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sz',
  templateUrl: 'sz.html',
})
export class SzPage {

  @ViewChild(Navbar) navBar: Navbar;

  jhmc:string;
  jhms:string;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private jhService: JhService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SzPage');
    this.navBar.backButtonClick = this.backButtonClick;
    this.navBar.setBackButtonText("");
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.navCtrl.pop();
  };

  save(){
    console.log("计划添加 :: 计划名称 " + this.jhmc +　" 计划描述 " + this.jhms );
    if(this.jhmc === undefined || this.jhms === undefined){
      alert("输入项有为空");
      return;
    }
    this.jhService.ajh(this.jhmc,this.jhms).then(data=>{
      console.log("计划添加成功 :: " + JSON.stringify(data));
      this.navCtrl.pop();
    }).catch(reason => {
      console.log("计划添加失败 :: " + JSON.stringify(reason));
    })
  }
}
