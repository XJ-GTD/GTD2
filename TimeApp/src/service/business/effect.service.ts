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

@Injectable()
export class EffectService extends BaseService {
  constructor(private sqlExce: SqliteExec,
              private util: UtilService,
              private userConfig: UserConfig,
              private dataRestful: DataRestful) {
    super();
  }
}
