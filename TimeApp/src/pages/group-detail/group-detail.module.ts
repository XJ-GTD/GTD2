import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupDetailPage } from './group-detail';

@NgModule({
  declarations: [
    GroupDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupDetailPage),
  ],
})
export class GroupDetailPageModule {}
