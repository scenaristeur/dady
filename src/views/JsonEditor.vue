<template>
  <!-- <div><button @click="logDady">log Dady</button></div> -->
  JSON EDIT : <json-editor-vue v-model="value" class="jse-theme-dark"></json-editor-vue>
</template>

<script>
    import JsonEditorVue from 'json-editor-vue'
    import 'vanilla-jsoneditor/themes/jse-theme-dark.css'

export default {
  name: "JsonEditor",
  components: { JsonEditorVue },
  // data() {
  //         return {
  //           value: {name: "bob"},
  //         }
  //       },
  methods: {
    logDady() {
      this.$store.dispatch("core/logDady");
    },
  },
  computed: {
    dady() {
      return this.$store.state.dady;
    },
    container() {
      return this.$store.state.core.container;
    },
    params() {
      return this.$store.state.core.params;
    },
    resource() {
      return this.$store.state.core.resource;
    },
    value() {
      console.log(typeof this.$store.state.core.resource.content)
      try{
        return  JSON.parse( this.$store.state.core.resource.content)
      } catch(e){
        this.$store.state.core.resource.content
      }
    },
  },
};
</script>

<style scoped></style>
