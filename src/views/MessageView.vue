<template>
  <div>
    <a :href="message.location" v-if="message.location" target="_blank">{{
      message.location
    }}</a>
    <br />
    {{ message }}
  </div>
</template>

<script>
export default {
  name: "MessageView",
  computed: {
    message() {
      return this.$store.state.core.message;
    },
  },
};
</script>

<style scoped></style>
