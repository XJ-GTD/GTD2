import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CharPage } from './char';

@NgModule({
  declarations: [
    CharPage,
  ],
  imports: [
    IonicPageModule.forChild(CharPage),
  ],
})
export class CharPageModule {}
