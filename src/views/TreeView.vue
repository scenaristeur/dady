<template>
  <div class="container-fluid" v-if="container">
    <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
      <div class="btn-group me-2" role="group" aria-label="First group">
        <button class="col btn btn-dark btn-sm" @click="select(params.baseURL)">↖</button>
        <button
          class="col btn btn-dark btn-sm"
          @click="select(up)"
          v-if="up != 'http://'"
        >
          ⬆️ {{ up }}
        </button>
        <!-- <button type="button" class="btn btn-primary">3</button>
      <button type="button" class="btn btn-primary">4</button> -->
      </div>
      <!-- <div class="btn-group me-2" role="group" aria-label="Second group">
      <button type="button" class="btn btn-secondary">5</button>
      <button type="button" class="btn btn-secondary">6</button>
      <button type="button" class="btn btn-secondary">7</button>
    </div> -->
      <div>{{ container["@id"] }}</div>
      <!-- <div class="btn-group" role="group" aria-label="Third group">
      <button type="button" class="btn btn-info">8</button>
    </div> -->
    </div>

    <!-- <div class="container-fluid" v-if="container">
    <div class="row">

      <button class="col btn btn-dark" @click="select(up)" v-if="up != 'http://'">
        ⬆️ {{ up }}
      </button>
    </div> -->
    <!-- {{ container["@id"] }} -->
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
          class="btn btn-warning btn-sm"
          @click="select(r['@id'])"
        >
          {{ r["@id"].split("/").slice(-2, -1)[0] + "/" }}
        </button>
        <button
          v-else
          type="button"
          class="btn btn-info btn-sm"
          @click="select(r['@id'])"
        >
          {{ r["@id"].split("/").pop() }}
        </button>
      </div>
    </div>
    <hr />
    <!-- {{ container[ "http://www.w3.org/ns/ldp#contains"] }} -->
  </div>
</template>

<script>
export default {
  name: "TreeView.vue",
  data() {
    return {
      history: [],
      up: null,
    };
  },

  methods: {
    async select(id) {
      this.$store.dispatch("core/select", id);
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
          this.ordered = this.container["http://www.w3.org/ns/ldp#contains"];
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

<style scoped></style>
