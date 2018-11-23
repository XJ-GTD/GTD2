import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonalAddDetailPage } from './personal-add-detail';

@NgModule({
  declarations: [
    PersonalAddDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PersonalAddDetailPage),
  ],
})
export class PersonalAddDetailPageModule {}
