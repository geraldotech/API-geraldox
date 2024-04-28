import { version, createApp, ref, reactive } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

const app = createApp({
  setup() {
    const message = ref('Hello')
    const posts = ref([])

    const click = () => {
      console.log(`click`)
    }

    async function getall(){
      fetch('http://localhost:3333/posts').then((res => res.json())).then(data => posts.value = data)
    }

    //getall()

    return {
      message,
      click,
      getall,
      posts
    }
  },
})


app.mount("#root")
