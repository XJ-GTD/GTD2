import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoPage } from './fo';
import {FoGitHubPage} from "./fogithub";
import {FoFirIMPage} from "./fofirim";
import {FoTravisCIPage} from "./fotravisci";
import {FoSharePage} from "./foshare";
import {FoConfigurePage} from "./foconfigure";
import {FoService} from "./fo.service";
import {PipesModule} from "../../pipes/pipes.module";
import { ScrollSelectComponentModule } from "../../components/scroll-select/scroll-select.module";

@NgModule({
  declarations: [
    FoPage,
    FoSharePage,
    FoGitHubPage,
    FoFirIMPage,
    FoTravisCIPage,
    FoConfigurePage
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
    FoSharePage,
    FoGitHubPage,
    FoFirIMPage,
    FoTravisCIPage,
    FoConfigurePage
  ],
  exports:[
    FoPage,
    FoSharePage,
    FoGitHubPage,
    FoFirIMPage,
    FoTravisCIPage,
    FoConfigurePage
  ]
})
export class FoPageModule {}
