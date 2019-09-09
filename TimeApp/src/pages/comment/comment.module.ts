import { NgModule } from '@angular/core';
import { CommentPage } from './comment';
import { IonicModule } from "ionic-angular";
import { DirectivesModule } from "../../directives/directives.module";

@NgModule({
  declarations: [
    CommentPage
  ],
  imports: [
    IonicModule,
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
