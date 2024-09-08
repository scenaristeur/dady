<template>
  <div>
    <b>Resource</b><br />
    <div v-if="params.method != 'PUT' && params.method != 'POST'">
      id: <input ref="id" v-model="resource.id" />
    </div>

    <div v-if="params.method != 'PUT' && params.method != 'POST'">
      name: <input ref="name" v-model="resource.name" />
    </div>
    <div style="width: 100%">
      <div>
        content:
        <textarea ref="content" v-model="resource.content" cols="40" rows="10" />
      </div>
    </div>
    <div>url: <input ref="url" v-model="params.url" /> todo : test if exists</div>
    <button @click="create_or_update">
      <!-- :disabled="
    resource.content.length == 0 &&
    params.method != 'GET' &&
    params.method != 'HEAD' &&
    params.method != 'OPTIONS' &&
    params.method != 'CREATE_CONTAINER'
  " -->
      Create / Update or Get
    </button>
    <hr />
    <b>Params /expert</b><br />
    baseURL: <input ref="baseURL" v-model="params.baseURL" /> <br />Content-Type:
    <input ref="content_type" v-model="params.headers['Content-Type']" />
    <br />
    <!-- {{ params }}<br />
    {{ resource }} -->
  </div>
</template>

<script>
export default {
  name: "ResourceView.vue",

  data() {
    return {
      //   result: null,
      // params: {
      //   method: "GET",
      //   headers: { "Content-Type": "", Accept: "" },
      //   // options: {},
      //   // body: {},
      //   // query: {},
      //   baseURL: "http://localhost:3000",
      //   url: "",
      // },
      // resource: {
      //   id: "",
      //   name: "",
      //   content: "",
      // },
    };
  },
  methods: {
    async create_or_update() {
      //   this.result = "WIP";
      if (
        this.params.headers["Content-Type"] &&
        this.params.headers["Content-Type"].endsWith("json")
      ) {
        console.log("is JSON");
        this.resource.content = JSON.parse(
          JSON.stringify(this.resource.content, null, 2)
        );
      }
      await this.$store.dispatch("core/create_or_update", {
        params: this.params,
        resource: this.resource,
      });
    },
  },
  // watch: {
  //   message() {
  //     console.log(Object.assign({}, this.message));
  //     this.params = this.message.params;
  //     this.resource = this.message.resource;
  //     // if (this.message.message.data) {
  //     //   if (typeof this.message.message.data == "object") {
  //     //     this.resource.content = JSON.stringify(this.message.message.data, null, 2);
  //     //   } else {
  //     //     this.resource.content = this.message.message.data;
  //     //   }
  //     // }
  //   },
  // },
  computed: {
    params() {
      return this.$store.state.core.params;
    },
    resource() {
      return this.$store.state.core.resource;
    },
  },
};
</script>

<style scoped></style>
