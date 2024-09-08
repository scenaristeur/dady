<template>
  <div v-if="message">
    Message: {{ message.status }}, {{ message.statusText }}, {{ message.message }}
    <span v-if="message.status == 501">, {{ message.response.data }}, </span>
    <span v-if="message.headers"
      ><a
        :href="message.headers.location"
        v-if="message.headers.location"
        target="_blank"
      >
        {{ message.headers.location }}</a
      ><br />

      <!-- {{ message.headers.link }} -->
    </span>
    <!-- <a :href="message.location" v-if="message.location" target="_blank">{{
      message.location
    }}</a>
    <br />
    {{ message.state }} -->
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
