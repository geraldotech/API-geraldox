import { version, createApp, ref, reactive, watch, watchEffect, onMounted } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

/* 
usar este exemplo para constextualizar o template Refs
*/

const baseURL = 'http://localhost:3333/post'

const app = createApp({
  setup() {
    const serverresponse = ref('')
    const newSlug = ref('')
    const selectedCategory = ref(null)
    const slugPostRef = ref(null)

    const catBackend = ref(null)
    const slugFromCurrentPost = ref(null)

    const titleRef = ref('')
    const articleRef = ref('')
    const catRef = ref('')
    const authorRef = ref('')
    const vuecompoRef = ref('')
    const publishedRef = ref('')
    const updateslugRef = ref(false)

    // get data from form
    const formData = ref({
      title: '',
      article: '',
      category: '',
      author: '',
      vcomponent: '',
      published: true,
    })

    onMounted(() => {
      // get post slugs from dom ejs and assign to selectedCategory
      const catBackendValue = catBackend.value.dataset.cat.toLowerCase()
      selectedCategory.value = catBackendValue

      // refs template
      // using the data
      // console.log(slugPostRef.value.dataset.slug)
      // using the value of input if exists
      //  console.log(slugPostRef.value.value)

      slugFromCurrentPost.value = slugPostRef.value.value
    })

    const submitHandler = () => {
      handlerPost(formData.value, `${baseURL}/${slugFromCurrentPost.value}`)
    }

    function handlerPost(data, url) {
      // obj constructor from refs onClick
      const newPostData = {
        title: titleRef.value.value,
        article: articleRef.value.value,
        category: catRef.value.value,
        author: authorRef.value.value,
        vcomponent: vuecompoRef.value.value,
        published: publishedRef.value.checked,
        updateslug: updateslugRef.value.checked,
      }

      const { title, article, category, author, vcomponent, published, updateslug } = newPostData

      const json = JSON.stringify({
        title,
        article,
        category,
        author,
        vuecomponent: vcomponent,
        published,
        updateslug,
      })

      console.log(json)
      //ajax
      const ajaxn = new XMLHttpRequest()
      ajaxn.open('PUT', url)
      ajaxn.setRequestHeader('Content-Type', 'application/json')
      ajaxn.send(json)

      ajaxn.onload = function (e) {
        // Check if the request was a success
        if (this.readyState === XMLHttpRequest.DONE) {
          // Get and convert the responseText into JSON
          console.log('AJAX request was a success')
        }

        // === get all server response ===

        const allresp = ajaxn
         //console.log(allresp) // obj

        if (ajaxn.status === 200) {
          const resp = JSON.parse(ajaxn.response)

          serverresponse.value = resp.message
          newSlug.value = resp.newSlug
         location.href = `/dashboard/edit/${resp.newSlug}`
        }

        // Bad Request get zod response

        if (ajaxn.status === 400) {
          const resp = JSON.parse(ajaxn.response)
          console.log(resp)

          const resp2 = JSON.parse(resp.message)
          const { code, message } = resp2[0]
          console.log(code, message)

          serverresponse.value = message
        }

        if (ajaxn.status === 409) {
          const resp = JSON.parse(ajaxn.response)

          serverresponse.value = resp.error
        }

        // const serverresponse = JSON.parse(ajaxn.response)
        // console.log(`server response`, serverresponse)
      }
    }

    const testJSON = () => {
      // obj constructor from refs onClick
      const newPostData = {
        title: titleRef.value.value,
        body: articleRef.value.value,
        category: catRef.value.value,
        author: authorRef.value.value,
        vuecomponent: vuecompoRef.value.value,
        published: publishedRef.value.checked,
        updateslug: updateslugRef.value.checked,
      }

      console.log(newPostData)

      //console.log(newPostData)

      /*       console.log(slugFromCurrentPost.value)
      console.log(titleref.value.value) */
    }

    watch(
      formData,
      (newValue, oldvalue) => {
        // console.log(`changing data`, newValue.published)
        // console.log(`watch checkbox`)
      },
      { deep: true }
    )

    watch(serverresponse, () => {
      setTimeout(() => {
        serverresponse.value = ''
      }, 1000)
    })

    return {
      submitHandler,
      serverresponse,
      newSlug,
      selectedCategory,
      catBackend,
      titleRef,
      slugPostRef,
      testJSON,
      articleRef,
      catRef,
      authorRef,
      vuecompoRef,
      publishedRef,
      updateslugRef,
    }
  },
})

app.mount('#root')
