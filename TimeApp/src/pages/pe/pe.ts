import {Component, ViewChild} from '@angular/core';
import {
  AlertController, IonicPage, NavController, NavParams, ToastController, Navbar,
  ModalController
} from 'ionic-angular';
import {UEntity} from "../../entity/u.entity";
import {RuModel} from "../../model/ru.model";
import {RelmemService} from "../../service/relmem.service";
import {PageConfig} from "../../app/page.config";
import {DataConfig} from "../../app/data.config";

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

  @ViewChild(Navbar) navBar: Navbar;

  uo:UEntity;
  qcy:Array<RuModel>;

  qmc:any;//群名称


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private relmemService: RelmemService,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PePage');
    this.navBar.backButtonClick = this.backButtonClick;
    this.navBar.setBackButtonText("");
  }

  ionViewWillEnter(){
    this.uo = DataConfig.uInfo;
    console.log("pe 获取用户信息："+JSON.stringify(this.uo))
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.navCtrl.pop();
  };

  toAddGroupMember(){
    console.log("PePage跳转PgPage");
    // this.navCtrl.push("PgPage",{callback:this.getData,sel:this.qcy});

    let modal = this.modalCtrl.create(PageConfig.PG_PAGE,{callback:this.getData,sel:this.qcy});
    modal.onDidDismiss((data)=>{
      console.log(data === this.qcy);
      console.log(JSON.stringify(data));
      this.qcy = data;
    });
    modal.present();

  }

  delete(select:any){
    let flag = this.qcy.indexOf(select);
    console.log(flag);
    let tmp = new Array<RuModel>();
    for(let i = 0; i< this.qcy.length;i++){
      if(i==flag){
        continue;
      }
      tmp.push(this.qcy[i]);
    }
    this.qcy = tmp;

  }

  getData = (data) =>
  {
    return new Promise((resolve, reject) => {
      console.log(data);
      this.qcy = data;
      resolve();
    });
  };

  save(){
    if(!this.qmc){
      let alert = this.alertCtrl.create({
        message: '请输入群组名称',
        enableBackdropDismiss:false
      });
      setTimeout(()=>{
        alert.dismiss();
      },1000);
      alert.present();
      return;
    }

    this.relmemService.aru(this.uo.uI,null,null,this.qmc,null,'1',null,null,this.qcy).then(data=>{
      if(data.code == 0){
        console.log("添加群成功");
        this.navCtrl.pop();

      }else{
        console.log("添加群失败")
      }
    }).catch(reason => {
      console.log("添加群失败")
    })
  }

  // ionViewDidLoad(){
  //   console.log("1.0 ionViewDidLoad 当页面加载的时候触发，仅在页面创建的时候触发一次，如果被缓存了，那么下次再打开这个页面则不会触发");
  // }
  // ionViewWillEnter(){
  //   console.log("2.0 ionViewWillEnter 顾名思义，当将要进入页面时触发");
  // }
  // ionViewDidEnter(){
  //   console.log("3.0 ionViewDidEnter 当进入页面时触发");
  // }
  // ionViewWillLeave(){
  //   console.log("4.0 ionViewWillLeave 当将要从页面离开时触发");
  // }
  // ionViewDidLeave(){
  //   console.log("5.0 ionViewDidLeave 离开页面时触发");
  // }
  // ionViewWillUnload(){
  //   console.log("6.0 ionViewWillUnload 当页面将要销毁同时页面上元素移除时触发");
  // }
  //
  // ionViewCanEnter(){
  //   console.log("ionViewCanEnter");
  // }
  //
  // ionViewCanLeave(){
  //   console.log("ionViewCanLeave");
  // }

}
