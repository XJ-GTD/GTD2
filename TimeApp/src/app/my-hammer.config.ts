import { HammerGestureConfig } from '@angular/platform-browser';
import {Injectable} from "@angular/core";
import  * as Hammer from 'hammerjs'
@Injectable()
export class HammerDIRECTIONALLConfig extends HammerGestureConfig {
  overrides = <any>{
    'swipe': { direction:Hammer.DIRECTION_ALL } // 重载设置
  }
}
