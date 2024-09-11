<template>
  <div v-if="container">
    <!-- deb cont .message.data[0]["@type"] -->

    <h2>{{ container["@id"] }}</h2>
    <div v-if="up != undefined" :id="up" @click="select">up : {{ up }}</div>
    <div :id="history.slice(-2, -1)[0]" @click="select">
      prev : {{ history.slice(-2, -1)[0] }}
    </div>
    <div class="containerBox">
      <ul>
        <li v-for="r in ordered" :key="r">
          <span :id="r['@id']" @click="select">
            {{ r["@id"] }}
          </span>
          <button
            v-if="r['@id'] != 'http://localhost:3000/index.html'"
            @click="remove(r['@id'])"
          >
            Delete
          </button>

          <a :href="r['@id']" target="_blank">--></a>
        </li>
      </ul>
    </div>
    <!-- {{ message }} -->
    History: {{ history[(-3, -1)] }}
    <hr />
    <!-- Container : {{ container }} -->
    <hr />
  </div>
</template>

<script>
export default {
  name: "ContainerView",
  data() {
    return {
      history: [],
      ordered: [],
      up: null,
    };
  },
  methods: {
    async select(e) {
      this.$store.dispatch("core/select", e.target.id);
    },
    async remove(id) {
      console.log("remove ", id);
      await this.$store.dispatch("core/remove", id);
      await this.$store.dispatch("core/select", this.container["@id"]);
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
        }

        this.history.push(this.container["@id"]);
        this.up = this.container["@id"].split("/").slice(0, -2).join("/") + "/";
        console.log("up", this.up);
      }
    },
  },
  computed: {
    container() {
      return this.$store.state.core.container;
    },
  },
};
</script>

<style scoped>
.containerBox {
  /*max-height: 400px;*/
  height: 500px;
  overflow-y: scroll;
  padding: 0 16px;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  flex-grow: 1;
}
</style>
