import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {BlService} from "../bl/bl.service";
import {FdService} from "../fd/fd.service";
import {BlPage} from "./bl";
import {PageBoxComponentModule} from "../../components/page-box/page-box.module";

@NgModule({
  declarations: [
    BlPage,
  ],
  imports: [
    IonicPageModule.forChild(BlPage),
    PageBoxComponentModule
  ],
  providers: [
    BlService,
    FdService,
  ],
})
export class BlPageModule {}
