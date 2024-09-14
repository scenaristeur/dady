<template>
  <span>
    <!-- RESOURCE : {{ node }} -->

    <button class="btn btn-info btn-sm" @click="select(node)">
      {{ node.split("/").pop() }}
    </button>
    <small
      ><i
        ><a :href="node" target="_blank">{{ node }}</a></i
      ></small
    >
  </span>
</template>

<script>
export default {
  name: "ResourceLayout",
  props: ["node"],
  methods: {
    async select(id) {
      this.$store.dispatch("core/select", id);
    },
  },
};
</script>

<style scoped></style>
