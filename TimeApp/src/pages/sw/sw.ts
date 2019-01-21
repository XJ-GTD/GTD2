import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar} from 'ionic-angular';

/**
 * Generated class for the SwPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sw',
  // templateUrl: 'sw.html',
  template:'<ion-header>\n' +
  '\n' +
  '  <ion-navbar>\n' +
  '    <ion-title>相关日程</ion-title>\n' +
  '  </ion-navbar>\n' +
  '\n' +
  '</ion-header>\n' +
  '\n' +
  '\n' +
  '<ion-content padding>\n' +
  '\n' +
  '\n' +
  '\n' +
  '  <div class="t1 " *ngFor="let index of indexs">\n' +
  '    <div class="d4" >\n' +
  '      <div ion-item class="d5">\n' +
  '        <ion-label stacked>2019年01月{{index}}日</ion-label>\n' +
  '        <ion-label>红红火火恍恍惚惚</ion-label>\n' +
  '      </div>\n' +
  '    </div>\n' +
  '  </div>\n' +
  '\n' +
  '</ion-content>\n',
})
export class SwPage {

  @ViewChild(Navbar) navBar: Navbar;

  indexs:any = [];
  focusItem:any;


  constructor(private navCtrl: NavController,
              private navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SwPage');
    this.navBar.backButtonClick = this.backButtonClick;
    this.navBar.setBackButtonText("");
    this.indexs = ['01','02','03','04','05','06','07','08','09','10'];

    setTimeout(function () {
      let domlist = document.getElementsByClassName('t1');
      this.focusItem = domlist[0];
      console.log(this.focusItem)
      this.focusItem.classList.add('highlight');
      for(let i = 0;i<domlist.length;i++){
        domlist[i].addEventListener('click', (e)=> {
          let $listItem = SwPage.closest(e.target, 't1');
          console.log($listItem);
          console.log(this.focusItem)
          if ($listItem && $listItem != this.focusItem) {
            this.focusItem.classList.remove('highlight');
            this.focusItem = $listItem;
            this.focusItem.classList.add('highlight');
          }
        });
      }
    },100);
  }


  change = function($event){
    console.log($event)
    $event.srcElement.classList.add("highlight");
  }

  //迭代
  static closest = function(el, className) {
    if (el.classList.contains(className)) return el;
    if (el.parentNode) {
      return SwPage.closest(el.parentNode, className);
    }
    return null;
  };


  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.navCtrl.pop();
  }


}
