import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './assets/main.css'

import { createApp, ref } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import JsonEditorVue from 'json-editor-vue'

// import CKEditor from '@ckeditor/ckeditor5-vue2';

import Graph3dPlugin from './plugins/graph3d-plugin'

const app = createApp(App, {
  setup: () => ({
    value: ref()
  })
})

app.use(router)
app.use(store)
app.use(JsonEditorVue, {
  // global props & attrs (one-way data flow)
})
app.use(Graph3dPlugin, { store: store })
// app.use( CKEditor );
app.mount('#app')
