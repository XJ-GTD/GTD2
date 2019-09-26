import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";

import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import { UserConfig } from "../config/user.config";

@Injectable()
export class EffectService extends BaseService {
  constructor() {
    super();
  }
}
