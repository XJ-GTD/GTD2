import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TddiPage } from './tddi';
import {TddiService} from "./tddi.service";

@NgModule({
  declarations: [
    TddiPage,
  ],
  imports: [
    IonicPageModule.forChild(TddiPage),
  ],
  entryComponents: [
    TddiPage,
  ],
  providers: [
    TddiService,
  ],
})
export class TddiPageModule {}
