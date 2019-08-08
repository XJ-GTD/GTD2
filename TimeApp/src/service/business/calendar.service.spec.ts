import {} from 'jasmine';
import { TestBed, async } from '@angular/core/testing';

import { CalendarService, PlanData, PlanType } from "./calendar.service";

/**
 * 日历Service 持续集成CI 自动测试Case
 * 确保问题修复的过程中, 保持原有逻辑的稳定
 *
 * @author leon_xi@163.com
 **/
describe('CalendarService test suite', () => {
  let calendarService: CalendarService;
  let planforUpdate: PlanData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalendarService]
    });
    calendarService = TestBed.get(CalendarService);
  });

  it('Case 1 - 1 service should be created', () => {
    expect(calendarService).toBeTruthy();
  });

  it('Case 1 - 2 use savePlan to create a new plan', async(() => {
    let plan: PlanData = {} as PlanData;

    plan.jn = '冥王星服务类 自动测试';
    plan.jc = '#f1f1f1';
    plan.jt = PlanType.PrivatePlan;

    calendarService.savePlan(plan).then(savedPlan => {
      planforUpdate = savedPlan;  // 保存用于后面的测试用例

      expect(savedPlan.ji).toBeDefined();
      expect(savedPlan.ji).not.toBe('');
    });
  }));

  it('Case 1 - 3 use savePlan to update an exist plan\'s color', async(() => {
    if (planforUpdate && planforUpdate.ji) {
      let plan: PlanData = planforUpdate;

      plan.jc = '#1a1a1a';

      calendarService.savePlan(plan).then(savedPlan => {
        planforUpdate = savedPlan;  // 保存用于后面的测试用例

        expect(savedPlan.jc).toBe('#1a1a1a');
      });
    }
  }));
});