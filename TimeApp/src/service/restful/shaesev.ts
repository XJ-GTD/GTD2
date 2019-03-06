import { Injectable } from '@angular/core';
import {RestfulClient} from "./restful.client";
/**
 * 计划
 */
@Injectable()
export class ShaeRestful{
  constructor(private request: RestfulClient) {
  }
  //计划	计划上传	PU
  share():Promise<any> {

    return new Promise((resolve, reject) => {
    });
  }


  //内建计划下载	BIPD
  downsysname():Promise<any> {

    return new Promise((resolve, reject) => {
    });
  }
}
