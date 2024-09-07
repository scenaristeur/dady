<template>
  <div>
    <h1>ResourceCrud</h1>

    <h2>Create or Update</h2>

    <table>
      <tr>
        <td>
          <b>Resource</b><br />
          <div v-if="params.method != 'PUT'">
            id: <input ref="id" v-model="resource.id" />
          </div>

          <div v-if="params.method != 'PUT'">
            name: <input ref="name" v-model="resource.name" />
          </div>
          <div>
            content:
            <textarea ref="content" v-model="resource.content" cols="40" rows="10" />
          </div>
          <div>url: <input ref="url" v-model="params.url" /></div>
          <button @click="create_or_update">Create or Update</button>
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

          <button @click="example_put_text">plain text file</button>
          <button @click="example_put_turtle">turtle file</button>
          <button @click="example_put_json">json file</button
          ><button @click="example_put_jsonld">jsonld file</button>
          <br />
          POST: Creating resources at a generated URL
          <br />
          <button @click="create_or_update">plain text file</button>
          <button @click="create_or_update">Create a plain text file:</button>
          <button @click="create_or_update">turtle file:</button>
          <button @click="create_or_update">json file:</button
          ><button @click="create_or_update">jsonld file:</button>
          <br />
          GET: Retrieving resources
          <br />

          <button @click="create_or_update">Create a plain text file:</button
          ><button @click="create_or_update">Create a plain text file:</button
          ><button @click="create_or_update">Create a plain text file:</button>
          <br />
          DELETE: Deleting resources
          <br />
          PATCH: Modifying resources<br />
          HEAD: Retrieve resources headers<br />
          OPTIONS: Retrieve resources communication options<br />

          <button @click="create_or_update">Create a plain text file:</button
          ><button @click="create_or_update">Create a plain text file:</button
          ><button @click="create_or_update">Create a plain text file:</button
          ><button @click="create_or_update">Create a plain text file:</button
          ><button @click="create_or_update">Create a plain text file:</button>
        </td>
      </tr>
    </table>

    <h2>Show with criteres</h2>
  </div>
</template>

<script>
export default {
  name: "ResourceCrud",
  data() {
    return {
      params: {
        method: "GET",
        headers: { "Content-Type": "" },
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
    },
    create_or_update() {
      if (this.params.headers["Content-Type"].endsWith("json")) {
        console.log("is JSON");
        this.resource.content = JSON.parse(
          JSON.stringify(this.resource.content, null, 2)
        );
      }
      this.$store.dispatch("core/create_or_update", {
        params: this.params,
        resource: this.resource,
      });
    },
    example_put_text() {
      this.params.method = "PUT";
      this.params.url = "myfile.txt";
      this.params.headers["Content-Type"] = "text/plain";
      this.resource = {
        // id: "",
        // name: "",
        content: "bidule",
      };
    },
    example_put_turtle() {
      this.params.method = "PUT";
      this.params.url = "myfile.ttl";
      this.params.headers["Content-Type"] = "text/turtle";
      this.resource = {
        // id: "123",
        // name: "truc",
        content: "<ex:s> <ex:p> <ex:o>.",
      };
    },
    example_put_json() {
      this.params.method = "PUT";
      this.params.url = "myfile.json";
      this.params.headers["Content-Type"] = "application/json";
      let content = JSON.stringify({ nimp: "swing", swop: "tchiboo" }, null, 2);
      this.resource = {
        // id: "123",
        // name: "truc",
        content: content,
      };
    },
    example_put_jsonld() {
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
        // id: "123",
        // name: "truc",
        content: content,
      };
    },
  },
};
</script>

<style scoped></style>
