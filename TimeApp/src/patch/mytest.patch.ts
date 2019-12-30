import {IPatch} from "./ipatch";

/**
 * create by on 2019/3/5
 */
export class MytestPatch implements IPatch {

  //补丁版本
  version:number = 21;

  //补丁内容
  async createPatch() {

    console.log("=====mytest patch version:" + this.version);

  }

}
