import {NgModule} from '@angular/core';
import {FsService} from "./fs.service";
import {FdService} from "../fd/fd.service";
import {Fs4gPage} from "./fs4g";
import {Fs4foPage} from "./fs4fo";
import {IonicModule} from "ionic-angular";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";
import {DirectivesModule} from "../../directives/directives.module";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    Fs4gPage,
    Fs4foPage
  ],
  imports: [
    IonicModule,
    ModalBoxComponentModule,
    DirectivesModule,
    PipesModule
  ],
  providers: [
    FsService, FdService
  ],

  entryComponents: [
    Fs4gPage,
    Fs4foPage
  ]
})
export class FsPageModule {
}
