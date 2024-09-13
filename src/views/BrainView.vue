<template>
  <div>
    BrainView
    <button @click="newNode">New Brain/Node</button> {{ status }}

    <!-- Button trigger modal -->

    <div v-if="node">
      {{ node }}

      <b-button variant="success" class="m-3"
        @click="node['ve:type'] = node['ve:type'] == undefined || node['ve:type'] == 'html' ? 'node' : 'html'">
        {{ node['ve:type'] == 'node' ? "Switch to Html Edition" : "Switch to Node Edition" }}


      </b-button>
      <b-container v-if="node['ve:type'] == 'node'">

        <b-row>
          <b-col sm="3">
            <label for="name">Name:</label>
          </b-col>
          <b-col sm="9">
            <b-form-input id="name" v-model="node['ve:name']" autocomplete="off" autofocus />
          </b-col>
          <b-col sm="3">
            <label for="age"><code>Age</code>:</label>
          </b-col>
          <b-col>
            <b-form-input id="age" v-model="node['ve:age']" required type="number" />
          </b-col>
        </b-row>


        <b-row v-for="p in node['ve:properties']" :key="p.name">
          <b-col sm="3">
            <label for="name"><code>{{ p.name }}</code>:</label>
          </b-col>
          <b-col sm="9">

            <!-- <b-button-toolbar key-nav aria-label="Toolbar with button groups">
          <b-dropdown size="sm" class="mx-1" right text="+" variant="outline-primary">
          <b-dropdown-item @click="fieldType = 'text'">Text</b-dropdown-item>
          <b-dropdown-item @click="fieldType = 'textarea'">Textarea</b-dropdown-item>
          <b-dropdown-item @click="fieldType = 'node'">Node</b-dropdown-item>
          <b-dropdown-item @click="fieldType = 'link'">Link</b-dropdown-item>
        </b-dropdown>

      </b-button-toolbar> -->
            <b-button @click="showFieldModal(p)" variant="outline-primary">+</b-button>
            <!-- {{ p.values}} -->

            <ValuesComponent :values="p.values" />

            <!-- <b-form-input id="name" v-model="node.name" required /> -->
          </b-col>
        </b-row>

        <b-row v-if="field != null" class="mt-3">
          <b-col sm="3">
            <b-form-input @change="fieldNameChanged" v-model="field.name" required placeholder="property name" />
          </b-col>
          <b-col sm="9">
            <b-button variant="outline-secondary" size="sm" @click="clear_field">X</b-button>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
          </b-col>
          <b-col>
            <b-btn variant="outline-primary" size="sm" @click="add">+ add a property or a link</b-btn>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <!-- <b-button  :variant="node['ve:privacy'] == 'public' ? 'warning' : 'outline-success'"
      @click="node['ve:privacy'] = node['ve:privacy'] == undefined || node['ve:privacy'] == 'public' ? 'private' : 'public'">
      {{node['ve:privacy']}}</b-button> -->

            <b-btn variant="success" @click="saveNode">Save Node</b-btn>
            <PermissionsLayout :permissions="permissions" :url="node['ve:url']" :autorized="autorized" />
          </b-col>
        </b-row>

        <b-modal id="fieldModal" size="xl" :title="node['ve:name'] + ' -> ' + currentProp.name">
          <!-- {{ currentProp}} -->
          <b-tabs content-class="mt-3">
            <b-tab title="text" active @click="fieldType = 'text'">
              <b-form-input v-model="newvalue" placeholder="new value" @change="addNewValue" />
            </b-tab>
            <b-tab title="textarea" @click="fieldType = 'textarea'">
              <b-form-textarea v-model="newvalue" placeholder="Enter something..." rows="3" max-rows="6"
                @change="addNewValue"></b-form-textarea>
            </b-tab>
            <b-tab title="node" @click="fieldType = 'node'">
              <NodeSelector :currentProp.sync="currentProp" />
            </b-tab>
            <b-tab title="link" @click="fieldType = 'link'">
              <b-form-input v-model="link.name" placeholder="name" />
              <b-form-input v-model="link.href" placeholder="link" @change="addNewLink" />
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
      node:null,
      field : null,
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

      this.status = await this.$store.dispatch('nodes/saveNode', this.node);
      this.$store.commit('nodes/setCurrentNode', null)
      this.$router.push('/');
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
