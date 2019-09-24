import {Injectable} from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";

/**
 * 地图 调用百度地图webapi
 */
@Injectable()
export class LocalRestful {

  constructor(private request: RestfulClient,
              private config: RestFulConfig,) {
  }

  //调用Place Suggestion API 获取地点输入提示
  queryPlace(query:string): Promise<any> {
    return new Promise((resolve, reject) => {

      let baiduMapSearchAPI: string = "http://api.map.baidu.com/place/v2/suggestion?query={query}&region=全国&output=json&ak=98TMZR5WnSwbH5FdnHHDe0917UlcDfCL";
      baiduMapSearchAPI = baiduMapSearchAPI.replace("{query}",query);
      // urlEntity.url = encodeURIComponent(urlEntity.url);
      this.request.get4thridAPI(baiduMapSearchAPI).then(data => {

        //处理返回结果
        resolve(data);

      }).catch(error => {
        //处理返回错误
        reject();

      })
    });

  }

}
