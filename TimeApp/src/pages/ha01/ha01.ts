import {Component, ElementRef, Input, Renderer2} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ScheduleModel} from "../../model/schedule.model";
import {UtilService} from "../../service/util-service/util.service";
import {WorkService} from "../../service/work.service";
import * as moment from "moment";
import {ScheduleDetailsModel} from "../../model/scheduleDetails.model";

/**
 * Generated class for the Ha01Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-ha01',
  template: `
    <ion-scroll scrollY="true">
      <ul>
        <li ion-item *ngFor="let itm of scheduleLs ;let i = index" (click)="showScheduleDetail(i)"
            [class.new-message]="itm.isMessage">
          <p item-start>
            {{itm.scheduleStartTime}}
          </p>

          <div class="self" *ngIf="itm.scheduleType=='1'" [ngStyle]="{'background-color':itm.labelColor}"></div>
          <div class="anther" *ngIf="itm.scheduleType=='2'" [ngStyle]="{'border-bottom-color':itm.labelColor}"></div>
          <!--<ion-icon name="arrow-dropright-circle"></ion-icon>-->
          <span>
       {{itm.scheduleName}}
      </span>
          <small *ngIf="itm.isMessage">\u2022</small>
        </li>
      </ul>
    </ion-scroll>
    <div [hidden]="noShow" class="backdrop-div" >
      <ion-backdrop disable-activated class="backdrop"> <ion-icon ios="ios-close" md="md-close" class="close" (click)="backdropclick($event)"></ion-icon></ion-backdrop>
      <div class="pop-css" 
           *ngFor="let schedule of scheduleDetailLs" 
           (swipe)="swipe($event)" 
           [ngStyle]="{'background-color':schedule.labelColor}" >
        <ion-card>          
          <ion-card-header [ngStyle]="{'border-bottom-color':schedule.labelColor}">

           <ul>
             <li>
               <ion-icon name="pricetag" item-start ></ion-icon>
               <span>{{schedule.labelName}}</span>
               
             </li>
             <li>
               <ion-icon name="notifications" item-start ></ion-icon>
               <span>{{schedule.remindTime}}</span>

             </li>
           </ul>

            <button (click)="editSchedule(schedule)" class="buttonWan" item-right>编辑</button>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item class="content">
                <ion-icon name="calendar" item-start [ngStyle]="{'color':schedule.labelColor}"></ion-icon>
                <h2>{{schedule.scheduleName}}</h2>
              </ion-item>
              <ion-item class="content">
                <ion-icon name="paper" item-start [ngStyle]="{'color':schedule.labelColor}"></ion-icon>
                <h2>{{schedule.comment}}</h2 >
              </ion-item>
              <ion-item *ngIf="schedule.group.length > 0" class="group">
                <ion-icon name="contacts" item-start [ngStyle]="{'color':schedule.labelColor}"></ion-icon>
                <div item-left margin-left *ngFor="let rc of schedule.group" >
                  <div style="display: flow-root">
                    <ion-thumbnail>
                      <img [src]="rc.hiu">
                    </ion-thumbnail>
                    <span>
                      {{rc.ran}}
                    </span>
                  </div>
                </div>               
              </ion-item>
              


            </ion-list>
          </ion-card-content>

          <div class="card-footer">
            <p>{{schedule.publisherName}}</p>
            <p>
              {{schedule.scheduleStartTime}}</p>
          </div>
          
        </ion-card>
        
      </div>
    </div>`

})
export class Ha01Page {

  scheduleLs: Array<ScheduleModel> = [];
  scheduleDetailLs: Array<ScheduleDetailsModel> = [];

  noShow: boolean = true;

  active: number = 0;//当前页面

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private util: UtilService,
              private rnd: Renderer2,
              private workService: WorkService,
              private el: ElementRef) {
    this.height = window.document.body.clientHeight - 350 - 110;

    this.init();

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
    this.scheduleDetailLs = [];
    this.active = index;
    new Promise((resolve, reject) =>{

      let tmpls:Array<ScheduleDetailsModel> = [];
      let ii = this.scheduleLs.length;
      for (let schedule of this.scheduleLs) {
        this.workService.getScheduleDetails(schedule.scheduleId).then(data => {
          tmpls.push(data);
          ii --;
          if (ii ==0){
            this.scheduleDetailLs = tmpls;
            setTimeout(()=>{
              resolve();
            },100);
          }
        });
      }
    }).then((data) => {
      let domList = this.el.nativeElement.querySelectorAll(".pop-css");
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
      }
      this.noShow = false;
    });
  }

  //查询日程
  showScheduleLs($event) {
    let eventDate = new Date($event.time);
    let year = eventDate.getFullYear();
    let month = eventDate.getMonth() + 1;
    let day = eventDate.getDate();

    this.scheduleLs = [];
    let dateStr = moment().set({
      'year': year,
      'month': month - 1,
      'date': day
    }).format('YYYY-MM-DD');
    this.workService.getOd(dateStr).then(data => {
      if (data.code == 0) {
        for (let i = 0; i < data.slc.length; i++) {
          this.scheduleLs.push(data.slc[i]);
        }
      }
    })

  }

  init() {
    this.scheduleLs= [];
    this.scheduleDetailLs = [];

    this.noShow= true;

    this.active = 0;

    this.showScheduleLs({time:moment().valueOf()});
  }


  swipe(event) {
    let domList = this.el.nativeElement.querySelectorAll(".pop-css");


    if (event.direction == 2) {
      let index = this.active;

      if (index == this.scheduleDetailLs.length - 1) {
        return;
      }

      //左一左移
      if (index - 1 >= 0) {
        let dom2 = domList.item(index - 1);
        dom2.className = "pop-css activeCssLeft-1";
      }
      //当前页面左移
      let dom: HTMLElement = domList.item(index);
      // dom.style.transform = "translate(-105%,10%)"
      dom.className = "pop-css activeCssLeft ";
      //右一左移
      if (index + 1 < this.scheduleDetailLs.length) {
        let dom2 = domList.item(index + 1);
        dom2.className = "pop-css activeCss";
      }
      //右二左移
      if (index + 2 < this.scheduleDetailLs.length) {
        let dom2 = domList.item(index + 2);
        dom2.className = "pop-css activeCssRight";
      }

      this.active++;
    }
    if (event.direction == 4) {
      let index = this.active;
      if (this.active == 0) {
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

  backdropclick(e) {
    //判断点击的是否为遮罩层，是的话隐藏遮罩层
    this.noShow = true;
  }

  editSchedule(schedule: ScheduleModel) {
    setTimeout(() => {
      this.noShow = true;
    }, 100);
    this.navCtrl.push("SaPage", schedule);
  }


}
