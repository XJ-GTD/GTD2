import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import {
  assertNotEqual,
  assertEqual,
  assertTrue,
  assertFalse,
  assertNotNumber,
  assertNumber,
  assertEmpty,
  assertNotEmpty,
  assertNull,
  assertNotNull,
  assertFail
} from "../../util/util";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import { UserConfig } from "../config/user.config";

@Injectable()
export class EffectService extends BaseService {
  constructor(private sqlExce: SqliteExec,
              private util: UtilService,
              private userConfig: UserConfig) {
    super();
  }
}
