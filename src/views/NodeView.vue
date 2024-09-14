<template>
  <!-- <div v-if="currentNode">
    <h2>{{ currentNode["@id"] }}</h2>
    <NodeLayout :node="currentNode" />
  </div> -->
  <div v-if="node">
    ++++++++++++++++++++++++++*****************NODE VIEW
    <div class="alert alert-light" role="alert">
      type: {{ typeof node }} , isArray: {{ Array.isArray(node) }}
    </div>

    <NodeLayout
      v-if="node && typeof node == 'object' && !Array.isArray(node)"
      :node="node"
    />

    <!-- <ul class="list-group">
      <li v-for="(v, k) in node" :key="k" class="list-group-item">
        {{ k }} :

        <ArrayLayout v-if="Array.isArray(v)" :node="v" />
      </li>
    </ul> -->
    <pre v-else>{{ node }}</pre>
    *****************END VIEW LAYOUT
    ++++++++++++++++++++++++++++################################
  </div>
</template>

<script>
import NodeLayout from "@/components/layout/NodeLayout.vue";

export default {
  name: "NodeView",
  components: {
    NodeLayout,
  },
  methods: {
    async select(id) {
      this.$store.dispatch("core/select", id);
    },
  },
  computed: {
    node() {
      return this.$store.state.nodes.currentNode;
    },
  },
};
</script>

<style scoped></style>
