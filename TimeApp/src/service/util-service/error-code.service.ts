import { Injectable } from "@angular/core";
import { DwEmitService } from "./dw-emit.service";

/**
 * 错误码统一处理
 */
@Injectable()
export class ErrorCodeService {

  constructor(private dwEmit: DwEmitService){

  }
  public errorHanding(code) {
    if (code == 50201) {//语音无对应技能
      this.speechFail();
    }
  }

  private speechFail() {
    this.dwEmit.setHbData(1);
  }
}
