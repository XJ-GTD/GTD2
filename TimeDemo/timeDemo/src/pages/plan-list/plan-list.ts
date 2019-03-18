import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NewPlanPage } from '../new-plan/new-plan';

/**
 * Generated class for the PlanListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-plan-list',
  templateUrl: 'plan-list.html',
})
export class PlanListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlanListPage');
  }

  newPlan() {
    this.navCtrl.push(NewPlanPage, { });
  }
}
