import { NgModule } from '@angular/core';
import { PlanPage } from './plan';
import { IonicModule } from "ionic-angular";

@NgModule({
  declarations: [
    PlanPage
  ],
  imports: [
      IonicModule
  ],
  providers: [
  ],
  entryComponents:[
    PlanPage
  ],
  exports:[
    PlanPage
  ]
})
export class PlanPageModule {}
