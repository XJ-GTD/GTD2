import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SbPage } from './sb';
import { ElModule } from 'element-angular'

@NgModule({
  declarations: [
    SbPage,
  ],
  imports: [
    IonicPageModule.forChild(SbPage),
    ElModule
  ],
})
export class SbPageModule {}
