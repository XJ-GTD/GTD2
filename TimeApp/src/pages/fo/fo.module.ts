import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoPage } from './fo';
import {FoGitHubPage} from "./fogithub";
import {FoFirIMPage} from "./fofirim";
import {FoTravisCIPage} from "./fotravisci";
import {FoService} from "./fo.service";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    FoPage,
    FoGitHubPage,
    FoFirIMPage,
    FoTravisCIPage
  ],
  imports: [
    PipesModule,
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
