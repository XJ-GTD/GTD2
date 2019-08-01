import { NgModule } from '@angular/core';
import { FormatedatePipe } from './formatedate/formatedate';
import { FormatstringPipe } from './formatstring/formatstring';
import { FormatWeatherPipe } from './formatweather/formatweather';
import { FormatRepeatPipe } from './formatrepeat/formatrepeat';
import { FormatRemindPipe } from './formatremind/formatremind';

@NgModule({
	declarations: [
		FormatedatePipe,
		FormatstringPipe,
		FormatWeatherPipe,
		FormatRepeatPipe,
		FormatRemindPipe
	],
	imports: [],
	exports: [
		FormatedatePipe,
		FormatstringPipe,
		FormatWeatherPipe,
		FormatRepeatPipe,
		FormatRemindPipe
	]
})
export class PipesModule {}
