import Vue from 'vue'
import App from './App'
import store from './store/index'

Vue.config.productionTip = false

Vue.directive('timeMask', {
  update (el, binding) {
    if (binding.value.length >= 2) {
    	// @ts-ignore
    	let temp = el.value.split('');
    	if (temp.indexOf(':') === -1) {
    		temp.splice(2, 0, ':');
    	}

    	// @ts-ignore
    	el.value = temp.join('');
	  }

    if (binding.value.length >= 5) {
      el.blur();
    }
  },
})

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
