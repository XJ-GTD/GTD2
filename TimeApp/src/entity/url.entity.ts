

export class UrlEntity{

  constructor(url:string , hasCheck:boolean){
    this._url = url;
    this._hasCheck = hasCheck;
  }

  private _url:string = '';
  private _hasCheck:boolean ;


  get url(): string {
    return this._url;
  }

  set url(value: string) {
    this._url = value;
  }

  get hasCheck(): boolean {
    return this._hasCheck;
  }

  set hasCheck(value: boolean) {
    this._hasCheck = value;
  }
}
