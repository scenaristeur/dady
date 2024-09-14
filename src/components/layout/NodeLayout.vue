<template>
  <div v-if="node">
    <!-- *****************NODE LAYOUT
     -->
    <ArrayLayout v-if="Array.isArray(node)" :node="node" />
    <ul v-if="typeof node == 'object'" class="list-group">
      <li v-for="(v, k) in node" :key="k" class="list-group-item">
        <code>{{ k }} :</code>
        <ArrayLayout v-if="Array.isArray(v)" :node="v" />
        <ResourceLayout v-else-if="v['@id'] != undefined || k == '@id'" :node="v" />
        <ObjectLayout v-else-if="typeof v == 'object'" :node="v" />
        <LinkLayout v-else-if="v.type == 'link'" :node="v" />
        <TextLayout v-else-if="typeof v == 'string'" :node="v" />
        <pre v-else> {{ v }}</pre>
      </li>
    </ul>

    <!-- <ul class="list-group">
      <li v-for="(v, k) in node" :key="k" class="list-group-item">
        {{ k }} :

        <ArrayLayout v-if="Array.isArray(v)" :node="v" />
      </li>
    </ul> -->
    <TextLayout v-else-if="typeof node == 'string'" :node="node" />
    <div v-else class="alert alert-primary" role="alert">
      NOT IMPLEMENTED : type: {{ typeof node }} , isArray: {{ Array.isArray(node) }}
      <pre>{{ node }}</pre>
    </div>
    <!-- *****************END NODE LAYOUT ################################ -->
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: "NodeLayout",
  components: {
    ArrayLayout: defineAsyncComponent(() => import("./ArrayLayout.vue")),
    ObjectLayout: defineAsyncComponent(() => import("./ObjectLayout.vue")),
    ResourceLayout: defineAsyncComponent(() => import("./ResourceLayout.vue")),
    LinkLayout: defineAsyncComponent(() => import("./LinkLayout.vue")),
    TextLayout: defineAsyncComponent(() => import("./TextLayout.vue")),
  },
  props: ["node"],
};
</script>

<style scoped></style>

<!-- <ul class="list-group">
      <li v-for="(v, k) in currentNode" :key="k" class="list-group-item">
        {{ k }} :
        <span v-if="v['@id'] != undefined">
          <button @click="select(v['@id'])">
            {{ v["@id"].split("/").pop() }}
          </button>
          <small
            ><i>{{ v["@id"] }}</i></small
          >
        </span>

        <span v-else>{{ Array.isArray(v) }}, {{ v }}</span>
      </li>
    </ul> -->
