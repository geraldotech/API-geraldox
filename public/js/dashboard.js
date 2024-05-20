import { version, createApp, ref, reactive } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'


const getBASEURL = document.querySelector('p[data-baseurl]').dataset.baseurl

const baseURL = getBASEURL

const app = createApp({
  setup() {
    const message = ref('Hello')
    const posts = ref([])
    const searchTerm = ref('')

    const click = () => {
      console.log(`click`)
    }

    const handlerDelete = (slug) => {
      if (confirm('Delete ?')) {
        const ajaxn = new XMLHttpRequest()

        ajaxn.open('DELETE', `${baseURL}/post/${slug}`)

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
      fetch(`${baseURL}/posts`)
        .then((res) => res.json())
        .then((data) => (posts.value = data))
    }

    function filterPosts() {
      console.log(`ok`)
      // Get all post elements
      const posts = document.querySelectorAll('.single');
      
      // Loop through posts and hide or show based on the criteria
      posts.forEach(post => {
        const title = post.querySelector('.post_title').innerText.toLowerCase();
        if (title.includes(searchTerm.value.toLowerCase())) {
          post.style.display = 'block';
        } else {
          post.style.display = 'none';
        }
      });
    }
    
    

    return {
      message,
      click,
      getall,
      posts,
      handlerDelete,
      searchTerm,
      filterPosts
    }
  },
})

app.mount('#root')


