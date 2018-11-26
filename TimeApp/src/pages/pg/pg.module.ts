import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PgPage } from './pg';

@NgModule({
  declarations: [
    PgPage,
  ],
  imports: [
    IonicPageModule.forChild(PgPage),
  ],
})
export class PgPageModule {}
