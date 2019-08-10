import {} from 'jasmine';
import { TestBed, async } from '@angular/core/testing';

import { BaseService } from "./base.service";

/**
 * 业务Service父类 持续集成CI 自动测试Case
 * 确保问题修复的过程中, 保持原有逻辑的稳定
 *
 * 使用 karma jasmine 进行 unit test
 * 参考: https://github.com/ionic-team/ionic-unit-testing-example
 *
 * @author leon_xi@163.com
 **/
describe('BaseService test suite', () => {
  let baseService: BaseService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [BaseService]
    });
  }));

  beforeEach(() => {
    baseService = TestBed.get(BaseService);
  });

  it('Case 1 - 2 assertEmpty(undefined)', () => {
    expect(baseService.assertEmpty(undefined)).toThrowAnyError();
  });

  it('Case 1 - 1 assertEmpty(null)', () => {
    expect(baseService.assertEmpty(null)).toThrowAnyError();
  });
});
