import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GaPage } from './ga';
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";

@NgModule({
  declarations: [
    GaPage,
  ],
  imports: [
    IonicPageModule.forChild(GaPage),

    ModalBoxComponentModule
  ],
  providers:[
  ],
})
export class GaPageModule {}
