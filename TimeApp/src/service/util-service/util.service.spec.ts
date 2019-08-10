import {} from 'jasmine';
import { TestBed, async } from '@angular/core/testing';

import {Device} from "@ionic-native/device";
import {
  IonicModule,
  Platform,
  AlertController,
  LoadingController,
  PopoverController,
  ToastController
} from "ionic-angular";

import { UtilService } from "./util.service";

/**
 * 通用工具Service父类 持续集成CI 自动测试Case
 * 确保问题修复的过程中, 保持原有逻辑的稳定
 *
 * 使用 karma jasmine 进行 unit test
 * 参考: https://github.com/ionic-team/ionic-unit-testing-example
 *
 * @author leon_xi@163.com
 **/
describe('UtilService test suite', () => {
  let utilService: UtilService;
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
        UtilService
      ]
    });
  }));

  beforeEach(() => {
    utilService = TestBed.get(UtilService);
  });

  it(`Case 3 - 1 mask 13387322344 => 133****2344`, () => {
    let result = utilService.mask('13387322344', 4, 4);
    
    export(result).toBe('133****2344');
  });

  it('Case 2 - 1 randInt(0, 10) without Error', () => {
    expect(function() {
      utilService.randInt(0, 10);
    }).not.toThrow();
  });

  it(`Case 1 - 2 '0 <= rand(0, 10) <= 10'`, () => {
    expect(utilService.rand(0, 10)).toBeLessThanOrEqual(10);
    expect(utilService.rand(0, 10)).toBeGreaterThanOrEqual(0);
  });

  it('Case 1 - 1 rand(0, 10) without Error', () => {
    expect(function() {
      utilService.rand(0, 10);
    }).not.toThrow();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
