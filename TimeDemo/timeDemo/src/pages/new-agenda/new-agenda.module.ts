import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewAgendaPage } from './new-agenda';

@NgModule({
  declarations: [
    NewAgendaPage,
  ],
  imports: [
    IonicPageModule.forChild(NewAgendaPage),
  ],
})
export class NewAgendaPageModule {}
