import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgendaListPage } from './agenda-list';

@NgModule({
  declarations: [
    AgendaListPage,
  ],
  imports: [
    IonicPageModule.forChild(AgendaListPage),
  ],
})
export class AgendaListPageModule {}
