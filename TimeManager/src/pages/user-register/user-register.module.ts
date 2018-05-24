import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserRegisterPage } from './user-register';

@NgModule({
  declarations: [
    UserRegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(UserRegisterPage),
  ],
})
export class UserRegisterPageModule {}
