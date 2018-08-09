import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  slides = [
    {
      title: "Welcome to the GTD2!",
      description: "这 <b>是一个引导页</b> ！",
      image: "../../assets/imgs/welcome.jpg",
    },
    {
      title: "What is Ionic?",
      description: "<b>Ionic Framework</b> 这是第二页.",
      image: "../../assets/imgs/welcome.jpg",
    },
    {
      title: "What is Ionic Cloud?",
      description: "这 <b>是</b> 第三页！",
      image: "../../assets/imgs/welcome.jpg",
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  goToLogin() {
    this.navCtrl.setRoot('UserLoginPage');
  }

}
