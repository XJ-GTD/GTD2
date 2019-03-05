import {Injectable} from "@angular/core";

/**
 * create by on 2019/3/5
 */

//接口
export interface ITbl {

  cT():Promise<any> ;

  upT(arg :any):Promise<any> ;

  dT(arg :any):Promise<any> ;

  sloT(arg :any):Promise<any> ;

  slT(arg :any):Promise<any> ;

  drT():Promise<any> ;

  inT(arg :any):Promise<any> ;

  rpT(arg :any):Promise<any> ;
}
