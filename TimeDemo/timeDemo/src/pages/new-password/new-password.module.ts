import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewPasswordPage } from './new-password';

@NgModule({
  declarations: [
    NewPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(NewPasswordPage),
  ],
})
export class NewPasswordPageModule {}
