import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoPage } from './fo';
import {FoGitHubPage} from "./fogithub";
import {FoFirIMPage} from "./fofirim";
import {FoService} from "./fo.service";

@NgModule({
  declarations: [
    FoPage,
    FoGitHubPage,
    FoFirIMPage
  ],
  imports: [
    IonicPageModule.forChild(FoPage),
  ],
  providers: [
    FoService,
  ],
  entryComponents:[
    FoPage,
    FoGitHubPage,
    FoFirIMPage
  ],
  exports:[
    FoPage,
    FoGitHubPage,
    FoFirIMPage
  ]
})
export class FoPageModule {}
