import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './assets/main.css'

import { createApp, ref } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import JsonEditorVue from 'json-editor-vue'

  const app = createApp(App,{
        setup: () => ({
          value: ref(),
        }),
      })

app.use(router)
app.use(store)
app.use(JsonEditorVue, {
  // global props & attrs (one-way data flow)
})
app.mount('#app')
