import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonalAddPage } from './personal-add';

@NgModule({
  declarations: [
    PersonalAddPage,
  ],
  imports: [
    IonicPageModule.forChild(PersonalAddPage),
  ],
})
export class PersonalAddPageModule {}
