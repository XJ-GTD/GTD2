import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Scroll } from 'ionic-angular';

/**
 * Generated class for the NewAgendaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-agenda',
  templateUrl: 'new-agenda.html',
})
export class NewAgendaPage {

  repeats: any = [{value: 0, caption: '关闭'}, {value: 1, caption: '每天'}, {value: 2, caption: '每周'}, {value: 3, caption: '每月'}, {value: 4, caption: '每年'}];
  labels: any = [{value:0,caption:'工作'}, {value:1,caption:'个人'}];
  months: any = [{value:'01',caption:'一月'}, {value:'02',caption:'二月'}, {value:'03',caption:'三月'}, {value:'04',caption:'四月'}, {value:'05',caption:'五月'}, {value:'06',caption:'六月'}, {value:'07',caption:'七月'}, {value:'08',caption:'八月'}, {value:'09',caption:'九月'}, {value:'10',caption:'十月'}, {value:'11',caption:'十一月'}, {value:'12',caption:'十二月'}];
  years: any = [];
  rangeEnd: string = '4:30下午';
  motions: any = [
    {value:'Anxious',caption:`<img class="image-option" src="../assets/imgs/Anxious.png">`},
    {value:'Birthday',caption:`<img class="image-option" src="../assets/imgs/Birthday.png">`},
    {value:'Celebration',caption:`<img class="image-option" src="../assets/imgs/Celebration.png">`},
    {value:'Competition',caption:`<img class="image-option" src="../assets/imgs/Competition.png">`},
    {value:'Excited',caption:`<img class="image-option" src="../assets/imgs/Excited.png">`},
    {value:'Party',caption:`<img class="image-option" src="../assets/imgs/Party.png">`},
    {value:'Romance',caption:`<img class="image-option" src="../assets/imgs/Romance.png">`},
    {value:'Sport',caption:`<img class="image-option" src="../assets/imgs/Sport.png">`},
    {value:'Study',caption:`<img class="image-option" src="../assets/imgs/Study.png">`},
    {value:'Travel',caption:`<img class="image-option" src="../assets/imgs/Travel.png">`}
  ];
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    for (let year = 2009; year <= 2029; year++) {
      this.years.push({value:year.toString(),caption:year.toString()});
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewAgendaPage');
  }
  
  timechanged(changed) {
    if (changed !== undefined) {
      let src = changed.src;
      let dest = changed.dest;
      this.rangeEnd = dest;
    }
  }
  
}
