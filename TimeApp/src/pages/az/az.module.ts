import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AzPage } from './az';
import {AzService} from "./az.service";

@NgModule({
  declarations: [
    AzPage,
  ],
  imports: [
    IonicPageModule.forChild(AzPage),
  ],
  providers: [
    AzService,
  ],
})
export class AzPageModule {}
