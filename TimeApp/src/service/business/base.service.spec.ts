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

  it('Case 7 - 4 assertFalse(false)', () => {
    expect(function() {
      baseService.assertFalse(false);
    }).toThrow();
  });

  it('Case 7 - 3 assertFalse("4" == "5")', () => {
    expect(function() {
      baseService.assertFalse((<string>"4" == <string>"5"));
    }).toThrow();
  });

  it('Case 7 - 2 assertFalse(true)', () => {
    expect(function() {
      baseService.assertFalse(true);
    }).not.toThrow();
  });

  it('Case 7 - 1 assertFalse("4" == "4")', () => {
    expect(function() {
      baseService.assertFalse(("4" == "4"));
    }).not.toThrow();
  });

  it('Case 6 - 4 assertTrue(false)', () => {
    expect(function() {
      baseService.assertTrue(false);
    }).not.toThrow();
  });

  it('Case 6 - 3 assertTrue("4" == "5")', () => {
    expect(function() {
      baseService.assertTrue((<string>"4" == <string>"5"));
    }).not.toThrow();
  });

  it('Case 6 - 2 assertTrue(true)', () => {
    expect(function() {
      baseService.assertTrue(true);
    }).toThrow();
  });

  it('Case 6 - 1 assertTrue("4" == "4")', () => {
    expect(function() {
      baseService.assertTrue(("4" == "4"));
    }).toThrow();
  });

  it('Case 5 - 2 assertNotNumber("4")', () => {
    expect(function() {
      baseService.assertNotNumber("4");
    }).not.toThrow();
  });

  it('Case 5 - 1 assertNotNumber("not number")', () => {
    expect(function() {
      baseService.assertNotNumber("not number");
    }).toThrow();
  });

  it('Case 4 - 2 assertNumber("4")', () => {
    expect(function() {
      baseService.assertNumber("4");
    }).toThrow();
  });

  it('Case 4 - 1 assertNumber("not number")', () => {
    expect(function() {
      baseService.assertNumber("not number");
    }).not.toThrow();
  });

  it('Case 3 - 1 assertNull(null)', () => {
    expect(function() {
      baseService.assertNull(null);
    }).toThrow();
  });

  it(`Case 2 - 2 assertNotEmpty("has string")`, () => {
    expect(function() {
      let val: string = "has string";
      baseService.assertNotEmpty(val);
    }).toThrow();
  });

  it('Case 2 - 1 assertNotEmpty(null)', () => {
    expect(function() {
      baseService.assertNotEmpty(null);
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
