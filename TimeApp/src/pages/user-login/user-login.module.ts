import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserLoginPage } from './user-login';

@NgModule({
  declarations: [
    UserLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(UserLoginPage),
  ],
})
export class UserLoginPageModule {}
