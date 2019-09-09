import { NgModule } from '@angular/core';
import { CommentPage } from './comment';
import { IonicModule } from "ionic-angular";
import { DirectivesModule } from "../../directives/directives.module";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";

@NgModule({
  declarations: [
    CommentPage
  ],
  imports: [
    IonicModule,
    ModalBoxComponentModule,
    DirectivesModule
  ],
  providers: [
  ],
  entryComponents:[
    CommentPage
  ],
  exports:[
    CommentPage
  ]
})
export class CommentPageModule {}
