import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, AlertController, Navbar} from 'ionic-angular';
import { ParamsService } from "../../service/util-service/params.service";
import { HttpClient } from "@angular/common/http";
import { FindOutModel } from "../../model/out/find.out.model";
import { LabelModel } from "../../model/label.model"
import { PopoverController,ActionSheetController } from "ionic-angular";
import {RelmemService} from "../../service/relmem.service";
import {RuModel} from "../../model/ru.model";
import {WorkService} from "../../service/work.service";
import {LbModel} from "../../model/lb.model";

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

  pRelAl:Array<RuModel>;
  select:any = [];
  selectLb:Array<LbModel>;

  lbs: Array<LbModel>
  type: any ;
  title:any;
  startTime:any;

  isShow:any = false;
  showA:boolean = false;
  showB:boolean = false;
  showC:boolean = false;
  showD:boolean = false;
  showE:boolean = false;



  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpClient,
              public loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private paramsService: ParamsService,
              private popoverCtrl:PopoverController,
              private actionSheetCtrl: ActionSheetController,
              private relmemService: RelmemService,
              private workService: WorkService) {

    this.init();

  }

  init() {
    //判断：创建/编辑
    // if (this.paramsService.schedule != null) {
    //   this.schedule = new ScheduleModel();
    //   this.schedule = this.paramsService.schedule;
    // } else {
    //   this.scheduleOut =  new ScheduleOutModel();
    //   this.schedule = this.scheduleOut;
    // }
    // this.addContact();
    // this.findLabel();
    // this.group = [{groupId:1,groupName:"李四"},{groupId:2,groupName:"马武"}];
    this.getAllRel();
    this.findLabel();
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
    // this.http.post(AppConfig.GROUP_ALL_SHOW_URL, this.groupFind, {
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   responseType: 'json'
    // })
    //   .subscribe(data => {
    //     this.data = data;
    //     let loader = this.loadingCtrl.create({
    //       content: this.data.message,
    //       duration: 1000
    //     });
    //     if (this.data.code == 0) {
    //       this.group = [];
    //       this.group = this.data.data.groupList;
    //
    //     } else if (this.data.code == 1) {
    //       loader.setContent("暂未找到参与人，请尝试创建参与人吧");
    //       loader.present();
    //     } else if (this.data.code == -1) {
    //       loader.setContent("服务器繁忙，请稍后再试");
    //       loader.present();
    //     }
    //
    //   })


  }

  //发布任务入库
  newProject() {


    // this.scheduleOut = new ScheduleOutModel();
    // this.schedule.userId = this.paramsService.user.userId;
    /*时间格式规整*/
    if (this.startTime != null && this.startTime != "") {
      this.startTime = this.startTime.replace("T", " ");
      this.startTime = this.startTime.replace(":00Z", "");
    }
    if (this.startTime != null && this.startTime != "") {
      this.startTime = this.startTime.replace("T", " ");
      this.startTime = this.startTime.replace(":00Z", "");
    }

    let rul = new Array<RuModel>();
    for(let i = 0;i< this.select.length;i++){
      rul.push(this.pRelAl[this.select[i]]);
    }

    this.workService.arc(this.title,this.startTime,null,this.type,null,rul).then(data=>{
      if(data.code == 0){
        console.log("添加日程成功")
        this.navCtrl.setRoot('HzPage')
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad SbPage');
    this.navBar.backButtonClick = this.backButtonClick;
    this.navBar.setBackButtonText("");
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.paramsService.schedule=null;
    this.navCtrl.pop();
  }

  goBack() {
    // 重写返回方法
    this.paramsService.schedule=null;
    this.navCtrl.pop();
    // this.navCtrl.push('GroupListPage');
  }

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

  //所有联系
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


  backdropclick(e){
    //判断点击的是否为遮罩层，是的话隐藏遮罩层
    if(e.srcElement.className == 'itemClass'){
      this.isShow = false;
      this.showChange();
    }
    //隐藏滚动条
    e.stopPropagation();
  }

  show(){
    this.isShow = true
  }

  checkdd(lb){
    //控制
    if(lb.lau == null){
      lb.lau = true;
    }else{
      lb.lau = !lb.lau;
    }
    if(this.selectLb == undefined || this.selectLb.length == 0){
      this.selectLb = new Array<LbModel>();
      this.selectLb.push(lb);
      return;
    }
    for(let i = 0;i<this.selectLb.length;i++){
      if(lb.lai == this.selectLb[i].lai){
        let tmp = new Array<LbModel>();
        for(let j = 0;j<this.selectLb.length;j++){
          if(j != i){
            tmp.push(this.selectLb[j]);
          }
        }
        this.selectLb  = tmp;
        return;
      }
    }

    console.log('tianj')
    this.selectLb.push(lb);

  }

  showChange(){
    let A= false;
    let B= false;
    let C= false;
    let D= false;
    let E= false;

    for(let i = 0;this.selectLb != undefined && i<this.selectLb.length;i++){
      switch(this.selectLb[i].lat){
        case 'BQA': A = true;
        case 'BQB': B = true;
        case 'BQC': C = true;
        case 'BQD': D = true;
        case 'BQE': E = true;
      }
    }
    this.showA = A;
    this.showB = B;
    this.showC = C;
    this.showD = D;
    this.showE = E;

  }
}

