import { NgModule } from '@angular/core';
import { AttachPage } from './attach';
import { IonicModule } from "ionic-angular";
import { DirectivesModule } from "../../directives/directives.module";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";
import {File} from '@ionic-native/file';
import {FileTransfer, FileUploadOptions, FileTransferObject  } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Chooser } from '@ionic-native/chooser';
import { FilePath } from '@ionic-native/file-path';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    AttachPage
  ],
  imports: [
    PipesModule,
    IonicModule,
    ModalBoxComponentModule,
    DirectivesModule,
  ],
  providers: [
    FileTransfer,
    File,
    Camera,
    Chooser,
    FilePath
  ],
  entryComponents:[
    AttachPage
  ],
  exports:[
    AttachPage
  ]
})
export class AttachPageModule {}
