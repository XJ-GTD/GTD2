import {} from 'jasmine';
import { TestBed } from '@angular/core/testing';

import { CalendarService, PlanData } from "./calendar.service";

describe('CalendarService test suite', () => {
  let calendarService: CalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalendarService]
    });
    calendarService = TestBed.get(CalendarService);
  });

  it('Case 1 - 1 service should be created', () => {
    expect(calendarService).toBeTruthy();
  });

  it('', async(() => {
    let plan: PlanData = {} as PlanData;

    plan.jn = '测试日历';
    plan.jc = '#f1f1f1';

    calendarService.savePlan(plan).then(savedPlan => {
      expect(savedPlan.ji).toBeDefined();
    });
  }));
});
