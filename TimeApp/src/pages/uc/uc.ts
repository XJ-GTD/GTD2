import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, Navbar} from 'ionic-angular';
import {ParamsService} from "../../service/util-service/params.service";
import {UEntity} from "../../entity/u.entity";
import {RelmemService} from "../../service/relmem.service";
import {UserService} from "../../service/user.service";
import {DataConfig} from "../../app/data.config";

/**
 * Generated class for the UcPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-uc',
  templateUrl: 'uc.html',
  providers: []
})
export class UcPage {

  @ViewChild(Navbar) navBar: Navbar;

  //编辑控制
  state:any = false;
  uo:UEntity;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private userService: UserService,
              private loadingCtrl: LoadingController,
              private paramsService: ParamsService) {
    this.init();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UcPage');
    this.navBar.backButtonClick = this.backButtonClick;
    this.navBar.setBackButtonText("");
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.navCtrl.pop();
  };

  init() {
    this.uo = DataConfig.uInfo;
    console.log("uc 获取用户信息："+JSON.stringify(this.uo))
  }

  updateUserInfo() {

  }

  relation() {
    console.log("UcPage跳转PaPage");
    this.navCtrl.push("PaPage");
  }

  edit(){
    this.state = true;
  }

  confirm(uo:UEntity){
    this.userService.upu(uo.uI,uo.uN,uo.hIU,uo.biy,uo.rn,uo.iC,uo.uS).then(data=>{
      if(data.code == 0){
        this.state = false;
        console.log("修改信息成功")
        this.userService.getUo().then(data=>{
          if(data.code == 0){

          }
        })
      }else{
        this.state = true;
        console.log("修改信息失败")
      }
    }).catch(reason => {
      this.state = true;
      console.log("修改信息失败")
    })

  }

}
