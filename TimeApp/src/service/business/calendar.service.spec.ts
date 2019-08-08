import {} from 'jasmine';
import { TestBed } from '@angular/core/testing';

import { CalendarService, PlanData } from "./calendar.service";

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

    plan.jn = '测试日历';
    plan.jc = '#f1f1f1';

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
