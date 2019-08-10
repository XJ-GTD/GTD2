import {} from 'jasmine';
import { TestBed, async } from '@angular/core/testing';

import {Device} from "@ionic-native/device";
import {SQLite} from "@ionic-native/sqlite";

import {
  IonicModule,
  Platform,
  AlertController,
  LoadingController,
  PopoverController,
  ToastController
} from "ionic-angular";
import {SQLitePorter} from "@ionic-native/sqlite-porter";
import {SqliteConfig} from "../config/sqlite.config";

import {UtilService} from "../util-service/util.service";
import { SqliteExec } from "./sqlite.exec";

/**
 * Sqlite工具类 持续集成CI 自动测试Case
 * 确保问题修复的过程中, 保持原有逻辑的稳定
 *
 * 使用 karma jasmine 进行 unit test
 * 参考: https://github.com/ionic-team/ionic-unit-testing-example
 *
 * @author leon_xi@163.com
 **/
describe('SqliteExec test suite', () => {
  let sqlExce: SqliteExec;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot()
      ],
      providers: [
        Device,
        AlertController,
        LoadingController,
        PopoverController,
        ToastController,
        UtilService,
        SQLite,
        SQLitePorter,
        SqliteConfig,
        SqliteExec
      ]
    });
  }));

  beforeEach(() => {
    sqlExce = TestBed.get(SqliteExec);
  });

  it('Case 1 - 1 create() without Error', () => {
    expect(function() {
      let y: YTbl = new YTbl();
      sqlExce.create(y);
    }).not.toThrow();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
