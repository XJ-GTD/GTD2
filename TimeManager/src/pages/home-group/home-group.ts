import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from "@angular/common/http";
import { Group } from "../../model/group.model";
import { AppConfig } from "../../app/app.config";

/**
 * Generated class for the HomeGroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-group',
  templateUrl: 'home-group.html',
})
export class HomeGroupPage {

  data: any;
  groupList: Array<Group>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpClient,
              public params: NavParams) {
    this.data = this.http.get(AppConfig.GROUP_FIND_URL + this.params.get('userId'))
      .subscribe(data => {
        console.log(data);
        this.data = data;
        this.groupList = this.data;
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeGroupPage');
  }

  groupDetailShow() {

  }
}
