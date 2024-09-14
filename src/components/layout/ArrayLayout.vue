<template>
  <span>
    {{ node.length }}
    <div v-for="(n, i) in node" :key="i">
      <NodeLayout :node="n" />
    </div>
    <!-- <div v-for="n in node" :key="n['@id']">--{{ n }}--</div>
    <NodeLayout v-for="n in node" :key="n['@id']" :node="n" /> -->
  </span>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: "ArrayLayout",
  components: {
    NodeLayout: defineAsyncComponent(() => import("./NodeLayout.vue")),
  },

  props: ["node"],
};
</script>

<style scoped></style>
