import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PfPage} from './pf';
import {LsService} from "../ls/ls.service";
import {PsService} from "../ps/ps.service";

@NgModule({
  declarations: [
    PfPage,
  ],
  imports: [
    IonicPageModule.forChild(PfPage),
  ],
  providers:[
    LsService,
    PsService,
  ]
})
export class PfPageModule {}
