<template>
  <div><button @click="logDady">log Dady</button>
  
  
    <button
      type="button"
      class="btn btn-success"
      data-bs-toggle="modal"
      data-bs-target="#NodeModal"
    >
      New Node Brain
    </button>

    <!-- Modal -->
    <div
      class="modal fade"
      id="NodeModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Node</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">...</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button type="button" class="btn btn-primary" @click="newNode">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  
  </div>
</template>

<script>
export default {
  name: "LogDady",
  methods: {
    logDady() {
      this.$store.dispatch("core/logDady");
    },
  },
  // computed: {
  //   dady() {
  //     return this.$store.state.core.dady;
  //   },
  // },
};
</script>

<style scoped></style>
