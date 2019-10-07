import { Component, Prop } from 'vue-property-decorator';
import { VueComponent } from '../../shims-vue';
import { useStore } from 'vuex-simple';

import moment from 'moment';
import 'moment/locale/ru.js';

import CalendarDay from '../calendarDay/CalendarDay';

import { MyStore } from '@/store/store';

import './calendar.css'

interface Props {
	year?: Number
}

interface IMonth {
	title: string;
	weeks: any;
}

@Component
export default class Calendar extends VueComponent<Props> {
	@Prop({ default: (new Date()).getFullYear() }) year!: Number

	created () {
		this.setCurrentDate();
	}

	public store: MyStore = useStore(this.$store);

  public get events() {
    return this.store.events;
  }

	public setCurrentDate() {
		this.store.setCurrentDate({
			date: `${this.month}-${this.currentDay}`,
		});
	}

	month = this.getCurrentMonth();
	currentDay = moment({h:0, m:0, s:0, ms:0}).toDate().getDate();

	isEndOfYear() {
		return this.month === 11;
	}

	isStartOfYear() {
		return this.month === 0;
	}

	get yearData(): Array<any> {
		let data = [];

		for (let m = 1; m <= 12; m++) {
			let day = moment(`${this.year}-${m}-1`);
			let daysInMonth = day.daysInMonth();

			let month: IMonth = {
				title: day.format('MMMM'),
				weeks: {},
			};

			for (let d = 0; d < daysInMonth; ++d) {
				let week = day.week();

				if (m === 12 && week === 1) {
					week = 53
				}

				if (!month.weeks.hasOwnProperty(week)) {
					month.weeks[week] = {}
				}
				month.weeks[week][day.weekday()] = {
					date: day.toDate(),
				};

				day.add(1, 'd');
			}

			data.push(month);
		}

		return data
	}

	get weekDays () {
		let days = [];

		for(let i = 1; i <= 7; ++i) {
			days.push(moment().isoWeekday(i).format('dd'))
		}

		return days;
	}

	getCurrentMonth () {
		return moment().month();
	}

	selectDay (day: number) {
		this.currentDay = day;
		this.setCurrentDate();
	}

	isNeedDayFromPreviousMonth (week: any) {
		return Boolean(+Object.keys(week)[0]);
	}

	isNeedDayFromNextMonth (week: any) {
		return +Object.keys(week)[Object.keys(week).length - 1] !== 6;
	}

	isDisabledDay (week: any, day: number) {
		return (this.isNeedDayFromPreviousMonth(week) || this.isNeedDayFromNextMonth(week)) && !week[day];
	}

	isSelectedDay (week: any, day: number) {
		return week[day] && week[day].date.getDate() === this.currentDay;
	}

	isEventDay (week: any, day: number) {
		return week[day] && week[day].date && this.events[`${this.month}-${week[day].date.getDate()}`];
	}

	getDays (week: any) {
			let days = [];
			let missingDaysOfWeek = 7 - Object.keys(week).length;

			for (let day = 0; day < 7; day++) {
				let dayFromPreviousMonth = moment(Object.values<any>(week)[0].date).subtract(1, 'months').startOf('month')
					.subtract(missingDaysOfWeek, 'day').startOf('day').toDate().getDate();

				let dayFromNextMonth = moment(Object.values<any>(week)[0].date).add(1, 'months').startOf('month')
					.add(-1 - missingDaysOfWeek, 'day').startOf('day').toDate().getDate();

				// let className = (this.isNeedDayFromPreviousMonth(week) || this.isNeedDayFromNextMonth(week)) && !week[day]
				// 	? 'calendar__day calendar__day_disabled'
				// 	: 'calendar__day';

				// if (week[day] && week[day].date) {
				// 	className += week[day] && week[day].date.getDate() === this.currentDay
				// 		? ' calendar__day_selected'
				// 		: '';
				// }

				// if (week[day] && week[day].date && this.events[`${this.month}-${week[day].date.getDate()}`]) {
				// 	className += ' calendar__day_has-event';
				// }

				this.isNeedDayFromPreviousMonth(week) && !week[day] && days.push(
					<CalendarDay day={dayFromPreviousMonth} onSelectDay={this.selectDay}
						className={{
							'calendar__day': true,
							'calendar__day_disabled': this.isDisabledDay(week, day),
							'calendar__day_selected': this.isSelectedDay(week, day),
							'calendar__day_has-event': this.isEventDay(week, day),
						}} />
				);
				
				week[day] && days.push(
					<CalendarDay day={week[day].date.getDate()} onSelectDay={this.selectDay}
					className={{
							'calendar__day': true,
							'calendar__day_disabled': this.isDisabledDay(week, day),
							'calendar__day_selected': this.isSelectedDay(week, day),
							'calendar__day_has-event': this.isEventDay(week, day),
						}} />
				);

				this.isNeedDayFromNextMonth(week) && !week[day] && days.push(
					<CalendarDay day={dayFromNextMonth} onSelectDay={this.selectDay}
					className={{
							'calendar__day': true,
							'calendar__day_disabled': this.isDisabledDay(week, day),
							'calendar__day_selected': this.isSelectedDay(week, day),
							'calendar__day_has-event': this.isEventDay(week, day),
						}} />
				)

				missingDaysOfWeek -= 1;
			}

			return days;
	}

	getWeeks () {
		return Object.values(this.yearData[this.month].weeks).map((week) => {
			return (
				<div class='calendar__week'>
					{this.getDays(week)}
				</div>
			)
		})
	}

	getWeekdays() {
		return this.weekDays.map((day) => (
			<div class='calendar__day calendar__day_weekday'>
				<span>{day}</span>
			</div>	
		))
	}

	showPreviousMonth() {
		if (!this.isStartOfYear()) {
			this.month -= 1;
		}
	}

	showNextMonth() {
		if (!this.isEndOfYear()) {
			this.month += 1;
		}
	}

	render() {
		return (
			<div class='calendar'>
				<div class='calendar__month'>
					<div class='calendar__header'>
						<h3 class='calendar__title'>{this.yearData[this.month].title} {this.year}</h3>
						<div class='calendar__nav'>
							<div
								class='calendar__nav-button calendar__nav-button_left'
								disabled={this.isStartOfYear()}
								onClick={this.showPreviousMonth}
							>&lt;</div>
							<div
								class='calendar__nav-button calendar__nav-button_right'
								disabled={this.isEndOfYear()}
								onClick={this.showNextMonth}
							>&gt;</div>
						</div>
					</div>
					<div class='calendar__week'>
						{this.getWeekdays()}
					</div>
					{this.getWeeks()}
				</div>
			</div>
		)
	}
}
