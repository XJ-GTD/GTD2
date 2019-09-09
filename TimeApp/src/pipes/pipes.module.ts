import { NgModule } from '@angular/core';
import { FormatedatePipe } from './formatedate/formatedate';
import { FormatstringPipe } from './formatstring/formatstring';
import { FormatWeatherPipe } from './formatweather/formatweather';
import { FormatRepeatPipe } from './formatrepeat/formatrepeat';
import { FormatRemindPipe } from './formatremind/formatremind';
import { FormatUserPipe } from './formatuser/formatuser';
import { FormatPlanPipe } from './formatplan/formatplan';

@NgModule({
	declarations: [
		FormatedatePipe,
		FormatstringPipe,
		FormatUserPipe,
		FormatPlanPipe,
		FormatWeatherPipe,
		FormatRepeatPipe,
		FormatRemindPipe
	],
	imports: [],
	exports: [
		FormatedatePipe,
		FormatstringPipe,
		FormatUserPipe,
		FormatPlanPipe,
		FormatWeatherPipe,
		FormatRepeatPipe,
		FormatRemindPipe
	]
})
export class PipesModule {}
