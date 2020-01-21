import {ModuleWithProviders, NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AiComponent } from './ai';
import {AiService} from "./ai.service";
import {PointComponentModule} from "../point/point.module";
import {PipesModule} from "../../../pipes/pipes.module";
import {AiChildenComponent} from "./ai.childen";
import {FsService} from "../../../pages/fs/fs.service";

@NgModule({
  declarations: [
    AiComponent,
    AiChildenComponent,
  ],
  imports: [
    IonicPageModule.forChild(AiComponent),
    IonicPageModule.forChild(AiChildenComponent),
    PointComponentModule,
    PipesModule,
  ],
  providers: [
    AiService,
    FsService
  ],
  exports: [
    AiComponent,
    AiChildenComponent,
  ],
})
export class AiComponentModule {
}
