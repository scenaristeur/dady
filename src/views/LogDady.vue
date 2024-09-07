<template>
  <div><button @click="logDady">log Dady</button></div>
</template>

<script>
export default {
  name: "LogDady",
  methods: {
    logDady() {
      this.$store.dispatch("core/logDady");
    },
  },
  computed: {
    dady() {
      return this.$store.state.dady;
    },
  },
};
</script>

<style scoped></style>
