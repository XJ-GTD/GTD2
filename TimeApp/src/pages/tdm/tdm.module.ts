import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { TdmPage } from './tdm';
import { TdmePage } from './tdme';
import {IonicModule} from "ionic-angular";
import {PipesModule} from "../../pipes/pipes.module";
import {ScrollSelectComponentModule} from "../../components/scroll-select/scroll-select.module";
import {RadioSelectComponentModule} from "../../components/radio-select/radio-select.module";
import {ScrollRangePickerComponentModule} from "../../components/scroll-range-picker/scroll-range-picker.module";
import {SpeechBubbleComponentModule} from "../../components/speech-bubble/speech-bubble.module";
import { DirectivesModule } from "../../directives/directives.module";
import { BaiduMapModule } from 'angular2-baidu-map';

@NgModule({
  declarations: [
    TdmPage,
    TdmePage
  ],
  imports: [
      IonicModule,
      PipesModule,
      DirectivesModule,
      ScrollSelectComponentModule,
      RadioSelectComponentModule,
      ScrollRangePickerComponentModule,
      SpeechBubbleComponentModule,
      BaiduMapModule
  ],
  providers: [
  ],
  entryComponents:[
    TdmPage,
    TdmePage
  ],
  exports:[
    TdmPage,
    TdmePage
  ]
})
export class TdmPageModule {}
