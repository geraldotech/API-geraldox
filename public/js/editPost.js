import { version, createApp, ref, reactive, watch, watchEffect, onMounted } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

/* 
usar este exemplo para constextualizar o template Refs
*/

const baseURL = 'http://api.geraldox.com/post'

const app = createApp({
  setup() {
    const serverresponse = ref('')
    const newSlug = ref('')
    const selectedCategory = ref(null)

    const catBackend = ref(null)
    const slugFromCurrentPost = ref(null)

    const postid = ref(null)
    const titleRef = ref('')
    const articleRef = ref('')
    const catRef = ref('')
    const authorRef = ref('')
    const vuecompoRef = ref('')
    const publishedRef = ref('')



    const shouldUpdateSlug = ref(false)
    const slugNewRef = ref('')

    onMounted(() => {
      // get post slugs from dom ejs and assign to selectedCategory
      const catBackendValue = catBackend.value.dataset.cat.toLowerCase()
      selectedCategory.value = catBackendValue

      // refs template
      // using the data
      // console.log(slugNewRef.value.dataset.slug)

      slugFromCurrentPost.value = slugNewRef.value.value
    })

    const submitHandler = () => {
      handlerPost(`${baseURL}/${slugFromCurrentPost.value}`)
    }

    function handlerPost(url) {

      const sendVueNullable = vuecompoRef.value.value === '' ? null : vuecompoRef.value.value
      console.log(vuecompoRef.value.value)

      // obj constructor from refs onClick
      // can send newslug even nao precisar??
      const newPostData = {
        id: postid.value.dataset.postid,
        title: titleRef.value.value,
        article: articleRef.value.value,
        category: catRef.value.value,
        author: authorRef.value.value,
        vcomponent: vuecompoRef.value.value,
        published: publishedRef.value.checked,
        updateslug: shouldUpdateSlug.value,
        newslug: slugNewRef.value.value,
        id: postid.value.dataset.postid,
      }

      const { id, title, article, category, author, vcomponent, published, updateslug, newslug } = newPostData

      const newslugFormated = newslug.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .slice(0, 75)

      const json = JSON.stringify({
        id,
        title,
        article,
        category,
        author,
        vuecomponent: vcomponent,
        published,
        updateslug,
        newslug: newslugFormated
      })

      const jsonNoSlug = JSON.stringify({
        id,
        title,
        article,
        category,
        author,
        vuecomponent: vcomponent,
        published,
        updateslug
      })


      // console.log(json)
      //ajax
      const ajaxn = new XMLHttpRequest()
      ajaxn.open('PUT', url)
      ajaxn.setRequestHeader('Content-Type', 'application/json')

      // custom obj
      updateslug ? ajaxn.send(json) : ajaxn.send(jsonNoSlug)


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
          newSlug.value = resp.slug

          // if server updated slug
          if (resp.updateslug) {
            setTimeout(() => {
              location.href = `/dashboard/edit/${resp.slug}`
            }, 1500)
          }
        }

        // Bad Request get zod response

        if (ajaxn.status === 400) {
          const resp = JSON.parse(ajaxn.response)

          const resp2 = JSON.parse(resp.message)
          const { code, message } = resp2[0]

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
      const sendVueNullable = vuecompoRef.value.value === '' ? null : vuecompoRef.value.value
      // obj constructor from refs onClick
      const newPostData = {
        id: +postid.value.dataset.postid,
        title: titleRef.value.value,
        body: articleRef.value.value,
        category: catRef.value.value,
        author: authorRef.value.value,
        vuecomponent: sendVueNullable,
        published: publishedRef.value.checked,
        updateslug: shouldUpdateSlug.value,
        newslug: slugNewRef.value.value
      }

      console.log(newPostData)

      //console.log(newPostData)

      /*       console.log(slugFromCurrentPost.value)
      console.log(titleref.value.value) */
    }

    watch(serverresponse, () => {
      setTimeout(() => {
        serverresponse.value = ''
      }, 4000)
    })

    return {
      submitHandler,
      serverresponse,
      newSlug,
      selectedCategory,
      catBackend,
      titleRef,
      slugNewRef,
      testJSON,
      articleRef,
      catRef,
      authorRef,
      vuecompoRef,
      publishedRef,
      shouldUpdateSlug,
      postid,
    }
  },
})

app.mount('#root')
