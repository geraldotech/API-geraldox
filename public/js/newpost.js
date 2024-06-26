import { version, createApp, ref, reactive, watch, watchEffect, onMounted } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

//const baseURL = 'https://api.geraldox.com/post'

const getBASEURL = document.querySelector('p[data-baseurl]').dataset.baseurl
const baseURL = `${getBASEURL}/post`

const app = createApp({
  setup() {
    const mokeData = {
      title: 'Sony Ericsson Xperia X8',
      article:
        'O Sony Ericsson Xperia X8 foi lançado em 2010 como um smartphone de entrada. O telefone vem com um display de 3 polegadas com uma resolução de 320 x 480 pixels, alimentado por um processador Qualcomm MSM7227 de 600 MHz. O telefone tem 256 MB de RAM, 512 MB de armazenamento interno, expansível até 16 GB através de um cartão microSD. O Xperia X8 vem com uma câmera traseira de 3,2 megapixels, que pode gravar vídeos em VGA a 30 quadros por segundo. O telefone também tem uma câmera frontal VGA para videoconferências. O telefone vem com o sistema operacional Android 2.1 (Eclair) e tem uma bateria de 1200 mAh.',
      category: 'android',
      author: 'GmapDev',
      vcomponent: '<SonyX8/>',
      published: false,
    }

    const serverresponse = ref('')
    const customSlugData = ref('')
    const categories = ref([])

    // get data from form
    const formData = ref({
      title: '',
      article: '<p></p>',
      category: '',
      author: 'Geraldo',
      vcomponent: '',
      published: true,
      customslug: false,
      setCreateAt: false,
      userSetCreateAt: '',
    })

    // Function to convert date format from yyyy-mm-dd to dd/mm/yyyy
    // poderia ser no backend
    function formatDate(inputDate) {
      // Split the input date into year, month, and day

      if (inputDate === '') {
        return ''
      }

      const parts = inputDate.split('-')

      // Rearrange the parts to form the desired format
      const formattedDate = parts[2] + '/' + parts[1] + '/' + parts[0]

      return formattedDate
    }

    // active the mocking data
    //formData.value = mokeData

    const submitHandler = () => {
      handlerPost(formData.value, baseURL)
    }

    function handlerPost(data, url) {
      // nao precisa se preocupar muito com os dados,
      // backend vai tratar

      const { title, article, category, author, vcomponent } = data

      const sendCustomSlug = formData.value.customslug ? customSlugData.value : ''

      const json = JSON.stringify({
        title,
        article,
        category,
        author,
        vuecomponent: vcomponent,
        published: formData.value.published,
        slug: sendCustomSlug,
        customslug: formData.value.customslug,
        userSetCreateAt: formatDate(formData.value.userSetCreateAt),
      })

      console.log(json)

      //ajax
      const ajaxn = new XMLHttpRequest()
      ajaxn.open('POST', url)
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
        // console.log(allresp) // obj

        if (ajaxn.status === 201) {
          const resp = JSON.parse(ajaxn.response)

          serverresponse.value = resp.message
          cleanValues()
          setTimeout(() => (serverresponse.value = ''), 2000)
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

    const cleanValues = () => {
      formData.value.title = ''
      formData.value.article = ''
      formData.value.category = ''
      formData.value.author = ''
      formData.value.vcomponent = ''
      formData.value.published = ''
    }

    // fetch categories

    onMounted(async () => {
      const req = await fetch('https://api.geraldox.com/posts/categories')
      if (req.ok) {
        const data = await req.json()
        categories.value = data
      }
    })

    //  deep option of the watch function.
    //This option allows you to watch nested properties within reactive objects.
    watch(
      () => formData.value,
      (newValue, oldValue) => {
        // This callback will be triggered when 'title' property changes
        //console.log('Title changed from', oldValue, 'to', newValue);

        // if o  check false
        if (!formData.value.customslug) {
          customSlugData.value = newValue.title
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '-')
            .slice(0, 75)
        }
      },
      { deep: true }
    )

    return {
      submitHandler,
      formData,
      serverresponse,
      cleanValues,
      customSlugData,
      categories,
    }
  },
})

app.mount('#root')
