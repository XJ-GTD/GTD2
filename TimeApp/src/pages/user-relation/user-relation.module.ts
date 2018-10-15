import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserRelationPage } from './user-relation';

@NgModule({
  declarations: [
    UserRelationPage,
  ],
  imports: [
    IonicPageModule.forChild(UserRelationPage),
  ],
})
export class UserRelationPageModule {}
