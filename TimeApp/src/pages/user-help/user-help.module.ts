import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserHelpPage } from './user-help';

@NgModule({
  declarations: [
    UserHelpPage,
  ],
  imports: [
    IonicPageModule.forChild(UserHelpPage),
  ],
})
export class UserHelpPageModule {}
