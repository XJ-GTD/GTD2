import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoPage } from './fo';
import {FoGitHubPage} from "./fogithub";
import {FoFirIMPage} from "./fofirim";
import {FoTravisCIPage} from "./fotravisci";
import {FoService} from "./fo.service";
import {PipesModule} from "../../pipes/pipes.module";
import { ScrollSelectComponentModule } from "../../components/scroll-select/scroll-select.module";

@NgModule({
  declarations: [
    FoPage,
    FoGitHubPage,
    FoFirIMPage,
    FoTravisCIPage
  ],
  imports: [
    PipesModule,
    ScrollSelectComponentModule,
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
