import {} from 'jasmine';
import { TestBed } from '@angular/core/testing';

import { CalendarService } from "./calendar.service";

describe('CalendarService test suite', () => {
  let calendarService: CalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalendarService]
    });
  });

  it('Case 1 - 1 add a new plan', () => {
    calendarService = TestBed.get(CalendarService);
  });
});
