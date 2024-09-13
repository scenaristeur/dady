<template>
  <div>
    {{ currentPropLocal.name }}

    {{ currentPropLocal.values }}

    <div class="container-fluid" v-if="container">
      <div class="row">
        <button class="btn btn-primary col" @click="select(params.baseURL)">
          base: {{ params.baseURL }}
        </button>
        <button class="btn btn-primary col" @click="select(up)" v-if="up != 'http://'">
          up: {{ up }}
        </button>
        <button class="btn btn-primary col" @click="select(container['@id'])">
          {{ container["@id"] }}
        </button>
        <hr />
        <button class="btn btn-primary" @click="select('')">
          Use this container as resource
        </button>
      </div>
      <!-- {{ container }} -->

      <!-- <div class="row">
      <div class="col">
        Column
      </div>
      <div class="col">
        Column
      </div>
      <div class="col">
        Column
      </div>
      <hr>
    </div> -->

      <!-- <div class="row">
      <div class="col">
        Column
      </div>
      <div class="col">
        Column
      </div>
      <div class="col">
        Column
      </div>
    </div>
    <hr> -->
      <div class="row">
        <div class="col" v-for="r in ordered" :key="r['@id']">
          <button
            v-if="r['@id'].endsWith('/')"
            type="button"
            class="btn btn-warning"
            @click="select(r['@id'])"
          >
            {{ r["@id"].split("/").slice(-2, -1)[0] + "/" }}
          </button>
          <button v-else type="button" class="btn btn-info" @click="select(r['@id'])">
            {{ r["@id"].split("/").pop() }}
          </button>
        </div>
      </div>
      <hr />
      <!-- {{ container[ "http://www.w3.org/ns/ldp#contains"] }} -->
    </div>
  </div>
</template>

<script>
export default {
  name: "NodeSelector",
  props: ["currentProp"],
  model: {
    // https://stackoverflow.com/questions/39868963/vue-2-mutating-props-vue-warn
    prop: "currentProp",
    event: "currentPropChange",
  },
  data() {
    return { history: [], up: null, ordered: [] };
  },
  methods: {
    async select(id) {
      if (id.endsWith("/")) {
        this.$store.dispatch("core/select", id);
      } else if (id == "") {
        console.log("selecting container", this.container["@id"]);
        this.currentPropLocal.values.push({ "@id": this.container["@id"] });
      } else {
        console.log("selecting", id);
        this.currentPropLocal.values.push({ "@id": id });
      }
    },
  },
  watch: {
    container() {
      //"http://www.w3.org/ns/pim/space#Storage", "http://www.w3.org/ns/ldp#Container", "http://www.w3.org/ns/ldp#BasicContainer", "http://www.w3.org/ns/ldp#Resource"
      if (
        this.container &&
        this.container["@type"].includes("http://www.w3.org/ns/ldp#Container")
      ) {
        if (this.container["http://www.w3.org/ns/ldp#contains"] != undefined) {
          this.ordered = this.container["http://www.w3.org/ns/ldp#contains"].reverse();
        } else {
          this.ordered = [];
        }
        this.history.push(this.container["@id"]);
        this.up = this.container["@id"].split("/").slice(0, -2).join("/") + "/";
        // console.log("up", this.up);
      }
    },
  },
  computed: {
    currentPropLocal: {
      get: function () {
        return this.currentProp;
      },
      set: function (value) {
        this.$emit("currentPropChange", value);
      },
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
  },
};
</script>
