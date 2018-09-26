import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupAddPage } from './group-add';

@NgModule({
  declarations: [
    GroupAddPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupAddPage),
  ],
})
export class GroupAddPageModule {}
