import {Component, ViewChild} from '@angular/core';
import {
  IonicPage, LoadingController, NavController, NavParams, AlertController, Navbar,
  ModalController
} from 'ionic-angular';
import { ParamsService } from "../../service/util-service/params.service";
import { FindOutModel } from "../../model/out/find.out.model";
import { LabelModel } from "../../model/label.model"
import { PopoverController,ActionSheetController } from "ionic-angular";
import {RelmemService} from "../../service/relmem.service";
import {RuModel} from "../../model/ru.model";
import {WorkService} from "../../service/work.service";
import {LbModel} from "../../model/lb.model";
import {UtilService} from "../../service/util-service/util.service";
import * as moment from "moment";
import {ZtdModel} from "../../model/ztd.model";
import {DataConfig} from "../../app/data.config";
import {JhService} from "../../service/jh.service";
import {JhModel} from "../../model/jh.model";

/**
 * Generated class for the SbPage page.
 * create by wzy
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sb',
  templateUrl: 'sb.html',
  providers: []
})
export class SbPage {

  @ViewChild(Navbar) navBar: Navbar;


  private data: any;
  group: any;//Array<GroupModel>;
  schedule: any;
  groupFind: FindOutModel;
  label: Array<LabelModel>;

  pRelAl:Array<RuModel>;//所有联系人
  select:any = [];
  // selectLb:Array<LbModel>;

  lbs: Array<LbModel>;
  lb:LbModel;
  lbtmp:LbModel;
  repeatTypes:Array<ZtdModel>;
  type: any ;
  title:any;
  startTime:any;//开始时间
  repeatType:any;//重复类型
  remarks:any;//备注

  isShowLb:any = false;
  isShowJh:any = false;
  showJhFlag:boolean = true;
  showLbFlag:boolean = true;
  showA:boolean = false;//重复类型
  showB:boolean = false;//重复时间
  showC:boolean = false;//备注
  showD:boolean = false;
  showE:boolean = false;//闹钟

  repeatTime:any = SbPage.yType;
  static yType:any = "MM月DD日";
  static mType:any = "DD日 HH时mm分";
  static wType:any = "";
  static dType:any = "HH时mm分ss秒";

  remindType:string ;

  jhs:Array<JhModel>;
  jh:JhModel;
  jhtmp:JhModel;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private paramsService: ParamsService,
              private popoverCtrl:PopoverController,
              private actionSheetCtrl: ActionSheetController,
              private relmemService: RelmemService,
              private workService: WorkService,
              private util: UtilService,
              private jhService: JhService,
              private modal: ModalController) {
    this.jhtmp = new JhModel();
    this.jhtmp.jn="添加计划";
    this.jh = this.jhtmp;
    this.lbtmp = new LbModel();
    this.lbtmp.lan="标签";
    this.lb = this.lbtmp;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SbPage');
    this.navBar.backButtonClick = this.backButtonClick;
    this.navBar.setBackButtonText("");
    this.init();
  }

  init() {
    this.getAllRel();
    this.findLabel();
    this.getAllJh();
    this.startTime = new Date(new Date().getTime()+8*60*60*1000).toISOString();
    this.repeatTypes = DataConfig.ZTD_MAP.get(DataConfig.REPEAT_TYPE); //重复类型
  }

  //查询系统标签
  findLabel() {
    this.workService.getlbs().then(data=>{
      if(data.code == 0){
        this.lbs = data.lbs;
        console.log('标签查询成功')

      }
    }).catch(reason => {

    })

  }

  /**
   * 选择参与人
   */
  addContact() {
    this.groupFind = new FindOutModel();
    this.groupFind.userId= this.paramsService.user.userId;
    this.groupFind.findType = 3;        //暂为硬代码，默认群组
  }

  //发布任务入库
  newProject() {


    // this.scheduleOut = new ScheduleOutModel();
    // this.schedule.userId = this.paramsService.user.userId;
    console.log("时间格式规整前 :: " + this.startTime);
    /*时间格式规整*/
    if (this.startTime != null && this.startTime != "") {
      this.startTime = this.startTime.replace("T", " ");
      this.startTime = this.startTime.replace(":00Z", "");
    }
    this.startTime = moment(new Date(this.startTime).getTime()-8*60*60*1000).format("YYYY-MM-DD HH:mm");
    console.log("时间格式规整后 :: " + this.startTime);

    let rul = new Array<RuModel>();
    if(this.select){
      for(let i = 0;i< this.select.length;i++){
        rul.push(this.pRelAl[this.select[i]]);
      }
    }
    this.workService.arc(this.title,this.startTime,this.type,this.jh.ji,this.repeatType,this.remarks,'',rul).then(data=>{
      if(data.code == 0){
        console.log("添加日程成功")
        this.navCtrl.push('HzPage')
      }else{
        console.log("添加日程失败")
      }
    }).catch(reason => {
      console.log("添加日程失败")
    })
  }

  //编辑完成提交
  editFinish() {

  }


  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.paramsService.schedule=null;
    this.navCtrl.pop();
  }

  // goBack() {
  //   // 重写返回方法
  //   this.paramsService.schedule=null;
  //   this.navCtrl.pop();
  //   // this.navCtrl.push('GroupListPage');
  // }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your album',
      buttons: [
        {
          text: 'Destructive',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },{
          text: 'Archive',
          handler: () => {
            console.log('Archive clicked');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  showCheckbox() {
    let alert = this.alertCtrl.create();
    alert.setTitle('选择参与人');

    for(let i = 0;i<this.pRelAl.length;i++){
      let selected = false;
      for(let j = 0;j<this.select.length;j++){
        if(i == this.select[j]){
          selected = true;
          break;
        }
      }

      alert.addInput({
        type: 'checkbox',
        label: this.pRelAl[i].ran,
        value: i.toString(),
        checked: selected
      });
    }
    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        console.log('Checkbox data:', data);
        this.select = data;
      }
    });
    alert.present();
  }

  //所有联系人
  getAllRel(){
    this.relmemService.getrus(null,null,null,null,'0').then(data=>{
      console.log(data);
      if(data.code == 0){
        this.pRelAl = data.us;
      }else{
        console.log("查询失败");
      }

    }).catch(reason => {
      console.log("查询失败");
    })
  }

  //所有计划
  getAllJh(){
    this.jhService.getJhs(null).then(data=>{
      console.log("获取所有计划选项 :: " + JSON.stringify(data));
      this.jhs = data.jhs;
    }).catch(reason => {
      console.log("获取所有计划选项 :: err " + JSON.stringify(reason));
    })
  }

  //
  backdropclick(e){
    //判断点击的是否为遮罩层，是的话隐藏遮罩层
    if(e.srcElement.className == 'itemClass'){
      this.isShowJh = false;
      this.isShowLb = false;
      // this.showChange();


      this.type = this.lb.lai;
      this.showSelect();
    }
    //隐藏滚动条
    e.stopPropagation();
  }

  //添加计划
  showJhs(){
    if(this.showJhFlag){
      let domList = document.getElementsByName("labJh");
      for(let i = 0;i<domList.length;i++){
        let dom = domList.item(i);
        let rgb = 'rgb('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+')';
        dom.style.borderColor = rgb;
        dom.style.color = rgb;
      }
      this.showJhFlag = false;
    }
    this.isShowJh = true;
  }

  //选择标签
  showLbs(){
    if(this.showLbFlag){
      let domList = document.getElementsByName("labLb");
      for(let i = 0;i<domList.length;i++){
        let dom = domList.item(i);
        let rgb = 'rgb('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+')';
        dom.style.borderColor = rgb;
        dom.style.color = rgb;
      }
      this.showLbFlag = false;
    }
    this.isShowLb = true;
  }

  // showChange(){
  //   let A= false;
  //   let B= false;
  //   let C= false;
  //   let D= false;
  //   let E= false;
  //
  //   for(let i = 0;this.selectLb != undefined && i<this.selectLb.length;i++){
  //     switch(this.selectLb[i].lat){
  //       case '1': A = true;
  //         break;
  //       case '2': B = true;
  //         break;
  //       case '3': C = true;
  //         break;
  //       case '4': D = true;
  //         break;
  //       case '5': E = true;
  //         break;
  //     }
  //   }
  //   this.showA = A;
  //   this.showB = B;
  //   this.showC = C;
  //   this.showD = D;
  //   this.showE = E;
  //
  // }

  //时间选择类型
  chengeType(){
    switch(this.repeatType){
      case "y": this.repeatTime = SbPage.yType;
        break;
      case "m": this.repeatTime = SbPage.mType;
        break;
      case "w": this.repeatTime = SbPage.wType;
        break;
      case "d": this.repeatTime = SbPage.dType;
        break;
    }
  }



  showSelect(){
    let A= false;
    let B= false;
    let C= false;
    let D= false;
    let E= false;
    let tmp:LbModel = new LbModel();
    for(let lb of this.lbs){
      if(lb.lai == this.type){
        tmp = lb;
        break;
      }
    }
    switch(tmp.lat){
      case '1':
        C = true;
        E = true;
        break;
      case '2':
        B = true;
        E = true;
        break;
      case '3':
        A = true;
        B = true;
        C = true;
        E = true;
        break;
      case '4':
        A = true;
        B = true;
        C = true;
        D = true;
        break;
      case '5':
        B = true;
        break;
    }
    this.showA = A;
    this.showB = B;
    this.showC = C;
    this.showD = D;
    this.showE = E;

  }

  //提醒时间设置
  remindSet(){
    let alert = this.alertCtrl.create({
      title:'提醒时间',
      inputs:[
        {type:'radio',value:"无",label:"无",name:"sj",checked:false,handler:data=>{console.log(JSON.stringify(data))}},
        {type:'radio',value:"任务发生当天",label:"任务发生当天",name:"sj",checked:false,handler:data=>{console.log(JSON.stringify(data))}},
        {type:'radio',value:"1天前",label:"1天前",name:"sj",checked:false,handler:data=>{console.log(JSON.stringify(data))}},
        {type:'radio',value:"2天前",label:"2天前",name:"sj",checked:false,handler:data=>{console.log(JSON.stringify(data))}},
        {type:'radio',value:"1周前",label:"1周前",name:"sj",checked:false,handler:data=>{console.log(JSON.stringify(data))}}
      ],
      buttons:[
        {text:"确认",role:null,handler:data=>{console.log(JSON.stringify(data));this.remindType=data;}},
        {text:"取消",role:null,handler:data=>{console.log(JSON.stringify(data))}},
      ]

    });
    alert.present()
  }

  showLb(){
    let inputs = [];
    for(let lb of this.lbs){
      inputs.push(
        {type:'radio',value:lb,label:lb.lan,checked:false}
      )
    }
    console.log(JSON.stringify(inputs))
    let alert = this.alertCtrl.create({
      title:'标签',
      inputs:inputs,
      buttons:[
        {text:"取消",role:null,handler:data=>{console.log(JSON.stringify(data))}},
        {text:"确认",role:null,handler:data=> {
            console.log(JSON.stringify(data));
            let lb:LbModel = data.valueOf();
            this.lb = lb;
            this.type = lb.lai;
            this.showSelect();
          }
        },
      ]
    });
    alert.present();
  }


  selectJh = function ($event,jh){
    let flag = undefined;
    console.log(JSON.stringify(this.jhs));
    console.log(JSON.stringify(jh));
    for(let i =0;i<this.jhs.length;i++){
      if(this.jhs[i].ji == jh.ji){
        flag = i;
        break;
      }
    }
    let domList = document.getElementsByName("labJh");
    for(let i = 0;i<domList.length;i++){
      if(i == flag){
        let dom = domList.item(i);
        let fcolor = dom.style.color; //当前颜色
        let rgb = dom.style.borderColor; //当前边框颜色
        let color = "rgb(255, 255, 255)"; //预设颜色
        // alert("当前颜色::" + fcolor + "当前边框颜色 :: " + rgb + "预设颜色 :: " + color);
        if(fcolor != color){
          dom.style.backgroundColor = rgb;
          dom.style.color = color;
          this.jh = jh;
          this.showJhFlag = false;
        }else{
          dom.style.backgroundColor = color;
          dom.style.color = rgb;
          this.jh = this.jhtmp;
          // this.showJhFlag = true;
        }
      }else{
        let dom = domList.item(i);
        let rgb = dom.style.borderColor;
        let color = rgb;
        let bgcolor = "rgb(255, 255, 255)";
        dom.style.backgroundColor = bgcolor;
        dom.style.color = color;
      }
    }
  };


  selectLb = function ($event, lb) {
    let flag = undefined;
    console.log(JSON.stringify(this.lbs));
    console.log(JSON.stringify(lb));
    for(let i =0;i<this.lbs.length;i++){
      if(this.lbs[i].lai == lb.lai){
        flag = i;
        break;
      }
    }
    let domList = document.getElementsByName("labLb");
    for(let i = 0;i<domList.length;i++){
      if(i == flag){
        let dom = domList.item(i);
        let fcolor = dom.style.color; //当前颜色
        let rgb = dom.style.borderColor; //当前边框颜色
        let color = "rgb(255, 255, 255)"; //预设颜色
        // alert("当前颜色::" + fcolor + "当前边框颜色 :: " + rgb + "预设颜色 :: " + color);
        if(fcolor != color){
          dom.style.backgroundColor = rgb;
          dom.style.color = color;
          this.lb = lb;
          this.showLbFlag = false;
        }else{
          dom.style.backgroundColor = color;
          dom.style.color = rgb;
          this.lb = this.lbtmp;
          this.showLbFlag = true;
        }
      }else{
        let dom = domList.item(i);
        let rgb = dom.style.borderColor;
        let color = rgb;
        let bgcolor = "rgb(255, 255, 255)";
        dom.style.backgroundColor = bgcolor;
        dom.style.color = color;
      }
    }
  };

  showRemarks(){
    // let model = this.modal.create("TmdPage",{text:this.remarks},{showBackdrop:false});
    // model.onDidDismiss((data)=>{
    //   console.log(JSON.stringify(data));
    //   this.remarks = data.text;
    // });
    // model.present();
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

