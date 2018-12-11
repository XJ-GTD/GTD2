import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, Nav, Events} from 'ionic-angular';
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
import {PageConfig} from "../../app/page.config";
import {FiSqliteService} from "../../service/sqlite-service/fi-sqlite.service";

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

  rootPage:any;

  constructor(public navCtrl: NavController,
              public util: UtilService,
              private loadingCtrl: LoadingController,
              private sqliteService: BaseService,
              private userSqlite: UserService,
              private workSqlite: WorkService,
              private paramsService: ParamsService,
              private calendarService:CalendarService,
              private http: HttpClient,
              public navParams: NavParams,
              private baseSqlite:BaseSqliteService,
              private fisqlite:FiSqliteService,
              private nav:Nav,
              private events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AzPage');

    //同步本地日历
    // this.uploadLocal();
  }

  goToLogin() {

    this.navCtrl.setRoot('HaPage');
    //this.navCtrl.setRoot('UbPage');
  }
  //同步本地日历数据
  uploadLocal(){
     return this.calendarService.uploadLocal();
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

  startApp(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    //初始化创建数据库
    // this.baseSqlite.createDb();

    //查询版本
    this.fisqlite.getfi(1).then(data=>{
      this.rootPage = PageConfig.HZ_PAGE;
      let istrue:boolean = false
      if(data && data.rows && data.rows.length>0){
        if(data.rows.item(0).isup==1){
          istrue=true;
          this.fisqlite.ufi(null,0)
        }
      }else{
        istrue=true;
        this.fisqlite.afi(1,0)
      }
      //如果发现最新更新则跳转引导页
      if(istrue){
        this.uploadLocal();
        loading.dismiss();
        this.nav.setRoot(this.rootPage);

      }else{
        //获取Token
        this.userSqlite.getUo().then(data=>{
          // AppConfig.Token=data.u.uT;
          if(data && data.u && data.u.uT && data.u.uT !='null' && data.u.uT !=''){
            AppConfig.Token=data.u.uT;
            console.debug('MyApp初始化Token'+AppConfig.Token)
          }
          console.debug(JSON.stringify(data))
          loading.dismiss();
          this.nav.setRoot(this.rootPage);
        }).catch(e=>{
          alert("MyApp获取Token失败")
          console.error("MyApp获取Token失败"+e.message)
          loading.dismiss();
          this.nav.setRoot(this.rootPage);
        })

      }

    }).catch(e=>{
      // alert("MyApp查询版本号失败")
      //首次打开App,初始化创建数据库建表
      this.baseSqlite.createTable();
      this.rootPage = PageConfig.HZ_PAGE;
      this.events.subscribe('db:create', () => {
          //创建数据库与表成功

      })

      this.uploadLocal().then(data=>{

      }).catch(reason => {

      });
      loading.dismiss();
      this.nav.setRoot(this.rootPage);

    })

  }
}
