import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the 群组列表 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gl',
  template:`<ion-header> 
    <ion-toolbar> 
      <ion-buttons no-margin left> 
        <button ion-button icon-only (click)="goBack()" style="padding-left: 10px;"> 
          <ion-icon name="arrow-back"></ion-icon> 
        </button> 
      </ion-buttons> 
      <ion-segment [(ngModel)]="relation"> 
        <ion-segment-button value="person" > 
          个人 
        </ion-segment-button> 
        <ion-segment-button value="group"> 
          群组 
        </ion-segment-button> 
      </ion-segment> 
      <ion-buttons no-margin right [ngSwitch]="relation" style="padding-right: 10px;"> 
        <button ion-button icon-only *ngSwitchCase="'person'" (click)="toAddMember()"> 
          <ion-icon name="person-add"></ion-icon> 
          <!--<img src="./assets/imgs/addPerson.png"/>--> 
        </button> 
        <button ion-button icon-only *ngSwitchCase="'group'" (click)="toGroupCreate()"> 
          <ion-icon name="add"></ion-icon> 
          <!--<img src="./assets/imgs/aaddGroup.png"/>--> 
        </button> 
      </ion-buttons> 
    </ion-toolbar> 
  </ion-header> 
  <ion-content padding class="page-backgroud-color"> 
    <div [ngSwitch]="relation"> 
      <ion-list *ngSwitchCase="'person'"> 
        <ion-item *ngIf="us == undefined"> 
          <ion-label>你还没有添加联系人，快点击右上方添加联系人</ion-label> 
        </ion-item> 
        <ion-item-sliding *ngFor="let u of us"> 
          <ion-item (click)="toMemberDetail(u)"> 
            <ion-avatar item-start > 
              <img [src]="u.hiu"> 
            </ion-avatar> 
            <ion-label> 
              <p style="color: #000; line-height: 17px;font-size: 1.7rem;">{{u.ran}}</p> 
              <p style="color: #666666;font-size: 12px;">{{u.rN}}</p> 
            </ion-label> 
          </ion-item> 
          <ion-item-options side="right"> 
            <button ion-button color="danger" (click)="delPerson(u)">删除</button> 
          </ion-item-options> 
        </ion-item-sliding> 
      </ion-list> 
      <ion-list *ngSwitchCase="'group'"> 
        <ion-item *ngIf="gs == undefined"> 
          <ion-label >你还没有创建群组，快点击右上方创建群组</ion-label> 
        </ion-item> 
        <ion-item-sliding *ngFor="let g of gs"> 
          <button ion-item (click)="toGroupMember(g)"> 
            <ion-avatar item-start > 
              <img src="http://file03.sg560.com/upimg01/2017/01/932752/Title/0818021950826060932752.jpg"> 
            </ion-avatar> 
            <ion-label> 
              {{g.rN}} 
            </ion-label> 
          </button> 
          <ion-item-options side="right"> 
            <button ion-button color="danger" (click)="delGroup(g)">删除</button> 
          </ion-item-options> 
        </ion-item-sliding> 
      </ion-list> 
    </div> 
  </ion-content>`,
})
export class GlPage {

  relation: any = 'person' ;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public view: ViewController,) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaPage');
  }



  toAddMember(){
    // if(this.uo.uty == '0'){
    //   this.navCtrl.push(PageConfig._LP_PAGE,{"rePage":PageConfig._GL_PAGE})
    //   return;
    // }
    // console.log('PaPage跳转PfPage');
    // this.navCtrl.push('PfPage');
  }

  toGroupMember(g){
    // console.log('PaPage跳转PdPage');
    // this.navCtrl.push('PdPage',{g:g});
  }

  toGroupCreate(){
    // if(this.uo.uty == '0'){
    //   this.navCtrl.push(PageConfig._LP_PAGE,{"rePage":PageConfig._GL_PAGE})
    //   return;
    // }
    // console.log('PaPage跳转PePage');
    // this.navCtrl.push("PePage");
  }

  toMemberDetail(){
    // console.log('PaPage跳转PbPage');
    // this.navCtrl.push("PbPage",{u:u});
  }

  goBack() {
    this.navCtrl.pop();
  }

  queryPerson(){
    // this.relmemService.getrus("","","","","0").then(data=>{
    //   console.log(data);
    //   if(data.us != null && data.us.length > 0){
    //     console.log(data.us.length + "联系人不为空::" + data.us);
    //     this.us = data.us;
    //   }else{
    //     console.log("个人查询为空");
    //     this.us = undefined;
    //   }
    // }).catch( reason => {
    //   console.log("个人查询错误::" + reason.message);
    //   this.us = undefined;
    // });
  }

  delPerson(u){
    // this.relmemService.delRu(u.id).then(data=>{
    //   if(data.code == 0){
    //     console.log("个人删除成功");
    //     this.queryPerson()
    //   }else{
    //     console.log("个人删除失败");
    //   }
    // }).catch(reason => {
    //   console.log("个人删除异常::" + reason.message);
    // })
  }

  delGroup(g){
    // this.relmemService.delRu(g.id).then(data=>{
    //   if(data.code == 0){
    //     console.log("群组删除成功");
    //     this.queryGroup()
    //   }else{
    //     console.log("群组删除失败");
    //   }
    // }).catch(reason => {
    //   console.log("群组删除异常::" + reason.message);
    // })
  }

  queryGroup(){
    // this.relmemService.getrus(null,null,null,null,'1').then(data=>{
    //   if(data.code == 0 && data.us != null && data.us.length > 0 ){
    //     console.log("查询群组成功");
    //     this.gs = data.us;
    //   }else{
    //     console.log("查询群组为空");
    //     this.gs = undefined;
    //   }
    // }).catch(reason => {
    //   console.log("查询群组失败");
    //   this.gs = undefined;
    //
    // });
  }

  ionViewWillEnter(){
    // console.log("查询登陆用户");
    // this.uo = DataConfig.uInfo;
    // console.log("查询个人");
    // this.queryPerson();
    // console.log("查询群组");
    // this.queryGroup();
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
