import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeMenuListPage } from './home-menu-list';

@NgModule({
  declarations: [
    HomeMenuListPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeMenuListPage),
  ],
})
export class HomeMenuListPageModule {}
