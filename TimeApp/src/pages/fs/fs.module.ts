import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsPage } from './fs';

@NgModule({
  declarations: [
    FsPage,
  ],
  imports: [
    IonicPageModule.forChild(FsPage),
  ],
})
export class FsPageModule {}
