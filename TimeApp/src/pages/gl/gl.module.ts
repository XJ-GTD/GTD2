import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GlPage } from './gl';

@NgModule({
  declarations: [
    GlPage,
  ],
  imports: [
    IonicPageModule.forChild(GlPage),
  ],
})
export class GlPageModule {}
