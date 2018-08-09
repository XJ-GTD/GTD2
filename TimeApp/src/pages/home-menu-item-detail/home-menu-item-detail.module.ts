import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeMenuItemDetailPage } from './home-menu-item-detail';

@NgModule({
  declarations: [
    HomeMenuItemDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeMenuItemDetailPage),
  ],
})
export class HomeMenuItemDetailPageModule {}
