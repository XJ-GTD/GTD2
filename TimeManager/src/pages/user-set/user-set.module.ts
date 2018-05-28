import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserSetPage } from './user-set';

@NgModule({
  declarations: [
    UserSetPage,
  ],
  imports: [
    IonicPageModule.forChild(UserSetPage),
  ],
})
export class UserSetPageModule {}
