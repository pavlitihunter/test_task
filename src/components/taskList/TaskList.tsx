import { Component, Prop } from 'vue-property-decorator';
import { VueComponent } from '../../shims-vue';
import { useStore } from 'vuex-simple';

import { MyStore } from '@/store/store';

import './taskList.css'

@Component
export default class TaskList extends VueComponent {

	public store: MyStore = useStore(this.$store);

  public get currentDate() {
    return this.store.currentDate;
  }

  public get events() {
    return this.store.events;
  }

  public saveEvent() {
    this.store.saveEvent({
    	time: this.time,
    	text: this.text,
    });
  }

	isAddState = false;
	isTimeValid = false;
	time = '';
	text = '';

	resetDate() {
		this.time = '';
		this.text = '';
		this.isTimeValid = false;
	}

	showTaskAddTool() {
		this.isAddState = true;
	}

	hideTaskAddTool() {
		this.isAddState = false;
		this.resetDate();
	}

	saveTask() {
		if (!this.isTimeValid) return;
		this.saveEvent();
		this.hideTaskAddTool();
	}

	validationTime() {
		const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/;

		let validationPromise = new Promise((resolve, reject) => {
			setTimeout(() => {
				if (this.time.match(timeRegex)) resolve();
				reject();
			}, 2000);
		});

		validationPromise.then((data) => {
			this.isTimeValid = true;
		}).catch((error) => {
			alert('Пожалуйста, введите время в формате ЧЧ:ММ');
		});
	}

	getEventsList() {
		if (!this.events[this.currentDate]) return;

		return this.events[this.currentDate].map((event: any) => {
			return (
				<div class="task-list__events-item">
					<span class="task-list__events-time">{event.time}</span>
					<span class="task-list__events-text">{event.text}</span>
				</div>
			)
		});
	}

	render() {
		return (
			<div class="task-list">
				<h3 class="task-list__title">События</h3>
				<div class="task-list__content">
					<div class="task-list__events">
						{this.getEventsList()}
					</div>
					{this.isAddState && 
						<div class="task-list__fields">
							<input
								v-time-mask={this.time}
								name="time"
								type="text"
								maxlength="5"
								placeholder="Время"
								class="task-list__field task-list__field-time"
								v-model={this.time}
								onChange={this.validationTime}
							/>
							<input
								name="time"
								type="text"
								placeholder="Текст"
								class="task-list__field task-list__field-text"
								v-model={this.text}
								disabled={!this.isTimeValid}
							/>
						</div>
					}
					<div class="task-list__buttons">
						{!this.isAddState && <button class="task-list__button task-list__button_add" onClick={this.showTaskAddTool}>Добавить</button>}
						{this.isAddState && <button class="task-list__button task-list__button_cancel" onClick={this.hideTaskAddTool}>Отмена</button>}
						{this.isAddState && <button class="task-list__button task-list__button_save" onClick={this.saveTask}>Сохранить</button>}
					</div>
				</div>
			</div>
		)
	}
}