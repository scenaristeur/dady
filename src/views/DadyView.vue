<template>
  <div>
    <h2>Dady View</h2>
    <button type="button" class="btn btn-success" @click="init">Init</button>
    <button type="button" class="btn btn-danger" @click="remove">Delete</button>
  </div>
</template>

<script>
import * as celcius_functions from "./data/functions/celcius_functions.js?raw";
// console.log("CELCIUS functions", celcius_functions)
import CelciusRaw from "./data/classes/Celcius.js?raw";
// console.log("CELCIUS Class raw", CelciusRaw)
import CarRaw from "./data/classes/Car.js?raw";
// console.log("CAR Class raw", CarRaw)
import PersonRaw from "./data/classes/Person.js?raw";
// console.log("Person Class raw", PersonRaw)
import SolidToolRaw from "./data/classes/SolidTool.js?raw";
// console.log("SolidTool Class raw", SolidToolRaw)

// mycar = new Car("Porsche");
// console.log("my car", mycar)

export default {
  name: "DadyView",
  data() {
    return {
      resources: [
        { name: "Agents Folder", path: "agents/" },
        { name: "Teams Folder", path: "teams/" },
        { name: "Crews Folder", path: "teams/crews/" },
        { name: "Autogen Folder", path: "teams/autogen/" },
        { name: "Memgpt Folder", path: "teams/memgpt/" },
        { name: "Llms Folder", path: "llms/" },
        { name: "Models Folder", path: "models/" },
        { name: "Providers Folder", path: "providers/" },
        { name: "Users Folder", path: "users/" },

        { name: "Nested Folder", path: "here/is/a/nested/folder/" },
        { name: "README.md", path: "README.md", content: "# Dady Agents System" },

        // Backends Definition

        {
          name: "Local Community solid Server",
          path: "backends/LocalCommunitySolidServer",
          content: `{
          "@context": "https://json-ld.org/contexts/person.jsonld",
          "@id": "http://localhost:3000/backends/LocalCommunitySolidServer",
          "name": "Local Community solid Server",
          "created": "1940-10-09",
          "url": "http://localhost:3000/",
          "type": "Community Solid Server",
          "doc": [
          "https://communitysolidserver.github.io/CommunitySolidServer/",
          "https://communitysolidserver.github.io/CommunitySolidServer/latest/usage/example-requests/",
          "https://solidproject.org/TR/protocol",
          "https://solidproject.org/",
          "https://www.w3.org/community/solid/"
          ],
          "tools": "should we put js / python tools here ? "
            }`,
          "Content-Type": "application/ld+json",
        },

        // TOOLS JS
        {
          name: "Celcius Tools JS",
          path: "tools/CelciusTools",
          content: `{
          "@context": "https://json-ld.org/contexts/person.jsonld",
          "@id": "http://localhost:3000/tools/CelciusTools",
          "name": "Celcius Tools JS",
          "created": "1940-10-09",
          "functions": ${JSON.stringify(celcius_functions.default)},
          "code": ${JSON.stringify(CelciusRaw)}
            }`,
          "Content-Type": "application/ld+json",
        },
        {
          name: "Car Tools JS",
          path: "tools/CarTools",
          content: `{
          "@context": "https://json-ld.org/contexts/person.jsonld",
          "@id": "http://localhost:3000/tools/CarTools",
          "name": "Car Tools JS",
          "created": "1940-10-09",
          "code": ${JSON.stringify(CarRaw)}
            }`,
          "Content-Type": "application/ld+json",
        },
        // Person.js editable file + Jsonld referencing it
        {
          name: "Javascript Person Class Tool",
          path: "tools/code/Person.js",
          content: `${PersonRaw}     
          `,
          "Content-Type": "application/javascript",
        },
        {
          name: "Person Tools JS",
          path: "tools/PersonTools",
          content: `{
          "@context": "https://json-ld.org/contexts/person.jsonld",
          "@id": "http://localhost:3000/tools/PersonTools",
          "name": "Person Tools JS",
          "created": "1940-10-09",
          "code": "http://localhost:3000/tools/code/Person.js"
            }`,
          "Content-Type": "application/ld+json",
        },
        // Person.js editable file + Jsonld referencing it
        {
          name: "Javascript SolidTool",
          path: "tools/code/SolidTool.js",
          content: `${SolidToolRaw}     
          `,
          "Content-Type": "application/javascript",
        },
        {
          name: "Solid Tools JS",
          path: "tools/SolidTools",
          content: `{
          "@context": "https://json-ld.org/contexts/person.jsonld",
          "@id": "http://localhost:3000/tools/SolidTools",
          "name": "Solid Tools JS",
          "created": "1940-10-09",
          "code": "http://localhost:3000/tools/code/SolidTool.js"
            }`,
          "Content-Type": "application/ld+json",
        },

        // John User
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

        // Actions Functions Conditions
        {
          name: "Create Action",
          path: "actions/Create",
          "Content-Type": "application/ld+json",
          content: `{
                  "@context": "https://json-ld.org/contexts/person.jsonld",
                  "@id": "http://localhost:3000/actions/Create",
                  "name": "Create Action",
                  "created": "1940-10-09",
                  "version": "0.0.0",
                  "conditions": "http://localhost:3000/conditions/SolidCommunityBackendCondition",
                  "functions": ["http://localhost:3000/functions/JavascriptCreate",
                  "http://localhost:3000/functions/utils.jsonld",
                  "http://localhost:3000/functions/JavascriptDelete",
                  "http://localhost:3000/functions/JavascriptUpdate",
                  "http://localhost:3000/functions/CodeFunctions.py",
                  "http://spoggy-test2/public/functions/JavascriptRemoteFunction"
                  ]
                  }
                  `,
        },
        {
          name: "MemGPT Functions / Tools",
          path: "actions/Create",
          "Content-Type": "application/ld+json",
          content: `{
                  "@context": "https://json-ld.org/contexts/person.jsonld",
                  "@id": "http://localhost:3000/actions/Create",
                  "name": "MemGPT Functions / Tools",
                  "created": "1940-10-09",
                  "version": "0.0.0",
                  "conditions": "http://localhost:3000/conditions/SolidCommunityBackendCondition",
                  "functions": ["http://localhost:3000/functions/JavascriptCreate",
                  "http://localhost:3000/functions/utils.jsonld",
                  "http://localhost:3000/functions/JavascriptDelete",
                  "http://localhost:3000/functions/JavascriptUpdate",
                  "http://localhost:3000/functions/CodeFunctions.py",
                  "http://spoggy-test2/public/functions/JavascriptRemoteFunction"
                  ]
                  }
                  `,
        },
        {
          name: "Crewai Functions",
          path: "functions/CrewaiFunctions",
          "Content-Type": "application/ld+json",
          content: `{
                  "@context": "https://json-ld.org/contexts/person.jsonld",
                  "@id": "http://localhost:3000/functions/CrewaiFunctions",
                  "name": "Create Action",
                  "created": "1940-10-09",
                  "version": "0.0.0",
                  "conditions": "http://localhost:3000/conditions/SolidCommunityBackendCondition",
                  "functions": ["http://localhost:3000/functions/JavascriptCreate",
                  "http://localhost:3000/functions/utils.jsonld",
                  "http://localhost:3000/functions/JavascriptDelete",
                  "http://localhost:3000/functions/JavascriptUpdate",
                  "http://localhost:3000/functions/CodeFunctions.py",
                  "http://spoggy-test2/public/functions/JavascriptRemoteFunction"
                  ]
                  }
                  `,
        },

        {
          name: "Javascript Create",
          path: "functions/JavascriptCreate",
          content: `{
                  "@context": "https://json-ld.org/contexts/person.jsonld",
                  "@id": "http://localhost:3000/functions/JavascriptCreate",
                  "name": "Javascript Create",
                  "created": "1940-10-09",
                  "version": "0.0.0",
                  "spouse": "http://dbpedia.org/resource/Cynthia_Lennon",
                  "used_by": "http://localhost:3000/actions/Create",
                  "params": "data",
                  "body": "console.log('creating user with name : ', data.name)"
                    }`,
          "Content-Type": "application/ld+json",
        },
        {
          name: "Javascript Delete",
          path: "functions/JavascriptDelete",
          content: `{
                  "@context": "https://json-ld.org/contexts/person.jsonld",
                  "@id": "http://localhost:3000/functions/JavascriptDelete",
                  "name": "Javascript Delete",
                  "created": "1940-10-09",
                  "version": "0.0.0",
                  "spouse": "http://dbpedia.org/resource/Cynthia_Lennon",
                  "used_by": "http://localhost:3000/actions/Delete",
                  "params": "id=null",
                  "body": "console.log('deleting user with id:', id)"
                    }`,
          "Content-Type": "application/ld+json",
        },
        {
          name: "Javascript Delete",
          path: "functions/JavascriptDelete",
          content: `{
                  "@context": "https://json-ld.org/contexts/person.jsonld",
                  "@id": "http://localhost:3000/functions/JavascriptDelete",
                  "name": "Javascript Delete",
                  "created": "1940-10-09",
                  "version": "0.0.0",
                  "spouse": "http://dbpedia.org/resource/Cynthia_Lennon",
                  "used_by": "http://localhost:3000/actions/Delete",
                  "params": "id=null",
                  "body": "console.log('deleting user with id:', id)"
                    }`,
          "Content-Type": "application/ld+json",
        },
        {
          name: "Solid Community Backend Condition",
          path: "conditions/SolidCommunityBackendCondition",
          content: `{
                  "@context": "https://json-ld.org/contexts/person.jsonld",
                  "@id": "http://localhost:3000/conditions/SolidCommunityBackendCondition",
                  "name": "Solid Community Backend Condition",
                  "created": "1940-10-09",
                  "version": "0.0.0",
                  "spouse": "http://dbpedia.org/resource/Cynthia_Lennon",
                  "used_by": "http://localhost:3000/actions/Create"
                    }`,
          "Content-Type": "application/ld+json",
        },
        {
          name: "Autogen code Functions",
          path: "functions/CodeFunctions.py",
          content: `from typing_extensions import Annotated

        default_path = "backend_dir/"


        @user_proxy.register_for_execution()
        @engineer.register_for_llm(description="List files in choosen directory.")
        def list_dir(directory: Annotated[str, "Directory to check."]):
            files = os.listdir(default_path + directory)
            return 0, files


        @user_proxy.register_for_execution()
        @engineer.register_for_llm(description="Check the contents of a chosen file.")
        def see_file(filename: Annotated[str, "Name and path of file to check."]):
            with open(default_path + filename, "r") as file:
                lines = file.readlines()
            formatted_lines = [f"{i+1}:{line}" for i, line in enumerate(lines)]
            file_contents = "".join(formatted_lines)

            return 0, file_contents


        @user_proxy.register_for_execution()
        @engineer.register_for_llm(description="Replace old piece of code with new one. Proper indentation is important.")
        def modify_code(
            filename: Annotated[str, "Name and path of file to change."],
            start_line: Annotated[int, "Start line number to replace with new code."],
            end_line: Annotated[int, "End line number to replace with new code."],
            new_code: Annotated[str, "New piece of code to replace old code with. Remember about providing indents."],
        ):
            with open(default_path + filename, "r+") as file:
                file_contents = file.readlines()
                file_contents[start_line - 1 : end_line] = [new_code + "\n"]
                file.seek(0)
                file.truncate()
                file.write("".join(file_contents))
            return 0, "Code modified"


        @user_proxy.register_for_execution()
        @engineer.register_for_llm(description="Create a new file with code.")
        def create_file_with_code(
            filename: Annotated[str, "Name and path of file to create."], code: Annotated[str, "Code to write in the file."]
        ):
            with open(default_path + filename, "w") as file:
                file.write(code)
            return 0, "File created successfully"`,
          "Content-Type": "plain/text",
        },
        {
          name: "Javascript Utility Functions File",
          path: "functions/code/utils.js",
          content: `console.log("chargement des fonctions")

                  function log(text){
                  console.log("I say :",text)
                  }

                  function create(data){
                  console.log("I'm creating something with this data: ",data)
                  console.log("I'm creating something with this name: ",data.name)
                  }       
                  `,
          "Content-Type": "application/javascript",
        },
        {
          name: "Javascript Utility Functions",
          path: "functions/utils.jsonld",
          content: `{
                  "@context": "https://json-ld.org/contexts/person.jsonld",
                  "@id": "http://localhost:3000/functions/utils.jsonld",
                  "name": "Javascript Utility Functions",
                  "created": "1940-10-09",
                  "version": "0.0.0",
                  "spouse": "http://dbpedia.org/resource/Cynthia_Lennon",
                  "used_by": "http://localhost:3000/actions/Create",
                  "code": "http://localhost:3000/functions/code/utils.js"
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
      let parts = r.path.split("/");

      console.log(parts);
      this.params.method = "PUT";
      this.params.headers["Content-Type"] = r["Content-Type"] || "text/plain";
      this.resource.content = r.content || "";
      console.log(this.params.headers);

      let path = "";

      for (let i = 0; i < parts.length; i++) {
        path = path + "/" + parts[i];
        console.log("path", path);
      }

      this.params.url = path;
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
