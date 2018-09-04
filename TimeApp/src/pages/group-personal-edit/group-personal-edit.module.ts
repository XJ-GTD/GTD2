import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupPersonalEditPage } from './group-personal-edit';

@NgModule({
  declarations: [
    GroupPersonalEditPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupPersonalEditPage),
  ],
})
export class GroupPersonalEditPageModule {}
