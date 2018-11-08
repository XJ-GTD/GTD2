import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeWorkListPage } from './home-work-list';

@NgModule({
  declarations: [
    HomeWorkListPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeWorkListPage),
  ],
})
export class HomeWorkListPageModule {}
