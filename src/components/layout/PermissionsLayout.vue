<template>
  <div
    class="alert alert-primary"
    role="alert"
    :show="url != undefined && autorized == false && pod != null"
  >
    You have no explicit 'append/write' permission, to
    <a :href="url" target="_blank"> URL </a><br />

    <div class="row">
      <div class="col" v-for="(p, name) of permissions" :key="name">
        <b>{{ name }}</b
        >:
        <span
          v-for="(val, type) of p"
          :key="type"
          :class="val == true ? 'bg-success text-white' : 'bg-danger text-white'"
        >
          {{ type }}
        </span>
      </div>
    </div>
    "Save Node" will fork this node on your pod.
  </div>
</template>

<script>
export default {
  name: "PermissionsLayout",
  props: ["permissions", "url", "autorized"],
  computed: {
    pod() {
      return this.$store.state.solid.pod;
    },
  },
};
</script>
