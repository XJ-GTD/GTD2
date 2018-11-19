import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import {DIRECTION_HORIZONTAL} from "ionic-angular/gestures/hammer";
export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    'swipe': { direction:DIRECTION_HORIZONTAL } // 重载设置
  }
}
