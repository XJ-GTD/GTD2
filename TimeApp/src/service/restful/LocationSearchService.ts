import {Injectable} from "@angular/core";
import {RestfulClient} from "../util-service/restful.client";

@Injectable()
export class LocationSearchService {
  formValueAttribute: any;
  labelAttribute: string = "name";

  constructor(private request: RestfulClient) {

  }

  getItemLabel(item: any): any {
    return item.name;
  }

  getResults(term: any): any {
   return this.queryPlace(term).then(data =>{
      return data.result;
    })
  }

  async getlocationData(keyword:string){
    let data:any = await this.queryPlace(keyword);
    return data.result[0];
  }

  //调用Place Suggestion API 获取地点输入提示
  queryPlace(query:string): Promise<any> {
    return new Promise((resolve, reject) => {

      let baiduMapSearchAPI: string = "http://api.map.baidu.com/place/v2/suggestion?query={query}&region=全国&output=json&ak=TKg1kS9jm5UqhjCOIpeCunT3d6D8l2c0";
      baiduMapSearchAPI = baiduMapSearchAPI.replace("{query}",query);

      this.request.get4thridAPIJSONP(baiduMapSearchAPI).then(data => {

        //处理返回结果
        resolve(data);

      }).catch(error => {
        //处理返回错误
        reject();

      })
    });

  }


  //调用Place Suggestion API 获取地点输入提示
  queryinitlocation(): Promise<any> {
    return new Promise((resolve, reject) => {

      let baiduMapSearchAPI: string = "https://api.map.baidu.com/location/ip?coor=bd09ll&ak=98TMZR5WnSwbH5FdnHHDe0917UlcDfCL";
      // urlEntity.url = encodeURIComponent(urlEntity.url);
      this.request.get4thridAPIJSONP(baiduMapSearchAPI).then(data => {

        //处理返回结果
        resolve(data);

      }).catch(error => {
        //处理返回错误
        reject();

      })
    });

  }
}
