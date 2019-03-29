import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TddiPage } from './tddi';
import {TddiService} from "./tddi.service";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    TddiPage,
  ],
  imports: [
    IonicPageModule.forChild(TddiPage),
    PipesModule
  ],
  entryComponents: [
    TddiPage,
  ],
  providers: [
    TddiService,
  ],
})
export class TddiPageModule {}
