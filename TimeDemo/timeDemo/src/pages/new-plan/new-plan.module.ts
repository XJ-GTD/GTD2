import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewPlanPage } from './new-plan';

@NgModule({
  declarations: [
    NewPlanPage,
  ],
  imports: [
    IonicPageModule.forChild(NewPlanPage),
  ],
})
export class NewPlanPageModule {}
