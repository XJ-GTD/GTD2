import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RelationListPage } from './relation-list';

@NgModule({
  declarations: [
    RelationListPage,
  ],
  imports: [
    IonicPageModule.forChild(RelationListPage),
  ],
})
export class RelationListPageModule {}
