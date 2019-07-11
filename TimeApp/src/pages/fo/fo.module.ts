import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoPage } from './fo';
import {FoGitHubPage} from "./fogithub";
import {FoFirIMPage} from "./fofirim";
import {FoTravisCIPage} from "./fotravisci";
import {FoService} from "./fo.service";

@NgModule({
  declarations: [
    FoPage,
    FoGitHubPage,
    FoFirIMPage,
    FoTravisCIPage
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
    FoFirIMPage,
    FoTravisCIPage
  ],
  exports:[
    FoPage,
    FoGitHubPage,
    FoFirIMPage,
    FoTravisCIPage
  ]
})
export class FoPageModule {}
