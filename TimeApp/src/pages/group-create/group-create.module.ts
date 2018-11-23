import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupCreatePage } from './group-create';

@NgModule({
  declarations: [
    GroupCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(GroupCreatePage),
  ],
})
export class GroupCreatePageModule {}
