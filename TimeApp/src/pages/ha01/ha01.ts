import {Component, ElementRef, Input, Renderer2} from '@angular/core';
import {App, Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ScheduleModel} from "../../model/schedule.model";
import {UtilService} from "../../service/util-service/util.service";
import {WorkService} from "../../service/work.service";
import * as moment from "moment";

/**
 * Generated class for the Ha01Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ha01',
  template:'<ion-scroll scrollY="true">' +
  '  <ul>' +
  '    <li ion-item *ngFor="let itm of dayEvents ;let i = index" (click)="showScheduleDetail(i)">' +
  '      <p item-start>' +
  '        {{itm.scheduleStartTime}}' +
  '      </p>' +
  '      <ion-icon  [ngStyle]="{\'color\':itm.labelColor}" style="font-size: smaller">{{itm.scheduleType}}</ion-icon>' +
  '      <span>' +
  '     {{itm.scheduleName}}' +
  '    </span>' +
  '    </li>' +
  '  </ul>' +
  '</ion-scroll>' +
  '<div [hidden]="noShow" class="backdrop-div" (click)="backdropclick($event)" >' +
  '  <ion-backdrop disable-activated class="itemClass" role="presentation" tappable' +
  '                style="opacity: 0.3; transition-delay: initial; transition-property: none;"></ion-backdrop>' +
  '  <!--<div style="width: 600px;height: 900px" (swipe)="swipeEvent($event)">-->' +
  '  <div class="pop-css" padding style="position: absolute"' +
  '       *ngFor="let event of dayEvents"  (swipe)="swipeEvent($event)">' +
  '      <ion-item style="border-top-left-radius: 20px;border-top-right-radius: 20px;">' +
  '        <div>' +
  '          <button (click)="editEvent(event)" ion-item class="buttonWan">编辑</button>' +
  '        </div>' +
  '      </ion-item>' +
  '      <ion-item style="border-top-left-radius: 20px;border-top-right-radius: 20px;">' +
  '        <img src="./assets/imgs/h.png" style="width: 20px" item-start>' +
  '        <ion-label col-3>任务</ion-label>' +
  '        <ion-label>{{event.scheduleName}}</ion-label>' +
  '      </ion-item>' +
  '      <ion-item>' +
  '        <img src="./assets/imgs/g.png" style="width: 20px" item-start>' +
  '        <ion-label col-3 item-left style="margin-right: 0px !important;">参与人</ion-label>' +
  '        <div item-left margin-left>' +
  '          <div>' +
  '            <ion-thumbnail style="min-width: 40px !important;min-height: 40px !important;">' +
  '              <img src="http://pics.sc.chinaz.com/files/pic/pic9/201811/bpic9202.jpg"' +
  '                   style="border-radius: 50%;width: 40px;height: 40px">' +
  '            </ion-thumbnail>' +
  '            <div style="clear: both; font-size:10px;width:40px;overflow: hidden;text-overflow: ellipsis;" text-center>' +
  '              张三' +
  '            </div>' +
  '          </div>' +
  '        </div>' +
  '        <div item-left>' +
  '          <div>' +
  '            <ion-thumbnail style="min-width: 40px !important;min-height: 40px !important;">' +
  '              <img src="http://pics.sc.chinaz.com/files/pic/pic9/201811/bpic9202.jpg"' +
  '                   style="border-radius: 50%;width: 40px;height: 40px">' +
  '            </ion-thumbnail>' +
  '            <div style="clear: both; font-size:10px;width:40px;overflow: hidden;text-overflow: ellipsis;" text-center>' +
  '              李四' +
  '            </div>' +
  '          </div>' +
  '        </div>' +
  '      </ion-item>' +
  '      <ion-item>' +
  '        <img src="./assets/imgs/b.png" style="width: 20px" item-start>' +
  '        <ion-label col-3>备注</ion-label>' +
  '        <ion-label>哈哈哈</ion-label>' +
  '      </ion-item>' +
  '    </div>' +
  '</div>',
})
export class Ha01Page {

  dayEvents: Array<ScheduleModel>;

  noShow: boolean = true;
  showNow: ScheduleModel;
  active: number = 0;//当前页面

  dateStr:string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private util: UtilService,
              private rnd: Renderer2,
              private workService: WorkService,
              private el: ElementRef,
              private events: Events) {
    console.log('ionViewDidLoad Ha01Page');
    this.height = window.document.body.clientHeight - 350 - 110;
    this.events.subscribe("noshow",()=>{
      this.noShow = true;
    })
  }

  /**
   * Height of the tabs
   */
  @Input()
  set height(val: number) {
    this.rnd.setStyle(this.el.nativeElement, 'height', val + 'px');
  }

  //展示数据详情
  showScheduleDetail(index) {
    console.log("schedule :: " + JSON.stringify(index));
    let domList = this.el.nativeElement.querySelectorAll(".pop-css");
    this.active = index;

    console.log(domList.length);

    for (let i = 0; i < domList.length; i++) {
      if (this.active == i) {
        domList.item(i).className = "pop-css activeCss";
      }
      if (i == this.active - 1) {
        domList.item(i).className = "pop-css activeCssLeft";
      }
      if (i == this.active + 1) {
        domList.item(i).className = "pop-css activeCssRight";
      }
      if (i < this.active - 1) {
        domList.item(i).className = "pop-css activeCssLeft-1";
      }
      if (i > this.active + 1) {
        domList.item(i).className = "pop-css activeCssRight-1";
      }
      console.log("i :: " + i);
    }
    this.noShow = false;

    //
  }

  editEvent(schedule:ScheduleModel){
    this.navCtrl.push("SaPage", schedule);
  }

  //查询当天日程
  showEvents($event) {
    console.log($event);
    let eventDate = new Date($event.time);
    let year = eventDate.getFullYear();
    let month = eventDate.getMonth() + 1;
    let day = eventDate.getDate();

    this.dayEvents = [];
    let dateStr = moment().set({
      'year': year,
      'month': month - 1,
      'date': day
    }).format('YYYY-MM-DD');
    this.dateStr = dateStr;
    this.workService.getOd(dateStr).then(data => {
      if (data.code == 0) {
        for (let i = 0; i < data.slc.length; i++) {
          this.dayEvents.push(data.slc[i]);
        }
      }
    })




  }

  ionViewWillEnter(){
    this.noShow = true;
    if(this.dateStr != undefined){
      this.workService.getOd(this.dateStr).then(data => {
        if (data.code == 0) {
          for (let i = 0; i < data.slc.length; i++) {
            this.dayEvents.push(data.slc[i]);
          }
        }
      })
    }
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


  swipeEvent(event) {
    console.log(event);
    console.log("当前页面 :: " + this.active);
    let domList = this.el.nativeElement.querySelectorAll(".pop-css");


    if (event.direction == 2) {
      let index = this.active;

      //   3 4 5 6
      // 2 3 4 5
      console.log("向左滑 :: ");
      if (index == this.dayEvents.length - 1) {
        console.log("划不动了 :: ");
        return;
      }

      //左一左移
      if (index - 1 >= 0) {
        let dom2 = domList.item(index - 1);
        dom2.className = "pop-css activeCssLeft-1";
      }
      //当前页面左移
      let dom: HTMLElement = domList.item(index);
      console.log(dom)
      // dom.style.transform = "translate(-105%,10%)"
      dom.className = "pop-css activeCssLeft ";
      //右一左移
      if (index + 1 < this.dayEvents.length) {
        let dom2 = domList.item(index + 1);
        dom2.className = "pop-css activeCss";
      }
      //右二左移
      if (index + 2 < this.dayEvents.length) {
        let dom2 = domList.item(index + 2);
        dom2.className = "pop-css activeCssRight";
      }

      this.active++;
    }
    if (event.direction == 4) {
      console.log("向右滑 :: ");
      let index = this.active;
      if (this.active == 0) {
        console.log("划不动了 :: ")
        return;
      }
      let dom = domList.item(index);
      dom.className = "pop-css activeCssRight ";
      //右一右移
      if (index + 1 < domList.length) {
        let dom2 = domList.item(index + 1);
        dom2.className = "pop-css activeCssRight-1";
      }
      //左一右移
      if (index - 1 >= 0) {
        let dom2 = domList.item(index - 1);
        dom2.className = "pop-css activeCss";
      }
      //左二右移
      if (index - 2 >= 0) {
        let dom2 = domList.item(index - 2);
        dom2.className = "pop-css activeCssLeft";
      }
      this.active--;
    }
  }

  backdropclick = function (e) {
    //判断点击的是否为遮罩层，是的话隐藏遮罩层
    if (e.srcElement.className == 'itemClass') {
      this.noShow = true;
    }
    //隐藏滚动条
    //阻止冒泡
    // e.stopPropagation();
  }

}
