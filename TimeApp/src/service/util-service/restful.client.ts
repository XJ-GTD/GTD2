import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HTTP} from "@ionic-native/http";
import {UrlEntity, RestFulConfig, RestFulHeader} from "../config/restful.config";
import {UtilService} from "./util.service";
import {SqliteExec} from "./sqlite.exec";
import {LogTbl} from "../sqlite/tbl/log.tbl";
import {NetworkService} from "../cordova/network.service";

/**
 * 基础resful请求
 */
@Injectable()
export class RestfulClient {

  constructor(private http: HTTP,
              private httpClient: HttpClient,
              private networkService: NetworkService,
              private restConfig: RestFulConfig,
              private util: UtilService,
              private sqlitExc: SqliteExec) {
    this.init()
  }

  init() {
    if (this.util.hasCordova()) {
      this.http.setDataSerializer("json");
      this.http.setSSLCertMode("nocheck").then(data => {
      })
    }
  }

  upload(url: UrlEntity, body: any, filePath: string, name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // 没有网络的时候，直接返回
      if (!this.networkService.isConnected()) {
        resolve();
        return;
      }

      let header = this.restConfig.createHeader();
      if (this.util.hasCordova()) {
        return this.http.uploadFile(url.url, body, header, filePath, name).then(data => {

          let jsonData = JSON.parse(data.data);
          resolve(jsonData);
        });
      } else {
        //浏览器测试使用
        let warHeader: any = {};
        warHeader.headers = header;
        this.httpClient.post(url.url, body, warHeader).subscribe(data => {
          resolve(data);
        });
      }
    });
  }

  async downloadFile(url: string, body: any, filePath: string): Promise<any> {
    if (!this.networkService.isConnected()) {
      return;
    }

    let header = this.restConfig.createHeader();

    if (this.util.hasCordova()) {
      let data = await this.http.downloadFile(url, body, header, filePath);
      return data;
    } else {
      return;
    }
  }

  download(url: UrlEntity, body: any, filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // 没有网络的时候，直接返回
      if (!this.networkService.isConnected()) {
        resolve();
        return;
      }

      let header = this.restConfig.createHeader();
      if (this.util.hasCordova()) {
        return this.http.downloadFile(url.url, body, header, filePath).then(data => {
          let jsonData = JSON.parse(data.data);
          resolve(jsonData);
        });
      } else {
        resolve({});

        //浏览器使用 测试通过，暂时不用
        // let warHeader: any = {};
        // header["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";
        // warHeader.headers = header;
        // warHeader.params = body;
        // this.httpClient.post(url.url, {}, warHeader).subscribe(data => {
        //   //console.log("download >=< " + JSON.stringify(data));
        //   resolve({});
        // });
      }
    });
  }

  post(url: UrlEntity, body: any): Promise<any> {
    return new Promise((resolve, reject) => {

      // 没有网络的时候，直接返回
      if (!this.networkService.isConnected()) {
        reject("no network");
        return;
      }

      // let log: LogTbl = new LogTbl();
      // log.id = this.util.getUuid();
      // log.su = url.key;
      // log.ss = new Date().valueOf();
      // log.t = 1;
      let header = this.restConfig.createHeader();
      if (this.util.hasCordova()) {
        return this.http.post(url.url, body, header).then(data => {
          // console.log(data.status);
          // console.log(data.data); // data received by server
          // console.log(data.headers);
          let jsonData = JSON.parse(data.data);

          // log.ss = new Date().valueOf() - log.ss;
          // log.st = true;
          // this.sqlitExc.noteLog(log);
          resolve(jsonData);
        }).catch(err => {
          // this.util.toastStart("冥王星" + url.desc + "服务访问失败", 2000);
          this.util.tellyou("冥王星" + url.desc + "服务访问失败");

          // log.ss = new Date().valueOf() - log.ss;
          // log.st = false;
          // log.er = err;
          // this.sqlitExc.noteLog(log);
          reject(err);
        })
      } else {
        //浏览器测试使用
        let warHeader: any = {};
        warHeader.headers = header;
        this.httpClient.post(url.url, body, warHeader).subscribe(data => {
          //
          // log.ss = new Date().valueOf() - log.ss;
          // log.st = true;
          // this.sqlitExc.noteLog(log);
          resolve(data);
        }, err => {

          // log.ss = new Date().valueOf() - log.ss;
          // log.st = false;
          // log.er = err;
          // this.sqlitExc.noteLog(log);
          // this.util.toastStart("冥王星" + url.desc + "服务访问失败", 2000);
          this.util.tellyou("冥王星" + url.desc + "服务访问失败");
          reject(err)
        })
      }
    });
  }

  get(url: UrlEntity): Promise<any> {
    return new Promise((resolve, reject) => {
      // 没有网络的时候，直接返回
      if (!this.networkService.isConnected()) {
        resolve();
        return;
      }

      // let log: LogTbl = new LogTbl();
      // log.id = this.util.getUuid();
      // log.su = url.key;
      // log.ss = new Date().valueOf();
      // log.t = 1;
      let header = this.restConfig.createHeader();
      if (this.util.hasCordova()) {
        return this.http.get(url.url, {}, header).then(data => {
          let jsonData = JSON.parse(data.data);
          // log.ss = new Date().valueOf() - log.ss;
          // log.st = true;
          // this.sqlitExc.noteLog(log);
          resolve(jsonData);
        }).catch(err => {
          //
          // log.ss = new Date().valueOf() - log.ss;
          // log.st = false;
          // log.er = err;
          // this.sqlitExc.noteLog(log);
          // this.util.toastStart("冥王星" + url.desc + "服务访问失败", 2000);
          this.util.tellyou("冥王星" + url.desc + "服务访问失败");
          reject(err);
        })
      } else {
        //浏览器测试使用
        let warHeader: any = {};
        warHeader.headers = header;
        this.httpClient.get(url.url, warHeader).subscribe(data => {
          //
          // log.ss = new Date().valueOf() - log.ss;
          // log.st = true;
          // this.sqlitExc.noteLog(log);
          resolve(data);
        }, err => {
          //
          // log.ss = new Date().valueOf() - log.ss;
          // log.st = false;
          // log.er = err;
          // this.sqlitExc.noteLog(log);
          // this.util.toastStart("冥王星" + url.desc + "服务访问失败", 2000);
          this.util.tellyou("冥王星" + url.desc + "服务访问失败");
          reject(err)
        })
      }
    });
  }

  put(url: UrlEntity, body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // 没有网络的时候，直接返回
      if (!this.networkService.isConnected()) {
        resolve();
        return;
      }

      // let log: LogTbl = new LogTbl();
      // log.id = this.util.getUuid();
      // log.su = url.key;
      // log.ss = new Date().valueOf();
      // log.t = 1;
      let header = this.restConfig.createHeader();
      if (this.util.hasCordova()) {
        return this.http.put(url.url, body, header).then(data => {
          let jsonData = JSON.parse(data.data);
          //
          // log.ss = new Date().valueOf() - log.ss;
          // log.st = true;
          // this.sqlitExc.noteLog(log);
          resolve(jsonData);
        }).catch(err => {
          //
          // log.ss = new Date().valueOf() - log.ss;
          // log.st = false;
          // log.er = err;
          // this.sqlitExc.noteLog(log);
          // this.util.toastStart("冥王星" + url.desc + "服务访问失败", 2000);
          this.util.tellyou("冥王星" + url.desc + "服务访问失败");
          reject(err);
        })
      } else {
        //浏览器测试使用
        let warHeader: any = {};
        warHeader.headers = header;
        this.httpClient.put(url.url, body, warHeader).subscribe(data => {
          // log.ss = new Date().valueOf() - log.ss;
          // log.st = true;
          // this.sqlitExc.noteLog(log);
          // log.t = 1;
          resolve(data);
        }, err => {
          // log.ss = new Date().valueOf() - log.ss;
          // log.st = false;
          // log.er = err;
          // this.sqlitExc.noteLog(log);
          // this.util.toastStart("冥王星" + url.desc + "服务访问失败", 2000);
          this.util.tellyou("冥王星" + url.desc + "服务访问失败");
          reject(err)
        })
      }
    });
  }

  /**
   * http请求
   * @param url
   * @param header
   * @param body
   */
  specPost(url: string, header: RestFulHeader, body: any): Promise<any> {
    // let log: LogTbl = new LogTbl();
    // log.id = this.util.getUuid();
    // log.su = url;
    // log.ss = new Date().valueOf();
    // log.t = 1;
    return new Promise((resolve, reject) => {
      // 没有网络的时候，直接返回
      if (!this.networkService.isConnected()) {
        reject("没有网络的时候，直接返回");
        return;
      }

      if (this.util.hasCordova()) {
        return this.http.post(url, body, header).then(data => {
          // log.ss = new Date().valueOf() - log.ss;
          // log.st = true;
          // this.sqlitExc.noteLog(log);
          resolve(JSON.parse(data.data));
        }).catch(err => {
          // log.ss = new Date().valueOf() - log.ss;
          // log.st = false;
          // log.er = err;
          // this.sqlitExc.noteLog(log);
          // this.util.toastStart("初始化数据获取失败", 2000);
          reject("服务器数据未获取");
          //reject(e);
        })
      } else {
        //浏览器测试使用
        let warHeader: any = {};
        warHeader.headers = header;
        this.httpClient.post(url, body, warHeader).subscribe(data => {
          // log.ss = new Date().valueOf() - log.ss;
          // log.st = true;
          // this.sqlitExc.noteLog(log);
          resolve(data);
        }, err => {
          // log.ss = new Date().valueOf() - log.ss;
          // log.st = false;
          // log.er = err;
          // this.sqlitExc.noteLog(log);
          // this.util.toastStart("初始化数据获取失败", 2000);
          reject("服务器数据未获取");
        })
      }
    });
  }

  /**
   * http请求
   * @param url
   * @param header
   * @param body
   */
  get4Text(url: string, header: RestFulHeader, body: any): Promise<any> {
    // let log: LogTbl = new LogTbl();
    // log.id = this.util.getUuid();
    // log.su = url;
    // log.ss = new Date().valueOf();
    // log.t = 1;
    return new Promise((resolve, reject) => {
      // 没有网络的时候，直接返回
      if (!this.networkService.isConnected()) {
        resolve();
        return;
      }

      header["Content-Type"] = "text/plain"
      if (this.util.hasCordova()) {
        return this.http.get(url, body, header).then(data => {
          // log.ss = new Date().valueOf() - log.ss;
          // log.st = true;
          // this.sqlitExc.noteLog(log);
          resolve(data.data);
        }).catch(err => {
          // log.ss = new Date().valueOf() - log.ss;
          // log.st = false;
          // log.er = err;
          // this.sqlitExc.noteLog(log);
          this.util.toastStart("初始化数据获取失败", 2000);
          reject(err);
        })
      } else {
        //浏览器测试使用
        let warHeader: any = {};
        warHeader.headers = header;
        this.httpClient.get(url, warHeader).subscribe(data => {
          // log.ss = new Date().valueOf() - log.ss;
          // log.st = true;
          // this.sqlitExc.noteLog(log);
          resolve(data);
        }, err => {
          // log.ss = new Date().valueOf() - log.ss;
          // log.st = false;
          // log.er = err;
          // this.sqlitExc.noteLog(log);
          this.util.toastStart("初始化数据获取失败", 2000);
          reject(err)
        })
      }
    });
  }

  /**
   * http请求
   * @param url
   * @param header
   * @param body
   */
  get4thridAPIJSONP(url: string): Promise<any> {

    return new Promise((resolve, reject) => {

      if (this.util.hasCordova()) {
         this.http.get(url, {}, {}).then(data => {

           resolve(JSON.parse(data.data));
        }).catch(err => {
        })
      } else {

        this.httpClient.jsonp(url, "callback").subscribe((data) => {
          resolve(data);
        });
      }

    });
  }

  /**
   * http请求
   * @param url
   * @param header
   * @param body
   */
  get4thridAPIGET(url: string): Promise<any> {

    return new Promise((resolve, reject) => {

      if (this.util.hasCordova()) {
        this.http.get(url, {}, {}).then(data => {
          resolve(data);
        }).catch(err => {
        })
      } else {

        this.httpClient.get(url).subscribe((data) => {
          resolve(data);
        });
      }

    });
  }


}
