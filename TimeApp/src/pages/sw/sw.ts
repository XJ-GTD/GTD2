import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SwPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sw',
  templateUrl: 'sw.html',
})
export class SwPage {

  indexs:any = [];
  focusItem:any;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SwPage');
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



}
