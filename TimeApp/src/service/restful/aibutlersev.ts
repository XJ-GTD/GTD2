import { Injectable } from '@angular/core';
import {RestfulClient} from "./restful.client";



/**
 * 语音
 */
@Injectable()
export class AibutlerRestful{
  constructor(private request: RestfulClient) {
  }

  //语音上传 VU
  postaudio():Promise<any> {

    return new Promise((resolve, reject) => {
    });
  }

  //文本上传 TU
  posttext():Promise<any> {

    return new Promise((resolve, reject) => {

    });
  }
}
