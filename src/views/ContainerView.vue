<template>
  <div v-if="container">
    <hr />
    <!-- deb cont .message.data[0]["@type"] -->
    <h2>{{ container["@id"] }}</h2>
    <div class="containerBox">
      <ul>
        <li
          v-for="r in container['http://www.w3.org/ns/ldp#contains']"
          :key="r"
          :id="r['@id']"
          @click="select"
        >
          {{ r }}
        </li>
      </ul>
    </div>
    <!-- {{ message }} -->
    History: {{ history }}
    <hr />
    Container : {{ container }}
    <hr />
  </div>
</template>

<script>
export default {
  name: "ContainerView",
  data() {
    return {
      container: null,
      history: [],
    };
  },
  methods: {
    select(e) {
      //   console.log(e.target.id);

      this.$store.dispatch("core/select", e.target.id);
    },
  },

  watch: {
    message() {
      console.log("LE MESSAGE CONTAINER", Object.assign({}, this.message));
      // "http://www.w3.org/ns/pim/space#Storage", "http://www.w3.org/ns/ldp#Container", "http://www.w3.org/ns/ldp#BasicContainer", "http://www.w3.org/ns/ldp#Resource"
      if (
        typeof this.message.message.data == "object" &&
        this.message.message.data[0] != undefined &&
        this.message.message.data[0]["@type"].includes(
          "http://www.w3.org/ns/ldp#Container"
        )
      ) {
        this.container = this.message.message.data[0];
        this.history.push(this.container["@id"]);
      }
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
