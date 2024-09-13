<template>
  <div>
    Graph nodes {{ nodes }} nodes
    <div id="graph" width="100px" ref="graph">Loading graph...</div>
  </div>
</template>

<script>
export default {
  name: "GraphView.vue",

  mounted() {
    this.$graphInit({ domElement: this.$refs.graph, test: true });
    // this.test();
  },
  methods: {
    update() {
      if (this.graph != undefined) {
        let nodes = this.nodes.map((a) => {
          return { ...a };
        });
        let links = this.links.map((a) => {
          return { ...a };
        });
        this.graph.graphData({ nodes: nodes, links: links });
        console.log(this.graph.graphData());
      }
    },
  },
  watch: {
    nodes() {
      this.update();
    },
    links() {
      this.update();
    },
    graph() {
      this.update();
    },
  },
  computed: {
    nodes() {
      return this.$store.state.core.nodes;
    },
    links() {
      return this.$store.state.core.links;
    },
    graph() {
      return this.$store.state.core.graph;
    },
  },
};
</script>

<style>
.node-label {
  font-size: 12px;
  padding: 1px 4px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  user-select: none;
}
</style>
