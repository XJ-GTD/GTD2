import {SPro, STbl} from "../sqlite/tbl/s.tbl";


export class UrlUntil {

  private urlLs: Map<string, UrlEntity>;

  constructor(private stbl: STbl) {
    this.init();
  }

  //初始化全局 restful Url 信息
  init() {
    this.urlLs = new Map<string, UrlEntity>();
    let sPro = new SPro();
    this.stbl.slT(sPro).then(sPros => {

      console.log(sPros);

      for(let data of sPros){
        let urlentity:UrlEntity = new UrlEntity();
        urlentity.key = data.yk;
        urlentity.key = data.yv;
        this.urlLs.set(data.yk,urlentity);
      }
    })
  }

  //获取url
  getRestFulUrl(key: string): UrlEntity {
    return this.urlLs.get(key);
  }
}

export class UrlEntity {
  private _url: string;
  private _key: string;


  get url(): string {
    return this._url;
  }

  set url(value: string) {
    this._url = value;
  }

  get key(): string {
    return this._key;
  }

  set key(value: string) {
    this._key = value;
  }
}
