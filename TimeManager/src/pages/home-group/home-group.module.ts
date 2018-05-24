import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeGroupPage } from './home-group';

@NgModule({
  declarations: [
    HomeGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeGroupPage),
  ],
})
export class HomeGroupPageModule {}
