const currentPageUrl = window.location.href;
const params = new URL(currentPageUrl).searchParams;
const page = params.get('page');

console.log(page)


document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const form = event.target
  const formData = new FormData(form)
  const credencials = Object.fromEntries(formData)

  fetch(`/login?page=${page ? page : ''}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(credencials),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    if (data.redirectUrl) {
      // Redirect the client to the specified URL
    ///  console.log(data.redirectUrl)
      window.location.href = data.redirectUrl;
    } else {
      // Handle other responses (e.g., display an error message)
     
    }
  })
    .catch((error) => {
      console.error('Error:', error)
    })
})