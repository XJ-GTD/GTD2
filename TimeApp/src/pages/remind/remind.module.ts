import { NgModule } from '@angular/core';
import { RemindPage } from './remind';
import { IonicModule } from "ionic-angular";
import { ScrollSelectComponentModule } from "../../components/scroll-select/scroll-select.module";

@NgModule({
  declarations: [
    RemindPage
  ],
  imports: [
      IonicModule,
      ScrollSelectComponentModule
  ],
  providers: [
  ],
  entryComponents:[
    RemindPage
  ],
  exports:[
    RemindPage
  ]
})
export class RemindPageModule {}
