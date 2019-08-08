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

  it('test a', () => {
    calendarService = TestBed.get(CalendarService);
  });
});
