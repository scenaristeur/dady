<template>
  <div>
    <h2>Dady View</h2>
    <button type="button" class="btn btn-success" @click="init">Init</button>
    <button type="button" class="btn btn-danger" @click="remove">Delete</button>
  </div>
</template>

<script>
export default {
  name: "DadyView",
  data() {
    return {
      resources: [
        { name: "Agents Folder", path: "agents/" },
        { name: "Llms Folder", path: "llms/" },
        { name: "Models Folder", path: "models/" },
        { name: "Providers Folder", path: "providers/" },
        { name: "Users Folder", path: "users/" },
        { name: "README.md", path: "README.md", content: "# Dady Agents System" },
        {
          name: "John User",
          path: "users/john",
          content: `{
          "@context": "https://json-ld.org/contexts/person.jsonld",
          "@id": "http://dbpedia.org/resource/John_Lennon",
          "name": "John Lennon",
          "born": "1940-10-09",
          "spouse": "http://dbpedia.org/resource/Cynthia_Lennon"
        }`,
          "Content-Type": "application/ld+json",
        },
        {
          name: "Llama3",
          path: "llms/llama3",
          content: `{
          "@context": "https://scenaristeur.github.io/contexts/llm.jsonld",
          "@id": "https://www.wikidata.org/wiki/Q116894231",
          "name": "Llama3"
        }`,
          "Content-Type": "application/ld+json",
        },
      ],
    };
  },
  methods: {
    async init() {
      //   this.$store.dispatch("init");
      for (let r of this.resources) {
        this.createResource(r);
        await this.$store.dispatch("core/create_or_update");
      }
    },
    remove() {
      this.$store.dispatch("remove");
    },
    createResource(r) {
      this.params.method = "PUT";
      this.params.url = r.path;

      this.params.headers["Content-Type"] = r["Content-Type"] || "text/plain";
      this.resource.content = r.content || "";
      console.log(this.params.headers);
      this.$store.commit("core/setParams", this.params);
      this.$store.commit("core/setResource", this.resource);
    },
  },
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
