import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserAgreementPage } from './user-agreement';

@NgModule({
  declarations: [
    UserAgreementPage,
  ],
  imports: [
    IonicPageModule.forChild(UserAgreementPage),
  ],
})
export class UserAgreementPageModule {}
