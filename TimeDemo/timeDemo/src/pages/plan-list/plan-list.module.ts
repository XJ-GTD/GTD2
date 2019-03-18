import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlanListPage } from './plan-list';

@NgModule({
  declarations: [
    PlanListPage,
  ],
  imports: [
    IonicPageModule.forChild(PlanListPage),
  ],
})
export class PlanListPageModule {}
