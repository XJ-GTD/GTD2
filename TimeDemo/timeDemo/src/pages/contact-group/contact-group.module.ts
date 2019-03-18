import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactGroupPage } from './contact-group';

@NgModule({
  declarations: [
    ContactGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactGroupPage),
  ],
})
export class ContactGroupPageModule {}
