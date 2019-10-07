import { Component, Vue } from 'vue-property-decorator';
import Calendar from './components/calendar/Calendar';
import TaskList from './components/taskList/TaskList';

import './App.css'

@Component
export default class App extends Vue {
  render() {
    return (
      <div id="app">
        <Calendar />
        <TaskList />
      </div>
    )
  }
}
