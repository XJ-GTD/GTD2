import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

/**
 * Generated class for the AlPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-al',
  templateUrl: 'al.html',
})
export class AlPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlPage');
    this.loading();
  }

  loading(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    setTimeout(()=>{
      loading.dismiss();
    },3000);

    loading.present();


  }

}
