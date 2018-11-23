import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupSelectPage } from './group-select';

@NgModule({
  declarations: [
    GroupSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupSelectPage),
  ],
})
export class GroupSelectPageModule {}
