import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import {UtilService} from "../../service/util.service";
import {SqliteService} from "../../service/sqlite.service";
import { ParamsService } from "../../service/params.service";
import {UserModel} from "../../model/user.model";
import {CalendarService} from "../../service/calendar.service";

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
              private sqliteService: SqliteService,
              private paramsService: ParamsService,
              private calendarService:CalendarService,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  goToLogin() {
    this.navCtrl.setRoot('UserLoginPage');
    //this.visitor();
  }
  //同步本地日历数据
  uploadLocal(){
    this.calendarService.findEvent().then(msg=>{
      let data=eval(msg);
      // alert(data.length);
      // alert(data[0].title);
      // alert(JSON.stringify(data[0]));
      for(let i=0;i<data.length;i++) {
        this.sqliteService.executeSql("INSERT INTO GTD_C(scheduleName,scheduleStartTime,scheduleDeadLine,labelId,localId) VALUES (?,?,?,?,?)",
          [data[i].title,data[i].startDate,data[i].endDate,"1",data[i].id])
          .then(msg=>{
            //alert("插入C表");
          })
          .catch(err=>{
            //alert("插入C表错误:"+err);
          });

        this.sqliteService.executeSql("SELECT last_insert_rowid() as scheduleId FROM GTD_C",[])
          .then(data=>{
            //alert(data.rows.item(0).scheduleId);
            this.sqliteService.executeSql("INSERT INTO GTD_D(scheduleId,scheduleOtherName,scheduleAuth,playersStatus,userId) VALUES (?,?,?,?,?)" ,
              [data.rows.item(0).scheduleId,"","","",""]);
          })
          .catch(err=>{
            //alert("获取日程ID失败");
          });
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
    let loader = this.loadingCtrl.create({
      content: "正在加载...",
      duration: 1000
    });
    //判断是否存在
    this.sqliteService.userIsExist('').then(data=>{
      if(data && data.rows&& data.rows.length>0){
        this.paramsService.user=data.rows.item(0)
        loader.present();
        this.navCtrl.setRoot('HomePage');
      }else{
        //不存在则添加
        let uuid = this.util.getUuid();
        uuid='1234567890'
        this.sqliteService.executeSql('INSERT INTO GTD_A(userId,userType) VALUES (?,?)',[uuid,0])
          .then(data=>{
            let user: UserModel = new UserModel();
            user.userId=uuid;
            loader.present();
            this.navCtrl.setRoot('HomePage');
          }).catch(e=>{
          console.log(e)
        })
      }
    }).catch(e=>{
      console.log(e);
    })
  }

}
