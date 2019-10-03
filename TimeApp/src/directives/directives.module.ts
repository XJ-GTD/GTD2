import { NgModule } from '@angular/core';
import { AutosizeDirective } from './ng-autosize/autosize.directive';
import {ScrollheightDirective} from "./scrollheight.directive";
@NgModule({
        declarations: [AutosizeDirective,ScrollheightDirective],
        imports: [],
        exports: [AutosizeDirective,ScrollheightDirective]
})
export class DirectivesModule {}
