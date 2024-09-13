<template>
  <ul class="list-group">
    <li class="list-group-item" v-for="(v,i) in values" :key="i">
      <div class="row">
      <div class="col">
      <span v-if="v.type == 'text'">{{v.value}}</span>
      <div v-else-if="v.type == 'textarea'">
        <pre>{{v.value}}</pre>
      </div>
      <NodeLite v-else-if="v.type == 'node'" :node="v" />
      <span v-else-if="v.type == 'link'">
        <a :href="v.value.href" target="_blank">{{v.value.name}}</a>
      </span>
      <div v-else>{{v}}</div>
    </div>
    <div class="col-2" >
      <!-- <b-button v-if="$router.currentRoute.path == '/edit'" variant="outline-secondary" @click="remove(i)">X</b-button> -->
       if edit <button @click="remove(i)">X</button>
    </div>
  </div>
</li>
  </ul>
</template>

<script>

import NodeLite from './NodeLite.vue'

export default {
name: 'ValuesComponent',
components: {
  NodeLite,
},
props: ['values'],
methods:{
  remove(i){
    console.log(i)
    let temp_values = this.values
    let values = temp_values.splice(i,1);
    console.log(values)
    this.$emit('update:values', values)
  }
}
}
</script>

<style>

</style>
