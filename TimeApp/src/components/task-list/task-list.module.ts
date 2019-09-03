import {ModuleWithProviders, NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskListComponent } from './task-list';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    TaskListComponent,
  ],
  entryComponents: [
    TaskListComponent,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(TaskListComponent)
  ],
  providers: [],
  exports: [
    TaskListComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TaskListComponentModule {
}
