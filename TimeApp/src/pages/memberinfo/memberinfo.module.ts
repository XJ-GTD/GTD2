import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {MemberInfoPage} from './memberinfo';
import {MemberInfoService} from "./memberinfo.service";

@NgModule({
  declarations: [
    MemberInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberInfoPage),
  ],
  providers: [
    MemberInfoService,
  ],
})
export class MemberInfoPageModule {}
