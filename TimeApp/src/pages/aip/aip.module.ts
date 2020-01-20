import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {AipPage} from './aip';
import {AipService} from "./aip.service";
import {AiComponentModule} from "../../components/ai/answer/ai.module";
import {BackComponentModule} from "../../components/backComponent/back.module";
import {PointComponentModule} from "../../components/ai/point/point.module";
import {InputComponentModule} from "../../components/ai/input/input.module";
import {HelpComponentModule} from "../../components/help/help.module";

@NgModule({
  declarations: [
    AipPage,
  ],
  imports: [
    IonicPageModule.forChild(AipPage),
    AiComponentModule,
    BackComponentModule,
    PointComponentModule,
    InputComponentModule,
    HelpComponentModule
  ],
  providers: [
    AipService,
  ]


})
export class AipPageModule {
}
