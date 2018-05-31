import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeGroupDetailPage } from './home-group-detail';

@NgModule({
  declarations: [
    HomeGroupDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeGroupDetailPage),
  ],
})
export class HomeGroupDetailPageModule {}
