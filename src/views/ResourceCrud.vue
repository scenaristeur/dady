<template>
  <div>
    <h1>ResourceCrud</h1>

    <h2>Create or Update</h2>

    <table>
      <tr>
        <td>
          <b>Resource</b><br />
          <div v-if="params.method != 'PUT' && params.method != 'POST'">
            id: <input ref="id" v-model="resource.id" />
          </div>

          <div v-if="params.method != 'PUT' && params.method != 'POST'">
            name: <input ref="name" v-model="resource.name" />
          </div>
          <div>
            content:
            <textarea ref="content" v-model="resource.content" cols="40" rows="10" />
          </div>
          <div>url: <input ref="url" v-model="params.url" /> todo : test if exists</div>
          <button
            @click="create_or_update"
            :disabled="resource.content.trim().length == 0 && params.method != 'GET'"
          >
            Create or Update
          </button>

          <hr />
          <b>Params /expert</b><br />
          base_url: <input ref="base_url" v-model="params.base_url" /> <br />Content-Type:
          <input ref="content_type" v-model="params.headers['Content-Type']" />

          <button @click="last">Last</button>
          <button @click="get">Get</button>
        </td>
        <td>
          <button @click="reset">Reset</button><br />
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
            >the container MUST exist before! For now, you can PUT and delete a resource
            in a container to create this container.</small
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
          <b> GET: Retrieving containers</b>
          <br />
          <small>url MUST end with a '/'!</small><br />
          <button @click="example_GET_container_turtle">GET container in turtle</button>
          <button @click="example_GET_container_jsonld">GET container in jsonld</button>
          <br />
          DELETE: Deleting resources
          <br />
          PATCH: Modifying resources<br />
          HEAD: Retrieve resources headers<br />
          OPTIONS: Retrieve resources communication options<br />
          TODO: create recursive containers<br />

          <button @click="create_or_update">Create a plain text file:</button
          ><button @click="create_or_update">Create a plain text file:</button
          ><button @click="create_or_update">Create a plain text file:</button
          ><button @click="create_or_update">Create a plain text file:</button
          ><button @click="create_or_update">Create a plain text file:</button>
        </td>
      </tr>
    </table>

    <h2>Show with criteres</h2>
    RESULT : {{ result }}
  </div>
</template>

<script>
export default {
  name: "ResourceCrud",
  data() {
    return {
      result: null,
      params: {
        method: "GET",
        headers: { "Content-Type": "", Accept: "" },
        // options: {},
        // body: {},
        // query: {},
        base_url: "http://localhost:3000",
        url: "",
      },
      resource: {
        id: "",
        name: "",
        content: "",
      },
    };
  },
  methods: {
    reset() {
      this.params.headers["Content-Type"] = "text/plain";
      this.params.method = "GET";
      this.params.url = "";
      this.resource.content = "";
    },
    async create_or_update() {
      this.result = "WIP";
      if (this.params.headers["Content-Type"].endsWith("json")) {
        console.log("is JSON");
        this.resource.content = JSON.parse(
          JSON.stringify(this.resource.content, null, 2)
        );
      }
      this.result = await this.$store.dispatch("core/create_or_update", {
        params: this.params,
        resource: this.resource,
      });
      console.log(this.result);
      if (this.result.message.data) {
        if (typeof this.result.message.data == "object") {
          this.resource.content = JSON.stringify(this.result.message.data, null, 2);
        } else {
          this.resource.content = this.result.message.data;
        }
      }
    },
    // PUT
    example_PUT_text() {
      this.params.method = "PUT";
      this.params.url = "myfile.txt";
      this.params.headers["Content-Type"] = "text/plain";
      this.resource = {
        content: "bidule",
      };
    },
    example_PUT_turtle() {
      this.params.method = "PUT";
      this.params.url = "myfile.ttl";
      this.params.headers["Content-Type"] = "text/turtle";
      this.resource = {
        content: "<ex:s> <ex:p> <ex:o>.",
      };
    },
    example_PUT_json() {
      this.params.method = "PUT";
      this.params.url = "myfile.json";
      this.params.headers["Content-Type"] = "application/json";
      let content = JSON.stringify({ nimp: "swing", swop: "tchiboo" }, null, 2);
      this.resource = {
        content: content,
      };
    },
    example_PUT_jsonld() {
      this.params.method = "PUT";
      this.params.url = "myfile.jsonld";
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
    },
    //POST
    example_POST_text() {
      this.params.method = "POST";
      this.params.url = "";
      this.params.headers["Content-Type"] = "text/plain";
      this.resource = {
        content: "bidule",
      };
    },
    example_POST_turtle() {
      this.params.method = "POST";
      this.params.url = "";
      this.params.headers["Content-Type"] = "text/turtle";
      this.resource = {
        content: "<ex:s> <ex:p> <ex:o>.",
      };
    },
    example_POST_json() {
      this.params.method = "POST";
      this.params.url = "";
      this.params.headers["Content-Type"] = "application/json";
      let content = JSON.stringify({ nimp: "swing", swop: "tchiboo" }, null, 2);
      this.resource = {
        content: content,
      };
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
    },
    // GET
    example_GET_text() {
      this.params.method = "GET";
      this.params.url = "myfile.txt";
      this.params.headers["Accept"] = "text/plain";
    },
    example_GET_turtle() {
      this.params.method = "GET";
      this.params.url = "myfile.ttl";
      this.params.headers["Accept"] = "text/turtle";
    },
    example_GET_json() {
      this.params.method = "GET";
      this.params.url = "myfile.json";
      this.params.headers["Accept"] = "application/json";
    },
    example_GET_jsonld() {
      this.params.method = "GET";
      this.params.url = "myfile.jsonld";
      this.params.headers["Accept"] = "application/ld+json";
    },
    // GET CONTAINER
    example_GET_container_turtle() {
      this.params.method = "GET";
      this.params.url = "/";
      this.params.headers["Accept"] = "text/turtle";
    },
    example_GET_container_jsonld() {
      this.params.method = "GET";
      this.params.url = "/";
      this.params.headers["Accept"] = "application/ld+json";
    },
  },
};
</script>

<style scoped></style>
