import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {LogPage} from "./log";
import {PageBoxComponentModule} from "../../components/page-box/page-box.module";
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
  declarations: [
    LogPage,
  ],
  imports: [
    IonicPageModule.forChild(LogPage),
    PageBoxComponentModule,
    DirectivesModule
  ],
  providers: [
  ],
})
export class LogPageModule {}
