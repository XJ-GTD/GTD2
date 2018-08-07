import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserMessagePage } from './user-message';

@NgModule({
  declarations: [
    UserMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(UserMessagePage),
  ],
})
export class UserMessagePageModule {}
