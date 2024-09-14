<template>
  <span
    ><a :href="node" target="_blank">{{ node }}</a></span
  >
</template>

<script>
export default {
  name: "LinkLayout",
  props: ["node"],
};
</script>

<style scoped></style>
