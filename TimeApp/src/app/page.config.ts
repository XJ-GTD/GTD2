import {HaPage} from "../pages/ha/ha";

/**
 * 页面迁移用
 */
export class PageConfig {

  private static _AZ_PAGE: any = "AzPage";

  private static _HA_PAGE: any = "HaPage";
  private static _HZ_PAGE: any = "HzPage";

  static get HA_PAGE(): any {
    return this._HA_PAGE;
  }

  static set HA_PAGE(value: any) {
    this._HA_PAGE = value;
  }
  static get HZ_PAGE(): any {
    return this._HZ_PAGE;
  }

  static set HZ_PAGE(value: any) {
    this._HZ_PAGE = value;
  }

  static get AZ_PAGE(): any {
    return this._AZ_PAGE;
  }

  static set AZ_PAGE(value: any) {
    this._AZ_PAGE = value;
  }

}
