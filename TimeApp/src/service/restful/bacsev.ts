import { Injectable } from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";



/**
 * 备份
 */
@Injectable()
export class BacRestful{
  constructor(private request: RestfulClient) {
  }

  // 备份 B
  backup():Promise<any> {

    return new Promise((resolve, reject) => {
    });
  }


  // 恢复 R
  recover():Promise<any> {

    return new Promise((resolve, reject) => {
    });
  }

  // 备份查询 BS
  getlastest():Promise<any> {

    return new Promise((resolve, reject) => {
    });
  }
}

//备份入参
export class backupPro{
  oai:string ;
  ompn:string;
  c:object;
  d:{bts:string};
}
