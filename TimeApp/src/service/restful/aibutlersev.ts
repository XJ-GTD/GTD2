import { Injectable } from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";
import {BsModel} from "./out/bs.model";



/**
 * 语音
 */
@Injectable()
export class AibutlerRestful{
  constructor(private request: RestfulClient, private config: RestFulConfig) {
  }

  //语音上传 VU
  postaudio(audioPro:AudioPro):Promise<BsModel<any>> {

    return new Promise((resolve, reject) => {
        let url: UrlEntity = this.config.getRestFulUrl("VU");
        let bsModel = new BsModel<any>();
        this.request.post(url, audioPro).then(data => {
          //处理返回结果
          bsModel.code = data.rc;
          bsModel.message = data.rm;
          bsModel.data = data.d;
          resolve(bsModel);

        }).catch(error => {
          //处理返回错误
          bsModel.code = -99;
          bsModel.message = "处理出错";
          resolve(bsModel);

        })
    });
  }

  //文本上传 TU
  posttext(textPro:TextPro):Promise<any> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("TU");
      let bsModel = new BsModel<any>();
      this.request.post(url, textPro).then(data => {
        //处理返回结果
        bsModel.code = data.rc;
        bsModel.message = data.rm;
        bsModel.data = data.d;
        resolve(bsModel);

      }).catch(error => {
        //处理返回错误
        bsModel.code = -99;
        bsModel.message = "处理出错";
        resolve(bsModel);

      })
    });
  }
}

//音频入参
export class AudioPro{
  //上下文
  c : any = {};
  d : AudioProSub = new AudioProSub();
}
export class AudioProSub{
  //Base64编码语音
  vb64 : string="";

}

//文本入参
export class TextPro{
  //上下文
  c : any = {};
  d : TextProSub = new TextProSub();
}
export class TextProSub{
  //文本文字
  text : string="";

}
