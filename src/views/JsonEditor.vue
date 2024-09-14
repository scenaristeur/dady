<template>
  <!-- <div><button @click="logDady">log Dady</button></div> -->
  <div>
    !!! Don't edit in "text mode" !!!
    <json-editor-vue
      v-model="value"
      class="jse-theme-dark"
      :onChange="
        (updatedContent) => {
          value = updatedContent;
        }
      "
    ></json-editor-vue>
  </div>
</template>

<script>
import JsonEditorVue from "json-editor-vue";
import "vanilla-jsoneditor/themes/jse-theme-dark.css";

export default {
  name: "JsonEditor",
  components: { JsonEditorVue },
  // data() {
  //         return {
  //           value: {name: "bob"},
  //         }
  //       },
  data() {
    return {
      value: "",
    };
  },
  methods: {
    logDady() {
      this.$store.dispatch("core/logDady");
    },
    async update() {
      let string = JSON.stringify(this.value.json, null, 2);
      console.log(string);
      if (string.length > 0) {
        this.resource.content = JSON.stringify(this.value.json, null, 2);
        this.params.headers["Content-Type"] = "application/ld+json";
        this.$store.commit("core/setParams", this.params);
        this.$store.commit("core/setResource", this.resource);
        console.log(Object.assign({}, this.params), Object.assign({}, this.resource));
        await this.$store.dispatch("core/create_or_update");
      }
    },
  },
  watch: {
    content() {
      this.value = this.content;
    },
    async value(new_value, old_value) {
      console.info(
        "old",
        Object.assign({}, old_value),
        "new",
        Object.assign({}, new_value)
      );

      if (new_value.json && new_value.json != this.resource.content) {
        console.info("---------------------update");
        this.update();
      }
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
    content() {
      console.log(typeof this.$store.state.core.resource.content);
      try {
        return JSON.parse(this.$store.state.core.resource.content);
      } catch (e) {
        return this.$store.state.core.resource.content;
      }
    },
  },
};
</script>

<style scoped></style>
