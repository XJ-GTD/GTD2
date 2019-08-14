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

  it('Case 3 - 1 assertNull(null)', () => {
    expect(function() {
      baseService.assertNull(null);
    }).toThrow();
  });

  it(`Case 2 - 2 assertNotEmpty("")`, () => {
    expect(function() {
      let val: string = "";
      baseService.assertEmpty(val);
    }).toThrow();
  });

  it('Case 2 - 1 assertNotEmpty(null)', () => {
    expect(function() {
      baseService.assertEmpty(null);
    }).not.toThrow();
  });

  it(`Case 1 - 4 assertEmpty('has string')`, () => {
    expect(function() {
      baseService.assertEmpty('has string');
    }).not.toThrow();
  });

  it(`Case 1 - 3 assertEmpty('')`, () => {
    expect(function() {
      baseService.assertEmpty('');
    }).toThrow();
  });

  it('Case 1 - 2 assertEmpty(undefined)', () => {
    expect(function() {
      baseService.assertEmpty(undefined);
    }).toThrow();
  });

  it('Case 1 - 1 assertEmpty(null)', () => {
    expect(function() {
      baseService.assertEmpty(null);
    }).toThrow();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
