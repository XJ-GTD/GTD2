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
      let url: UrlEntity = new UrlEntity();//this.config.getRestFulUrl("PLACESUGGESTION");
      let urlEntity: UrlEntity = new UrlEntity();
      url.url = "http://api.map.baidu.com/place/v2/suggestion?query={query}&region=全国&city_limit=true&output=json&ak=zD6zCIA9w7ItoXwxQ8IRPD4rk5E9GEew";
      urlEntity.key = url.key;
      urlEntity.desc = url.desc;
      urlEntity.url = url.url;
      urlEntity.url = urlEntity.url.replace("{query}",query);
      urlEntity.url = encodeURIComponent(urlEntity.url);
      this.request.get(urlEntity).then(data => {
        //处理返回结果
        resolve(data.data);

      }).catch(error => {
        //处理返回错误
        reject();

      })
    });

  }

}
