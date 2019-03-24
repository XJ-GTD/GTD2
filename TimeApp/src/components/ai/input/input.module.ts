import {NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {InputComponent} from "./input";
import {InputService} from "./input.service";

@NgModule({
  declarations: [
    InputComponent,
  ],
  imports: [
    IonicPageModule.forChild(InputComponent)
  ],
  exports: [
    InputComponent,
  ],
  providers:[
    InputService,
  ],
})
export class InputComponentModule {
}
