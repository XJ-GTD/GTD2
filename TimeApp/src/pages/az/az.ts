import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {SqliteService} from "../../service/sqlite.service";
import { ParamsService } from "../../service/util-service/params.service";
import {UserModel} from "../../model/user.model";
import {BaseSqliteService} from "../../service/sqlite-service/base-sqlite.service";
import {UserSqliteService} from "../../service/sqlite-service/user-sqlite.service";
import {UEntity} from "../../entity/u.entity";
import {UoModel} from "../../model/out/uo.model";
import {WorkSqliteService} from "../../service/sqlite-service/work-sqlite.service";
import {CalendarService} from "../../service/calendar.service";
import {RcEntity} from "../../entity/rc.entity";
import {RcpEntity} from "../../entity/rcp.entity";
import {AppConfig} from "../../app/app.config";
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../service/base.service";
import {WorkService} from "../../service/work.service";
import {UserService} from "../../service/user.service";

/**
 * Generated class for the AzPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-az',
  templateUrl: 'az.html',
})
export class AzPage {

  slides = [
    {
      title: "Welcome to the GTD2!",
      description: "这 <b>是一个引导页</b> ！",
      image: "../../assets/imgs/welcome_1.jpg",
    }
  ];

  constructor(public navCtrl: NavController,
              public util: UtilService,
              private loadingCtrl: LoadingController,
              private sqliteService: BaseService,
              private userSqlite: UserService,
              private workSqlite: WorkService,
              private paramsService: ParamsService,
              private calendarService:CalendarService,
              private http: HttpClient,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AzPage');

    //同步本地日历
    this.uploadLocal();
  }

  goToLogin() {
    let u:UEntity=new UEntity();
    u.uI=this.util.getUuid();
    u.uty='0';
    this.sqliteService.save(u).then(data=>{
      console.log(data);
      this.navCtrl.setRoot('HaPage');
      this.calendarService.uploadLocal(u.uI);
    })
    //this.navCtrl.setRoot('UbPage');
  }
  //同步本地日历数据
  uploadLocal(){
    //this.calendarService.uploadLocal();
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
    this.http.post(AppConfig.AUTH_VISITOR_URL, {
      userId: this.util.getUuid(),
      deviceId: this.util.getDeviceId(),
    },AppConfig.HEADER_OPTIONS_JSON).subscribe(data=>{
      alert(data)
    })
  }

}
