# dady

![dady_demo](doc/dady_demo.png)

## use it with solid community server

- https://communitysolidserver.github.io/CommunitySolidServer/latest/

## axios http verbs

- https://github.com/axios/axios#request-config

### axios delete

- https://github.com/axios/axios?tab=readme-ov-file#request-method-aliases

axios.delete(URL, {
headers: {
Authorization: authorizationToken
},
data: {
source: source
}
});

# TODO POST ne créé pas les folder

- https://communitysolidserver.github.io/CommunitySolidServer/latest/usage/metadata/#impact-on-creating-containers

# redo

- npm create vue@latest

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

```async could_be_helpfull_query_to_local_website() {
    try {
      const response = await axios.get('/user', {
        params: {
          ID: 12345
        }
      })
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }
```

`
