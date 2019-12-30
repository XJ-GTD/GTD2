/**
 * create by on 2019/3/5
 */

//补丁服务器接口
export interface IPatch {
  /**
   * 设定补丁版本
   */
  version:number;

  /**
   * 创建补丁内容
   */
  createPatch();
}


