import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SaPage } from './sa';

@NgModule({
  declarations: [
    SaPage,
  ],
  imports: [
    IonicPageModule.forChild(SaPage),
  ],
})
export class SaPageModule {}
