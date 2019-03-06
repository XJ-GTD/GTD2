import { Injectable } from '@angular/core';

import { AppConfig } from "../../app/app.config";
import { UtilService } from "../util-service/util.service";
import { BsRestful } from "./bs-restful";
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
