import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {GloryPage} from './glory';
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
  declarations: [
    GloryPage,
  ],
  imports: [
    IonicPageModule.forChild(GloryPage)
  ],
  providers:[
  ],
})
export class GloryPageModule {}
