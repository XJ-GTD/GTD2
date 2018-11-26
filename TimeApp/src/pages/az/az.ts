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
              private sqliteService: BaseSqliteService,
              private userSqlite: UserSqliteService,
              private workSqlite: WorkSqliteService,
              private paramsService: ParamsService,
              private calendarService:CalendarService,
              private http: HttpClient,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AzPage');
    this.uploadLocal();
  }

  goToLogin() {
    let u:UEntity=new UEntity();
    u.uI=this.util.getUuid();
    u.uty='0';
    this.workSqlite.test();
    this.sqliteService.save(u).then(data=>{
      console.log(data);
      this.navCtrl.setRoot('HaPage');
    })
    //this.navCtrl.setRoot('UbPage');
  }
  //同步本地日历数据
  uploadLocal(){
    this.calendarService.findEvent().then(msg=>{
      let data=eval(msg);
      // alert(data.length);
      // alert(data[0].title);
      // alert(JSON.stringify(data[0]));

      for(let i=0;i<data.length;i++) {
        let rc=new RcEntity();
        rc.sI=this.util.getUuid();
        rc.uI="";
        rc.sN=data[i].title;
        rc.lI="";

        let rcp=new RcpEntity();
        rcp.pI=this.util.getUuid();    //日程参与人表uuID
        rcp.sI=rc.sI; //关联日程UUID
        rcp.son="";  //日程别名
        rcp.sa="";   //修改权限
        rcp.ps="";   //完成状态
        rcp.cd=data[i].startDate;//创建时间
        rcp.pd="";   //完成时间
        rcp.uI=rc.uI; //参与人ID
        rcp.ib="1";

        this.sqliteService.executeSql(rc.isq,
          [])
          .then(msg=>{
            //alert(rc.isq);
          })
          .catch(err=>{
            //alert("插入C表错误:"+err);
          });


        this.sqliteService.executeSql(rcp.isq , [])
          .then(msg=>{
            //alert(rcp.isq);
          })
          .catch(err=>{
            //alert("插入D表错误:"+JSON.stringify(err));
          });;

      }
    }).catch(err=>{
      //alert("err");
      //alert(err);
    });
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
