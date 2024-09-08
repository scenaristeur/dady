<template>
  <div>
    <h1>Solid Resource CRUD</h1>

    <button @click="reset">Reset</button><br />
    <b> GET: Retrieving containers</b>
    <br />
    <small>url MUST end with a '/'!</small><br />
    <button @click="example_GET_container_jsonld">GET container in jsonld</button>
    <button @click="example_GET_container_turtle">(GET container in turtle)</button>

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
    <button @click="example_PUT_json">PUT json file</button
    ><button @click="example_PUT_jsonld">PUT jsonld file</button>
    <br />
    <b>POST: Creating resources at a generated URL</b><br />
    <small
      >the container MUST exist before! For now, you can PUT and delete a resource in a
      container to create this container.</small
    >
    <br />
    <button @click="example_POST_text">POST plain text file</button>
    <button @click="example_POST_turtle">POST turtle file</button>
    <button @click="example_POST_json">POST json file</button
    ><button @click="example_POST_jsonld">POST jsonld file</button>
    <br />
    <b> GET: Retrieving resources </b>
    <br />
    <button @click="example_GET_text">GET plain text file</button>
    <button @click="example_GET_turtle">GET turtle file</button>
    <button @click="example_GET_json">GET json file</button
    ><button @click="example_GET_jsonld">GET jsonld file</button>
    <br />

    DELETE: Deleting resources in browser
    <br />
    PATCH: Modifying resources<br />
    HEAD: Retrieve resources headers<br />
    OPTIONS: Retrieve resources communication options<br />
    TODO: create recursive containers<br />

    <h2>Show with criteres</h2>
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
      this.params.url = "";
      this.params.headers["Content-Type"] = "text/plain";
      this.resource = {
        content: "bidule",
      };
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
    example_POST_turtle() {
      this.params.method = "POST";
      this.params.url = "";
      this.params.headers["Content-Type"] = "text/turtle";
      this.resource = {
        content: "<ex:s> <ex:p> <ex:o>.",
      };
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
    example_POST_json() {
      this.params.method = "POST";
      this.params.url = "";
      this.params.headers["Content-Type"] = "application/json";
      let content = JSON.stringify({ nimp: "swing", swop: "tchiboo" }, null, 2);
      this.resource = {
        content: content,
      };
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
    example_POST_jsonld() {
      this.params.method = "POST";
      this.params.url = "";
      this.params.headers["Content-Type"] = "application/ld+json";
      let content = JSON.stringify(
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
      this.resource = {
        content: content,
      };
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
    // GET
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
    example_GET_container_turtle() {
      this.resource.content = "";
      this.params.method = "GET";
      this.params.url = "/";
      this.params.headers["Accept"] = "text/turtle";
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
    example_GET_container_jsonld() {
      this.resource.content = "";
      this.params.method = "GET";
      this.params.url = "/";
      this.params.headers["Accept"] = "application/ld+json";
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
