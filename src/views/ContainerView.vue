<template>
  <div v-if="container">
    <hr />
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
            {{ r }}
          </span>
          <button
            v-if="r['@id'] != 'http://localhost:3000/index.html'"
            @click="remove(r['@id'])"
          >
            Delete
          </button>
        </li>
      </ul>
    </div>
    <!-- {{ message }} -->
    History: {{ history }}
    <!-- <hr />
    Container : {{ container }}
    <hr /> -->
  </div>
</template>

<script>
export default {
  name: "ContainerView",
  data() {
    return {
      container: null,
      history: [],
      ordered: [],
      up: null,
    };
  },
  methods: {
    async select(e) {
      //   console.log(e.target.id);

      this.$store.dispatch("core/select", e.target.id);
    },
    async remove(id) {
      console.log("remove ", id);
      await this.$store.dispatch("core/remove", id);
      await this.$store.dispatch("core/select", this.container["@id"]);
    },
  },

  watch: {
    message() {
      // console.log("LE MESSAGE CONTAINER", Object.assign({}, this.message));
      // "http://www.w3.org/ns/pim/space#Storage", "http://www.w3.org/ns/ldp#Container", "http://www.w3.org/ns/ldp#BasicContainer", "http://www.w3.org/ns/ldp#Resource"
      // if (
      //   typeof this.message.message.data == "object" &&
      //   this.message.message.data[0] != undefined &&
      //   this.message.message.data[0]["@type"].includes(
      //     "http://www.w3.org/ns/ldp#Container"
      //   )
      // ) {
      //   this.container = this.message.message.data[0];
      //   this.ordered =
      //     this.container["http://www.w3.org/ns/ldp#contains"] &&
      //     this.container["http://www.w3.org/ns/ldp#contains"].reverse();
      //   this.history.push(this.container["@id"]);
      //   this.up = this.container["@id"].split("/").slice(0, -2).join("/") + "/";
      //   console.log("up", this.up);
      // }
      // else {
      //   this.container = null;
      // }
    },
  },
  computed: {
    message() {
      return this.$store.state.core.message;
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
