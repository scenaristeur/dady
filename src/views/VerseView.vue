<template>
  <div>
    VerseView
    <BrainsView />
    <NodesView />
  </div>
</template>

<script>
import NodesView from "./NodesView.vue";
import BrainsView from "./BrainsView.vue";

export default {
  name: "VerseView",
  components: { NodesView, BrainsView },
};
</script>

<style scoped></style>
