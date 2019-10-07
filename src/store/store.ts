import { State, Mutation } from 'vuex-simple';

export class MyStore {
	@State()
	public currentDate = '';
	public events: any = {};

	@Mutation()
	public setCurrentDate(payload: any) {
		this.currentDate = payload.date;
	}

	@Mutation()
	public saveEvent(payload: any) {
		if (!this.events[this.currentDate]) {
			this.events[this.currentDate] = [];
		}

		this.events[this.currentDate].push({
			time: payload.time,
			text: payload.text,
		});
	}
}
