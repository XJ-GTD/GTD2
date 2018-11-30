import {EventEmitter, Injectable} from "@angular/core";
import {Ha01Page} from "../../pages/ha01/ha01";

/**
 * 数据传递广播处理类
 */
@Injectable()
export class DwEmitService {

  private _speechData: EventEmitter<any> = new EventEmitter();

  public getSpeechData(page) {
    this._speechData.subscribe($event => {

    })
  }

  public setSpeechData($event) {
    this._speechData.emit($event);
  }

}
