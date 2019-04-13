import {Component, OnInit} from '@angular/core';
import {IonicPage, PopoverController, NavParams, ViewController} from 'ionic-angular';
import {CTbl} from "../../service/sqlite/tbl/c.tbl";

/**
 * Generated class for the BackComponent page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'ConfirmboxComponent',
  template: `
      <div class="msg-lbl">{{msg}}</div>
  `,
})
export class ConfirmboxComponent {

  constructor(private navParams: NavParams) {

  }

  msg: string;

  ngOnInit() {
    if (this.navParams.data) {
      this.msg = this.navParams.data.msg;
    }
  }
}
