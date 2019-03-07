import { Injectable } from '@angular/core';
import {RestfulClient} from "./restful.client";



/**
 * 系统
 */
@Injectable()
export class SyncRestful{
  constructor(private request: RestfulClient) {
  }


  //初始化数据 ID
  init(): Promise<any> {

    return new Promise((resolve, reject) => {
    });
  }
}
