import * as jwt from 'jsonwebtoken'

(function () {
  const clientEl = document.querySelector('.client')
  let token = window.localStorage.getItem('token')
  let clientId = window.localStorage.getItem('clientId')
  if (clientId) {
    clientEl.innerText = clientId
  }

  const register = async function () {
    const res = await fetch('http://0.0.0.0:1337/register', {
      method: 'POST'
    })
    const data = await res.json()

    token = data.token
    window.localStorage.setItem('token', token)

    clientId = jwt.decode(data.token).clientId
    window.localStorage.setItem('clientId', clientId)
    clientEl.innerText = clientId
  }

  const getSomething = async function () {
    const res = await fetch('http://0.0.0.0:1337/something', {
      headers: {
        'Authorization': 'JWT ' + token
      }
    })

    const data = await res.json()
    console.log(data)
  }

  const getSomethingElse = async function () {
    const res = await fetch('http://0.0.0.0:1337/something-else', {
      headers: {
        'Authorization': 'JWT ' + token
      }
    })

    const data = await res.json()
    console.log(data)
  }

  window.register = register
  window.getSomething = getSomething
  window.getSomethingElse = getSomethingElse
})()
