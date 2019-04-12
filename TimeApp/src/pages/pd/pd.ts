import {Component} from '@angular/core';
import {ActionSheetController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {PagePDPro, PdService} from "./pd.service";
import {AgdPro} from "../../service/restful/agdsev";
import {UtilService} from "../../service/util-service/util.service";

/**
 * Generated class for the 计划展示 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pd',
  template:
  `
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons left>
          <button ion-button icon-only (click)="goBack()" color="danger">
            <img class="img-header-left" src="./assets/imgs/fh2.png">
          </button>
        </ion-buttons>

        <ion-buttons right>
          <button ion-button color="danger" (click)="more(jh)">
            <img class="img-header-right" src="./assets/imgs/more.png">
            <!--<ion-icon name="remove-circle-outline"></ion-icon>-->
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <ion-grid>
        <ion-row>
          <ion-card>
            <ion-card-content text-center>
              <div>{{plan.pn.jn}}</div>
            </ion-card-content>
          </ion-card>
          <div padding></div>
        </ion-row>
        <ion-row *ngFor="let agenda of plan.pa; let i = index" [ngClass]="{'agenda-card-past': today > agenda.adt, 'agenda-card': today <= agenda.adt}" justify-content-center>
          <ion-grid>
            <ion-row *ngIf="(i === 0) || (agenda.adt.slice(0,4) !== plan.pa[i - 1]['adt'].slice(0,4))" justify-content-start>
              <h3 class="plan-year">{{agenda.adt.slice(0,4)}}</h3>
            </ion-row>
            <ion-row justify-content-center align-items-start>
              <div *ngIf="(i === 0) || (agenda.adt.slice(0,10) !== plan.pa[i - 1]['adt'].slice(0,10))" class="agenda-col-date left-off right-off" justify-content-start>
                <p class="app-agenda-day">{{agenda.adt.slice(5,10)}}</p>
              </div>
              <div *ngIf="(i !== 0) && (agenda.adt.slice(0,10) === plan.pa[i - 1]['adt'].slice(0,10))" class="agenda-col-date left-off right-off" justify-content-start>
              </div>
              <div class="agenda-col-time right-off left-off" justify-content-between>
                <div class="time-slot">
                  <p class="app-agenda-time">{{(agenda.st != null && agenda.st === "99:99")? '全天' : agenda.st.slice(0, 5)}}</p>
                </div>
                <div class="pointer-slot"><span class="plan-color-pointer"><div class="color-dot" [ngStyle]="{'background-color': plan.pn.jc }"></div></span></div>
              </div>
              <div class="agenda-col-content right-off left-off" [ngClass]="{'agenda-content': ((i + 1) === plan.pa.length)? false : (agenda.adt.slice(0, 10) === plan.pa[i + 1]['adt'].slice(0, 10))}" justify-content-start>
                <p class="text-left app-agenda-title">{{agenda.at}}</p>
                <p class="app-user-text text-left">{{agenda.am}}</p>
              </div>
            </ion-row>
          </ion-grid>
        </ion-row>
      </ion-grid>
    </ion-content>

    <div class="div-content" *ngIf="IsShowDiv">
      <div class="modal-header">
        <button type="button" class="div-close" aria-hidden="true" (click)="closeDialog()">&times;</button>
      </div>
      <div class="div-text">
        <span>{{text}}</span>
      </div>
      <div class="div-btn">
        <div (click)="closeDialog()">取消</div>
        <div (click)="TwoBtnSure()">确定</div>
      </div>
    </div>
      
    <!--遮罩层-->
    <div class="shade" *ngIf="IsShowCover" (click)="closeDialog()"></div>
  `,
})
export class PdPage {

  jh:PagePDPro;
  today: string = new Date().toISOString();
  plan:any ={
    "pn": {},
    "pa":new Array<AgdPro>(),
  };
  IsShowDiv: boolean = false;
  IsShowCover: boolean = false;
  text:any;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private alertCtrl: AlertController,
              private actionSheetCtrl: ActionSheetController,
              private util: UtilService,
              private pdService:PdService) {
    this.jh = this.navParams.get("jh");
    this.plan.pn = this.jh;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PdPage');
  }

  ionViewDidEnter(){
    this.pdService.getPlan(this.jh.ji).then(data=>{
      this.plan.pa = data.data;
    }).catch(res=>{
      console.log("获取计划列表失败" + JSON.stringify(res));
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  closeDialog() {
    if (this.IsShowDiv) {
      this.IsShowDiv = false;
      this.IsShowCover = false;
    }
  }

  more(jh:PagePDPro){
    let actionSheet = this.actionSheetCtrl.create({
      //title: 'Modify your album',
      buttons: [
        {
          text: '分享',
          role: 'share',
          handler: () => {
            this.pdService.sharePlan(this.plan).then(data=>{
              //alert("分享地址是："+JSON.stringify(data.data.psurl))

              this.text = data.data.psurl;
              this.IsShowDiv = true;
              this.IsShowCover = true;
            }).catch(res=>{
              this.util.toast('分享失败',1500);
            });
          }
        },
        {
          text: '删除',
          handler: () => {
            if(jh.jt == "1"){
              let alert = this.alertCtrl.create({
                title: '',
                subTitle: '系统计划请在计划一栏页面长按删除',
                buttons: [{
                  text: '取消',
                }]
              });
              alert.present();
            }else{

              //this.util.popMsgbox('确定要删除计划“' + jh.jn +'”吗？',this.delete(jh.ji));

              let alert = this.alertCtrl.create({
                title: '',
                subTitle: '确定要删除计划“' + jh.jn +"”吗？",
                buttons: [{
                  text: '取消',
                }, {
                  text: '确定',
                  handler: () => {
                    this.pdService.delete(jh.ji).then(data=>{
                      this.navCtrl.pop();
                    }).catch(res=>{
                      this.util.toast('删除计划失败',1500);
                    });
                  }
                }]
              });
              alert.present();
            }
          }
        },
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  delete(ji:string){
    this.pdService.delete(ji).then(data=>{
      this.navCtrl.pop();
    }).catch(res=>{
      this.util.toast('删除计划失败',1500);
    })
  }
}
