import {ModuleWithProviders, NgModule} from '@angular/core';
import {IonicModule, IonicPageModule} from 'ionic-angular';
import { HomeWorkListPage } from './home-work-list';

@NgModule({
  declarations: [
    HomeWorkListPage,
  ],
  imports: [
    IonicModule,
    // IonicPageModule.forChild(HomeWorkListPage),
  ],

  exports: [HomeWorkListPage]
})
export class HomeWorkListPageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: HomeWorkListPageModule
    };
  }
}
