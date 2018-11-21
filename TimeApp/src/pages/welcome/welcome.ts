import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import {UtilService} from "../../service/util.service";
import {SqliteService} from "../../service/sqlite.service";
import { ParamsService } from "../../service/params.service";
import {UserModel} from "../../model/user.model";
import {BaseSqliteService} from "../../service/sqlite-service/base-sqlite.service";
import {UserSqliteService} from "../../service/sqlite-service/user-sqlite.service";
import {UEntity} from "../../entity/u.entity";
import {UoModel} from "../../model/out/uo.model";
import {WorkSqliteService} from "../../service/sqlite-service/work-sqlite.service";

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  slides = [
    {
      title: "Welcome to the GTD2!",
      description: "这 <b>是一个引导页</b> ！",
      image: "../../assets/imgs/welcome.jpg",
    }
  ];

  constructor(public navCtrl: NavController,
              public util: UtilService,
              private loadingCtrl: LoadingController,
              private sqliteService: BaseSqliteService,
              private userSqlite: UserSqliteService,
              private workSqlite: WorkSqliteService,
              private paramsService: ParamsService,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  goToLogin() {
    let u:UEntity=new UEntity();
    u.uI=this.util.getUuid();
    u.uty='0';
    this.workSqlite.test();
    this.sqliteService.save(u).then(data=>{
      console.log(data);
      this.navCtrl.setRoot('HomePage');
    })

    //this.navCtrl.setRoot('UserLoginPage');
    //this.visitor();
  }
  //同步本地日历数据
  uploadLocal(){

  }
  //创建数据库
  createSql(){

  }

  /**
   * 跳转注册页
   */
  register(){

  }
  /**
   * 游客身份登录 dch
   */
  visitor(){
    let loader = this.loadingCtrl.create({
      content: "正在加载...",
      duration: 1000
    });
  }

}
