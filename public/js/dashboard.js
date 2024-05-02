import { version, createApp, ref, reactive } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

const app = createApp({
  setup() {
    const message = ref('Hello')
    const posts = ref([])

    const click = () => {
      console.log(`click`)
    }

    const handlerDelete = (slug) => {
      if (confirm('Delete ?')) {
        const ajaxn = new XMLHttpRequest()

        ajaxn.open('DELETE', `http://localhost:3333/post/${slug}`)

        ajaxn.onload = function () {
          if (this.readyState === XMLHttpRequest.DONE) {
            // Get and convert the responseText into JSON
            console.log('Request was a success')
          }
          // == server response ==

          alert(JSON.parse(ajaxn.response).message)
          location.reload()
        }
        ajaxn.send()
      }
    }

    async function getall() {
      fetch('http://localhost:3333/posts')
        .then((res) => res.json())
        .then((data) => (posts.value = data))
    }

    //getall()

    return {
      message,
      click,
      getall,
      posts,
      handlerDelete,
    }
  },
})

app.mount('#root')
