<template>
  <div>
    <h1>Solid Resource CRUD</h1>

    <button @click="reset">Reset</button><br />
    <b> GET: Retrieving containers</b>
    <br />
    <small>url MUST end with a '/'!</small><br />
    <button @click="example_GET_container_jsonld">GET container in jsonld</button>
    <button @click="example_GET_container_turtle">(GET container in turtle)</button>
    <button @click="example_create_container">Create container</button>
    <br />
    <b>PUT: Creating resources for a given URL</b>
    <a
      href="https://communitysolidserver.github.io/CommunitySolidServer/latest/usage/example-requests/"
      target="_blank"
      rel="noopener"
      >example</a
    ><br />

    <button @click="example_PUT_text">PUT plain text file</button>
    <button @click="example_PUT_turtle">PUT turtle file</button>
    <button @click="example_PUT_json">PUT json file</button>
    <button @click="example_PUT_jsonld">PUT jsonld file</button>
    <br />
    <b>POST: Creating resources at a generated URL</b><br />
    <small
      >the container MUST exist before! For now, you can PUT and delete a resource in a
      container to create this container.</small
    >
    <br />

    <button type="button" class="btn btn-success" @click="example_POST_text">
      POST plain text file
    </button>
    <button @click="example_POST_turtle">POST turtle file</button>
    <button @click="example_POST_json">POST json file</button>
    <button @click="example_POST_jsonld">POST jsonld file</button>
    <br />
    <b> GET: Retrieving resources </b>
    <br />
    <button @click="example_GET">GET</button>
    should transform en radio
    <button @click="example_GET_text">GET plain text file</button>
    <button @click="example_GET_turtle">GET turtle file</button>
    <button @click="example_GET_json">GET json file</button>
    <button @click="example_GET_jsonld">GET jsonld file</button>
    <br />

    DELETE: Deleting resources in browser
    <br />
    PATCH: Modifying resources<br />
    <button @click="example_patch_n3">PATCH N3</button>
    <button @click="example_patch_sparql">PATCH SPARQL</button>
    <br />
    HEAD: Retrieve resources headers<br />
    <button @click="example_head">HEAD</button><br />
    OPTIONS: Retrieve resources communication options<br />
    <button @click="example_options">OPTIONS</button><br />
    TODO: create recursive containers<br />

    <h2>Show with criteres</h2>
    <!-- Button trigger modal -->
    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
    >
      Launch demo modal
    </button>

    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
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
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>

    <!-- RESULT : {{ result }} -->
  </div>
</template>

<script>
export default {
  name: "ResourceCrud",
  data() {
    return {
      //   result: null,
      // params: {
      //   method: "GET",
      //   headers: { "Content-Type": "", Accept: "" },
      //   // options: {},
      //   // body: {},
      //   // query: {},
      //   baseURL: "http://localhost:3000",
      //   url: "",
      // },
      // resource: {
      //   id: "",
      //   name: "",
      //   content: "",
      // },
    };
  },
  created() {
    // this.example_GET_container_jsonld();
  },
  methods: {
    reset() {
      let params = {
        headers: {
          "Content-Type": "text/plain",
        },
        method: "GET",
        url: "",
      };
      let resource = { content: "" };
      this.$store.commit("core/setMessage", { params: params, resource: resource });
    },

    // PUT
    example_PUT_text() {
      this.params.method = "PUT";
      this.params.url = "myfile.txt";
      this.params.headers["Content-Type"] = "text/plain";
      this.resource.content = "bidule";
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
    example_PUT_turtle() {
      this.params.method = "PUT";
      this.params.url = "myfile.ttl";
      this.params.headers["Content-Type"] = "text/turtle";
      this.resource.content = "<ex:s> <ex:p> <ex:o>.";
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
    example_PUT_json() {
      this.params.method = "PUT";
      this.params.url = "myfile.json";
      this.params.headers["Content-Type"] = "application/json";
      this.resource.content = JSON.stringify({ nimp: "swing", swop: "tchiboo" }, null, 2);

      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
    example_PUT_jsonld() {
      this.params.method = "PUT";
      this.params.url = "myfile.jsonld";
      this.params.headers["Content-Type"] = "application/ld+json";
      this.resource.content = JSON.stringify(
        {
          "@context": "https://json-ld.org/contexts/person.jsonld",
          "@id": "http://dbpedia.org/resource/John_Lennon",
          name: "John Lennon",
          born: "1940-10-09",
          spouse: "http://dbpedia.org/resource/Cynthia_Lennon",
        },
        null,
        2
      );
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
    //POST
    example_POST_text() {
      this.params.method = "POST";
      this.params.url = "/";
      this.params.headers["Content-Type"] = "text/plain";
      this.resource.content = "bidule";
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
    example_POST_turtle() {
      this.params.method = "POST";
      this.params.url = "/";
      this.params.headers["Content-Type"] = "text/turtle";
      this.resource.content = "<ex:s> <ex:p> <ex:o>.";
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
    example_POST_json() {
      this.params.method = "POST";
      this.params.url = "/";
      this.params.headers["Content-Type"] = "application/json";
      this.resource.content = JSON.stringify({ nimp: "swing", swop: "tchiboo" }, null, 2);
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
    example_POST_jsonld() {
      this.params.method = "POST";
      this.params.url = "/";
      this.params.headers["Content-Type"] = "application/ld+json";
      this.resource.content = JSON.stringify(
        {
          "@context": "https://json-ld.org/contexts/person.jsonld",
          "@id": "http://dbpedia.org/resource/John_Lennon",
          name: "John Lennon",
          born: "1940-10-09",
          spouse: "http://dbpedia.org/resource/Cynthia_Lennon",
        },
        null,
        2
      );
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
    // GET
    example_GET() {
      this.resource.content = "";
      this.params.method = "GET";
      this.params.url = "myfile.txt";
      this.params.headers["Accept"] = "*";
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
    example_GET_text() {
      this.resource.content = "";
      this.params.method = "GET";
      this.params.url = "myfile.txt";
      this.params.headers["Accept"] = "text/plain";
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
    example_GET_turtle() {
      this.resource.content = "";
      this.params.method = "GET";
      this.params.url = "myfile.ttl";
      this.params.headers["Accept"] = "text/turtle";
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
    example_GET_json() {
      this.resource.content = "";
      this.params.method = "GET";
      this.params.url = "myfile.json";
      this.params.headers["Accept"] = "application/json";
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
    example_GET_jsonld() {
      this.resource.content = "";
      this.params.method = "GET";
      this.params.url = "myfile.jsonld";
      this.params.headers["Accept"] = "application/ld+json";
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
    // GET CONTAINER
    async example_GET_container_jsonld() {
      this.resource.content = "";
      this.params.method = "GET";
      this.params.url = "/";
      this.params.headers["Accept"] = "application/ld+json";
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
      await this.$store.dispatch("core/create_or_update", {
        params: this.params,
        resource: this.resource,
      });
    },
    async example_GET_container_turtle() {
      this.resource.content = "";
      this.params.method = "GET";
      this.params.url = "/";
      this.params.headers["Accept"] = "text/turtle";
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
      await this.$store.dispatch("core/create_or_update", {
        params: this.params,
        resource: this.resource,
      });
    },
    //PATCH
    example_patch_n3() {
      this.resource.content = `@prefix solid: <http://www.w3.org/ns/solid/terms#>. 
      _:rename a solid:InsertDeletePatch;
       solid:inserts { <ex:s2> <ex:p2> <ex:o2>. }.`;
      this.params.method = "PATCH";
      this.params.url = "myfile.ttl";
      this.params.headers["Content-Type"] = "text/n3";
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
    example_patch_sparql() {
      this.resource.content = "INSERT DATA { <ex:s2> <ex:p2> <ex:o2> }";
      this.params.method = "PATCH";
      this.params.url = "myfile.ttl";
      this.params.headers["Content-Type"] = "application/sparql-update";
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
    example_head() {
      this.params.method = "HEAD";
      this.params.url = "myfile.txt";
      // this.params.headers["Accept"] = "text/plain";
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
    example_options() {
      this.params.method = "OPTIONS";
      this.params.url = "myfile.txt";
      // this.params.headers["Accept"] = "text/plain";
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
    example_create_container() {
      //https://communitysolidserver.github.io/CommunitySolidServer/latest/usage/metadata/#example-of-a-workflow-for-editing-a-description-resource
      this.params.url = "foo/";
      this.params.method = "PUT";
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
  },
  // watch: {
  //   message() {
  //     // "http://www.w3.org/ns/pim/space#Storage", "http://www.w3.org/ns/ldp#Container", "http://www.w3.org/ns/ldp#BasicContainer", "http://www.w3.org/ns/ldp#Resource"
  //     //   if (
  //     //     typeof this.message.message.data == "object" &&
  //     //     this.message.message.data[0] != undefined &&
  //     //     this.message.message.data[0]["@type"].includes(
  //     //       "http://www.w3.org/ns/ldp#Container"
  //     //     )
  //     //   ) {
  //     //     this.container = this.message.message.data[0];
  //     //   } else {
  //     //     this.container = null;
  //     //   }
  //     //   console.log("LE MESSAGE RESOURCE", Object.assign({}, this.message));
  //     // console.log(this.result);
  //   },
  // },
  computed: {
    params() {
      return this.$store.state.core.params;
    },
    resource() {
      return this.$store.state.core.resource;
    },
  },
};
</script>

<style scoped></style>
