import {BsModel} from "./bs.model";
import {RcEntity} from "../../entity/rc.entity";
import {RcpEntity} from "../../entity/rcp.entity";


//日程 out类
export class PeoModel extends BsModel {
  private _rcs: Array<RcEntity>;
  private _rc: RcEntity;

  private _rcps: Array<RcpEntity>;
  private _rcp: RcpEntity;


  get rcs(): Array<RcEntity> {
    return this._rcs;
  }

  set rcs(value: Array<RcEntity>) {
    this._rcs = value;
  }

  get rc(): RcEntity {
    return this._rc;
  }

  set rc(value: RcEntity) {
    this._rc = value;
  }

  get rcps(): Array<RcpEntity> {
    return this._rcps;
  }

  set rcps(value: Array<RcpEntity>) {
    this._rcps = value;
  }

  get rcp(): RcpEntity {
    return this._rcp;
  }

  set rcp(value: RcpEntity) {
    this._rcp = value;
  }
}
