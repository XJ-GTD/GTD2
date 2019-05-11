import {Injectable} from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulHeader, RestFulConfig} from "../config/restful.config";
import {UtilService} from "../util-service/util.service";


/**
 * 系统
 */
@Injectable()
export class SyncRestful {
  // 预览版
  //private initDataUrl: string = "https://www.guobaa.com/ini/parameters";
  // 内网测试版
  //private initDataUrl: string = "https://www.guobaa.com/ini/parameters?debug=true";
  // 开发版
  private initDataUrl: string = "https://www.guobaa.com/ini/parameters?tag=mwxing";

  constructor(private request: RestfulClient, private uitl: UtilService) {
  }


  //初始化数据 ID
  initData(): Promise<SybcData> {
    return new Promise((resolve, reject) => {


      let header: RestFulHeader = new RestFulHeader();
      header.di = this.uitl.deviceId();
      header.dt = this.uitl.deviceType();
      //设别类型
      this.request.specPost(RestFulConfig.INIT_DATA_URL, header, {}).then(reps => {
        let data: SybcData = reps.d;
        resolve(data);
      });
    });
  }
}

export class SybcData {
  apil: Array<Apil>;
  bipl: Array<Bipl>;
  vrs: Array<Vrs>;
  dpfu:Array<Dpfu>;
}

export class Apil {
  desc: string;
  name: string;
  value: string;
}

export class Bipl {
  plandesc: string;
  planid: string;
  planmark: string;
  planname: string;
}

export class Dpfu {
  desc: string;
  name: string;
  value: string;
}

export class Vrs {
  type:string;
  needAnswer:string;
  desc: string;
  name: string;
  value: string;

}
