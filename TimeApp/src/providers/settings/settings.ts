import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {StatusType} from "../../data.enum";
import {UserConfig} from "../../service/config/user.config";
import {DataConfig} from "../../service/config/data.config";
@Injectable()
export class SettingsProvider {
  theme: BehaviorSubject <string>;
  // barColor: BehaviorSubject <StatusType>;
  // statusbarcolors:Array<StatusType> = new Array<StatusType>();

  constructor() {
    //默认初始值
    this.theme = new BehaviorSubject('white-theme');
    // this.barColor= new BehaviorSubject(StatusType.other);
    // this.statusbarcolors.push(StatusType.other);
  }
  setActiveTheme(val){
    //新值
    this.theme.next(val);
  }
  getActiveTheme() {
    //观察
    return this.theme.asObservable();
  }

  // setStatusBarColor(val:StatusType){
  //   //新值
  //   this.statusbarcolors.push(val);
  //   this.barColor.next(val);
  // }

  // getStatusColor(val:StatusType):string{
  //   let ct:string = UserConfig.settins.get(DataConfig.SYS_THEME).value;
  //
  //   // switch (val){
  //   //   case StatusType.home:
  //   //     if (ct == "white-theme"){
  //   //       return "#003542";
  //   //     }else {
  //   //       return "#003542";
  //   //     }
  //   //
  //   //   case StatusType.meun:
  //   //     if (ct == "white-theme"){
  //   //       return "#f8f8f8";
  //   //     }else {
  //   //       return "#0d182a";
  //   //     }
  //   //   case StatusType.page:
  //   //     if (ct == "white-theme"){
  //   //       return "#f8f8f8";
  //   //     }else {
  //   //       return "#000c1f";
  //   //     }
  //   //   case StatusType.model:
  //   //     if (ct == "white-theme"){
  //   //       return "#000000";
  //   //     }else {
  //   //       return "#000000";
  //   //     }
  //   //   case StatusType.other:
  //   //     if (ct == "white-theme"){
  //   //       return "#f8f8f8";
  //   //     }else {
  //   //       return "#f8f8f8";
  //   //     }
  //   // }
  //   return "transparent";
  // }
  //
  // popStatusBarColor(){
  //   //新值
  //   this.statusbarcolors.pop();
  //   let val = this.statusbarcolors[this.statusbarcolors.length-1];
  //   this.barColor.next(val);
  // }
  //
  // getStatusBarColor() {
  //   //观察
  //   return this.barColor.asObservable();
  // }
}
