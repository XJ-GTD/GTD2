import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HbPage } from './hb';
import { ParamsService } from "../../service/util-service/params.service";
import { XiaojiAssistantService } from "../../service/util-service/xiaoji-assistant.service";
import { XiaojiFeedbackService } from "../../service/util-service/xiaoji-feedback.service";
import { Hb01PageModule } from "../hb01/hb01.module";
import {HbService} from "./hb.service";

@NgModule({
  declarations: [
    HbPage,
  ],
  imports: [
    IonicPageModule.forChild(HbPage),
    Hb01PageModule,
  ],
  providers: [
    ParamsService,
    XiaojiAssistantService,
    XiaojiFeedbackService,
    HbService,
  ],
  entryComponents: [
    HbPage,
  ],
})
export class HbPageModule {}
