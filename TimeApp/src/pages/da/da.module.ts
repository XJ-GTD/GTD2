import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DaPage } from "./da";

@NgModule({
  declarations: [
    DaPage,
  ],
  imports: [
    IonicPageModule.forChild(DaPage),
  ],
  providers: [
  ],
})
export class DaPageModule {}
