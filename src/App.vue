<script>
// import { RouterLink, RouterView } from "vue-router";
// import HelloWorld from "./components/HelloWorld.vue";
import LogDady from "./views/LogDady.vue";
import ResourceCrud from "./views/ResourceCrud.vue";
import MessageView from "./views/MessageView.vue";
import ContainerView from "./views/ContainerView.vue";
import ResourceView from "./views/ResourceView.vue";
import DadyView from "./views/DadyView.vue";
import TreeView from "./views/TreeView.vue";
import JsonEditor from "./views/JsonEditor.vue";
import BrainView from "./views/BrainView.vue";
import GraphView from "./views/GraphView.vue";
import NodeView from "./views/NodeView.vue";

export default {
  name: "TreeView.vue",
  components: {
    LogDady,
    ResourceCrud,
    MessageView,
    ContainerView,
    ResourceView,
    DadyView,
    TreeView,
    JsonEditor,
    BrainView,
    GraphView,
    NodeView,
  },
  computed: {
    message() {
      return this.$store.state.core.message;
    },
  },
};
</script>

<template>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

 

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->
  <!-- message : {{ message }} -->

  <div v-if="message == 'AxiosError: Network Error'">
    <h1>Dady</h1>

    EN : To use this app, you shoud start a "Community Solid Server" (CSS) on your
    computer with the command : <br />
    <br />
    "npx @solid/community-server"
    <br />
    <br />
    Take a look at
    <a
      href="https://communitysolidserver.github.io/CommunitySolidServer/latest/usage/starting-server/"
      target="_blank"
      >https://communitysolidserver.github.io/CommunitySolidServer/latest/usage/starting-server/
    </a>
    for more infos.
    <br />
    All data will stay on your solid server (your computer) even if the app is online .<br />
    When your CSS is started, and available at http://localhost:3000/, just refresh this
    page, and have fun !
    <hr />
    FR : Pour utiliser cette appli, vous devez démarrer un "Commuity Solid Server" (CSS)
    sur votre ordinateur avec la commande : <br />
    <br />
    "npx @solid/community-server"
    <br />
    <br />
    Jetez un oeil à l'adresse
    <a
      href="https://communitysolidserver.github.io/CommunitySolidServer/latest/usage/starting-server/"
      target="_blank"
      >https://communitysolidserver.github.io/CommunitySolidServer/latest/usage/starting-server/
    </a>
    pour plus d'infos.
    <br />
    Toutes les données restent sur votre serveur solid (votre ordinateur) même si l'appli
    est en ligne.<br />
    Lorsque votre CSS est démarré, et disponible à http://localhost:3000/, actualisez
    cette page, et amusez-vous !
  </div>
  <div v-else>
    <TreeView />
    <NodeView />
    <DadyView />
    <MessageView />
    <GraphView />
    <BrainView />
    <JsonEditor />

    <ResourceView />

    <ContainerView />
    <ResourceCrud />

    <LogDady />
  </div>
  <!-- <RouterView /> -->
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
