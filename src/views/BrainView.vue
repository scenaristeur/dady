<template>
  <div>
    BrainView
    <button @click="newNode" class="btn btn-primary">New Brain/Node</button> {{ status }}

    <!-- Button trigger modal -->

    <div v-if="node">
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
          <input v-model="node['ve:age']" required type="number"  class="form-control" id="age" placeholder="Age">
        </div>

        <div class="form-check">
          <input type="checkbox" class="form-check-input" id="exampleCheck1">
          <label class="form-check-label" for="exampleCheck1">Check me out</label>
        </div>

        <br>
        <button class="btn btn-primary" @click="saveNode">Save Node</button>
      </div>


      <b-container v-if="node['ve:type'] == 'node'">

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
            <button @click="showFieldModal(p)" variant="outline-primary">+</button>
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
        <div>
          <div>
            <!-- <button  :variant="node['ve:privacy'] == 'public' ? 'warning' : 'outline-success'"
      @click="node['ve:privacy'] = node['ve:privacy'] == undefined || node['ve:privacy'] == 'public' ? 'private' : 'public'">
      {{node['ve:privacy']}}</button> -->

            <button variant="success" @click="saveNode">Save Node</button>
            <PermissionsLayout :permissions="permissions" :url="node['ve:url']" :autorized="autorized" />
          </div>
        </div>

        <b-modal id="fieldModal" size="xl" :title="node['ve:name'] + ' -> ' + currentProp.name">
          <!-- {{ currentProp}} -->
          <b-tabs content-class="mt-3">
            <b-tab title="text" active @click="fieldType = 'text'">
              <input v-model="newvalue" placeholder="new value" @change="addNewValue" />
            </b-tab>
            <b-tab title="textarea" @click="fieldType = 'textarea'">
              <b-form-textarea v-model="newvalue" placeholder="Enter something..." rows="3" max-rows="6"
                @change="addNewValue"></b-form-textarea>
            </b-tab>
            <b-tab title="node" @click="fieldType = 'node'">
              <NodeSelector :currentProp.sync="currentProp" />
            </b-tab>
            <b-tab title="link" @click="fieldType = 'link'">
              <input v-model="link.name" placeholder="name" />
              <input v-model="link.href" placeholder="link" @change="addNewLink" />
            </b-tab>
            <!-- <b-tab title="tiny" @click="fieldType = 'tiny'">

      <editor

      v-model="tinycontent"
      :init="{
      height: 500,
      menubar: false,
      plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount'
      ],
      toolbar:
      'undo redo | formatselect | bold italic backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | removeformat | help'
    }"
    />
  </b-tab> -->
          </b-tabs>
        </b-modal>

      </b-container>
      <b-container v-else>

        <!-- <Quasar /> -->
        <CKWysiwyg />
      </b-container>
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
    async save() {
      console.log("saving",Object.assign({}, this.node))
      await this.$store.dispatch('nodes/saveNode', this.node);
      this.$store.commit('nodes/setCurrentNode', null)
      this.$router.push('/');
    },
    add(){
      this.field = {name: ""}
    },
    fieldNameChanged(field_name){
      console.log(field_name)
      if(this.clearing == false){
        let p = {name: field_name, values: []}
        this.node['ve:properties'] == undefined ? this.node['ve:properties'] = [] : ""
        var index = this.node['ve:properties'].findIndex(x => x.name==p.name);
        index === -1 ? this.node['ve:properties'].push(p) : alert(p.name+" already exist")
      }
    },
    clear_field(){
      this.clearing = true
      this.field = null
      this.clearing = false
    },
    showFieldModal(p){
      console.log(p)
      this.fieldType= "text"
      this.currentProp = p
      this.$bvModal.show("fieldModal")
    },
    addNewValue(){
      let val = {value: this.newvalue,  type: this.fieldType}
      this.currentProp.values.push(val)
      this.newvalue = null
    },
    addNewLink(){
      //console.log(this.link)
      let val = {value: this.link,  type: this.fieldType}
      this.currentProp.values.push(val)
      this.link = {}
    },
    async getPermissions(){
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
