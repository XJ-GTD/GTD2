import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsPage } from './fs';
import {FsService} from "./fs.service";

@NgModule({
  declarations: [
    FsPage,
  ],
  imports: [
    IonicPageModule.forChild(FsPage),
  ],
  providers: [
    FsService,,
  ],
})
export class FsPageModule {}
