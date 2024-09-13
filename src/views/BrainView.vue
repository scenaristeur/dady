<template>
  <div>
    BrainView
    <button @click="newNode" class="btn btn-primary">New Brain/Node</button> {{ status }}

    <!-- Button trigger modal -->

    <div v-if="node" class="container">
      <!-- {{ node }} -->

      <button class="btn btn-primary" disabled
        @click="node['ve:type'] = node['ve:type'] == undefined || node['ve:type'] == 'html' ? 'node' : 'html'">
        {{ node['ve:type'] == 'node' ? "Switch to Html Edition" : "Switch to Node Edition" }}


      </button>



      <div v-if="node['ve:type'] == 'node'">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" v-model="node['ve:name']" autocomplete="off" autofocus class="form-control" id="name"
            aria-describedby="nameHelp" placeholder="Enter Node Name">
          <small id="nameHelp" class="form-text text-muted">Provide a Nice name to your node.</small>
        </div>

        <div class="form-group">
          <label for="age">Age</label>
          <input v-model="node['ve:age']" required type="number" class="form-control" id="age" placeholder="Age">
        </div>

        <div class="form-check">
          <input type="checkbox" class="form-check-input" id="exampleCheck1">
          <label class="form-check-label" for="exampleCheck1">Check me out</label>
        </div>

        <br>





        <!-- <div>
          <div sm="3">
            <label for="name">Name:</label>
          </div>
          <div sm="9">
            <input id="name" v-model="node['ve:name']" autocomplete="off" autofocus />
          </div>
          <div sm="3">
            <label for="age"><code>Age</code>:</label>
          </div>
          <div>
            <input id="age" v-model="node['ve:age']" required type="number" />
          </div>
        </div> -->


        <div v-for="p in node['ve:properties']" :key="p.name">
          <div sm="3">
            <label for="name"><code>{{ p.name }}</code>:</label>
          </div>
          <div sm="9">

            <!-- <button-toolbar key-nav aria-label="Toolbar with button groups">
          <b-dropdown size="sm" class="mx-1" right text="+" variant="outline-primary">
          <b-dropdown-item @click="fieldType = 'text'">Text</b-dropdown-item>
          <b-dropdown-item @click="fieldType = 'textarea'">Textarea</b-dropdown-item>
          <b-dropdown-item @click="fieldType = 'node'">Node</b-dropdown-item>
          <b-dropdown-item @click="fieldType = 'link'">Link</b-dropdown-item>
        </b-dropdown>

      </button-toolbar> -->
            <!-- <button @click="showFieldModal(p)" variant="outline-primary">+</button> -->
            <button type="button" @click="showFieldModal(p)" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#fieldModal">
              +
            </button>
            <!-- {{ p.values}} -->

            <ValuesComponent :values="p.values" />

            <!-- <input id="name" v-model="node.name" required /> -->
          </div>
        </div>

        <div v-if="field != null" class="mt-3">
          <div sm="3">
            <input @change="fieldNameChanged" v-model="field.name" required placeholder="property name" />
          </div>
          <div sm="9">
            <button variant="outline-secondary" size="sm" @click="clear_field">X</button>
          </div>
        </div>

        <div>
          <div>
          </div>
          <div>
            <button variant="outline-primary" size="sm" @click="add">+ add a property or a link</button>
          </div>
        </div>


        <!-- New Modal-->
        <div class="modal fade .modal-xl" id="fieldModal" size="xl" :title="node['ve:name'] + ' -> ' + currentProp.name"
          tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Node</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <!-- tab debut-->
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                  <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="text-tab" data-bs-toggle="tab" data-bs-target="#text"
                      type="button" role="tab" aria-controls="text" aria-selected="true">one line Text</button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button class="nav-link" id="textarea-tab" data-bs-toggle="tab" data-bs-target="#textarea"
                      type="button" role="tab" aria-controls="textarea" aria-selected="false">Long Text</button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button class="nav-link" id="node-tab" data-bs-toggle="tab" data-bs-target="#node"
                      type="button" role="tab" aria-controls="node" aria-selected="false">Node</button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button class="nav-link" id="link-tab" data-bs-toggle="tab" data-bs-target="#link"
                      type="button" role="tab" aria-controls="link" aria-selected="false">Link</button>
                  </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                  <div class="tab-pane fade show active" id="text" role="tabpanel" aria-labelledby="text-tab">
                
                     <input v-model="newvalue" placeholder="new value" @change="addNewValue" />
                  
                  </div>
                  <div class="tab-pane fade" id="textarea" role="tabpanel" aria-labelledby="textarea-tab">
                    
                    <textarea v-model="newvalue" placeholder="Enter something..." rows="3" max-rows="6"
                    @change="addNewValue"></textarea>
                  </div>
                  <div class="tab-pane fade" id="node" role="tabpanel" aria-labelledby="node-tab">
                    <NodeSelector :currentProp.sync="currentProp" />
                  </div>
                  <div class="tab-pane fade" id="link" role="tabpanel" aria-labelledby="link-tab">
                    <input v-model="link.name" placeholder="name" />
              <input v-model="link.href" placeholder="link" @change="addNewLink" />
          
                  </div>

                </div>


                <!-- tab fin -->
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>
                <!-- <button type="button" class="btn btn-primary" @click="newNode">Save changes</button> -->
              </div>
            </div>
          </div>
        </div>


        <button class="btn btn-primary" @click="saveNode">Save Node</button>
        <br>
                    <button  :variant="node['ve:privacy'] == 'public' ? 'warning' : 'outline-success'"
      @click="node['ve:privacy'] = node['ve:privacy'] == undefined || node['ve:privacy'] == 'public' ? 'private' : 'public'">
      {{node['ve:privacy']}}</button> 
      <PermissionsLayout :permissions="permissions" :url="node['ve:url']" :autorized="autorized" />
      </div>
      <div v-else>

        <!-- <Quasar /> -->
        <CKWysiwyg />
      </div>
    </div>

  </div>
</template>

<script>

import CKWysiwyg from './CKWysiwyg.vue';
import NodeSelector from '../components/NodeSelector.vue'
import ValuesComponent from '../components/ValuesComponent.vue'
import PermissionsLayout from '../components/layout/PermissionsLayout.vue';

export default {
  name: "BrainView",
  components: {
    NodeSelector,
    // 'NodeLite': () => import('@/components/NodeLite'),
    ValuesComponent,
    PermissionsLayout,
    // 'Quasar': () => import('@/views/Quasar'),
    CKWysiwyg,
    // 'editor': Editor
  },
  data() {
    return {
      status: null,
      node: null,
      field: null,
      clearing: false,
      fieldType: "text",
      show: false,
      currentProp: {},
      newvalue: null,
      link: {},
      // privacy: "private",
      permissions: null
      // tinycontent: ""
    }

  },
  // created(){
  // this.node = this.$store.state.nodes.currentNode || this.$store.state.nodes.modele
  // },
  methods: {
    newNode() {
      // this.$store.commit('nodes/newNode', this.modele)
      this.node = this.$store.state.nodes.currentNode || this.$store.state.nodes.modele
    },
    async saveNode() {
      console.log("saving", Object.assign({}, this.node))
      await this.$store.dispatch('nodes/saveNode', this.node);
      this.$store.commit('nodes/setCurrentNode', null)
      this.$router.push('/');
    },
    add() {
      this.field = { name: "" }
    },
    fieldNameChanged(field_name) {
      console.log(field_name)
      if (this.clearing == false) {
        let p = { name: field_name.target.value, values: [] }
        this.node['ve:properties'] == undefined ? this.node['ve:properties'] = [] : ""
        var index = this.node['ve:properties'].findIndex(x => x.name == p.name);
        index === -1 ? this.node['ve:properties'].push(p) : alert(p.name + " already exist")

      }
    },
    clear_field() {
      this.clearing = true
      this.field = null
      this.clearing = false
    },
    showFieldModal(p) {
      console.log(p)
      this.fieldType = "text"
      this.currentProp = p
      //this.$bvModal.show("fieldModal")
    },
    addNewValue() {
      let val = { value: this.newvalue, type: this.fieldType }
      this.currentProp.values.push(val)
      this.newvalue = null
    },
    addNewLink() {
      //console.log(this.link)
      let val = { value: this.link, type: this.fieldType }
      this.currentProp.values.push(val)
      this.link = {}
    },
    async getPermissions() {
      this.permissions = this.node['ve:url'] != undefined ? await this.$getPermissions(this.node) : null
      console.log("PERMISSIONS", this.permissions)
    }
  },
  currentNode() {
    console.log("CURRENT NODE Changed")
    this.node = this.currentNode
    this.getPermissions()
  },
  computed: {
    currentNode() {
      return this.$store.state.nodes.currentNode;
    },
    autorized() {
      if (this.permissions == null) {
        return false
      } else {
        return this.permissions.user.append == true ||
          this.permissions.user.write == true ||
          this.permissions.public.append == true ||
          this.permissions.public.write == true
      }
    },
  },
};
</script>

<style scoped></style>
