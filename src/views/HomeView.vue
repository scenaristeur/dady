<script setup>
// import TheWelcome from '../components/TheWelcome.vue'
import LogDady from "@/views/LogDady.vue";
import ResourceCrud from "@/views/ResourceCrud.vue";
import MessageView from "@/views/MessageView.vue";
import ContainerView from "@/views/ContainerView.vue";
import ResourceView from "@/views/ResourceView.vue";
import DadyView from "@/views/DadyView.vue";
import TreeView from "@/views/TreeView.vue";
import JsonEditor from "@/views/JsonEditor.vue";
import VerseView from "@/views/VerseView.vue";
</script>

<template>
  <main>
    <!-- <TheWelcome /> -->
    <TreeView />
    <MessageView />
    <VerseView />
    <JsonEditor />
    <DadyView />
    <ResourceView />

    <ContainerView />
    <ResourceCrud />

    <LogDady />
  </main>
</template>
