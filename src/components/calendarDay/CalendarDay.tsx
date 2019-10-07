import { Component, Prop } from 'vue-property-decorator';
import { VueComponent } from '../../shims-vue';
import moment from 'moment';

import './calendarDay.css'

interface Props {
	day: any,
	className: any,
	onSelectDay: any,
}

@Component
export default class CalendarDay extends VueComponent<Props> {
	@Prop() day: any;
	@Prop() className!: string;

	selectDay () {
		this.$emit('selectDay', this.day);
	}

	render() {
		return (
			<div class={this.className} onClick={this.selectDay}>
				<span class='calendar__day-number'>{this.day}</span>
			</div>
		)
	}
}