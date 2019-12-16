import { Injectable } from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";
import {ContextModel, WsModel} from "../../ws/model/ws.model";

/**
 * 语音
 */
@Injectable()
export class AibutlerRestful{
  constructor(private request: RestfulClient, private config: RestFulConfig) {
  }

  //语音上传 VU
  postaudio(audioPro:AudioPro):Promise<any> {

    return new Promise((resolve, reject) => {
        let url: UrlEntity = this.config.getRestFulUrl("VU");
        this.request.post(url, audioPro).then(data => {
          //处理返回结果
          resolve(data.d);

        }).catch(error => {
          //处理返回错误
          resolve();

        })
    });
  }

  //文本上传 TU
  posttext(textPro:TextPro):Promise<any> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("TU");
      this.request.post(url, textPro).then(data => {
        //处理返回结果
        resolve(data.d);

      }).catch(error => {
        //处理返回错误
        resolve();

      })
    });
  }
}

//音频入参
export class AudioPro{
  //上下文
  c : ContextModel = new ContextModel();
  d : AudioProSub = new AudioProSub();
}
export class AudioProSub{
  //Base64编码语音
  vb64 : string="";
  //控制讯飞是否清空对话历史,auto不清除
  clean: string = "auto";
}

//文本入参
export class TextPro{
  //上下文
  c : ContextModel = new ContextModel();
  d : TextProSub = new TextProSub();
}
export class TextProSub{
  //文本文字
  text : string="";
  //控制讯飞是否清空对话历史,auto不清除
  clean: string = "auto";
}
