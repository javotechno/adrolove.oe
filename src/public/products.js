const socketClient = io();

const prods = document.getElementById("prods");
const idCart = document.getElementById('idCart').innerText
// const url = document.baseURI.replaceAll('/', ' ').split(' ')

socketClient.emit('mongoProds')

let arr = []

socketClient.on('alert', (e) => {
  if (!!e.error) {
    alert(e.error)
  } else {
    alert(e.message)
  }
})
const render = (e) => {
  console.log(e.docs)
  e.docs.forEach((elem) => {
    const div = document.createElement("div");
    const btn = document.createElement('button')
    const title = document.createElement('p')
    const price = document.createElement('p')
    const owner = document.createElement('p')
    div.className = "prodCard";
    title.innerText = elem.title
    price.innerHTML = `$${elem.price}`
    owner.innerHTML = `Agregado por: ${elem.owner.replace('@', ' ').split(' ')[0]}`
    btn.innerText = "Agregar al carrito"
    btn.addEventListener('click', () => {
      socketClient.emit('addToCart', { obj: elem, idCart: idCart })
    })
    div.appendChild(title)
    div.appendChild(price)
    div.appendChild(owner)
    div.appendChild(btn)
    prods.appendChild(div);
  });
};

socketClient.on('prods', (e) => {
  prods.innerHTML = ''
  render(e)
})