function loading() {
  const txt = document.querySelector('.loading');
  txt.innerText = 'Loading...';
  document.body.appendChild(txt);
};

// ------------------------------------------------------------------------------------

function removeLoading() {
  document.getElementsByClassName('loading')[0].remove();
};

// ------------------------------------------------------------------------------------

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

// ------------------------------------------------------------------------------------

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

// ------------------------------------------------------------------------------------

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

// ------------------------------------------------------------------------------------

async function getProducts() {
  loading();
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((result) => result.results)
    .then((dados) => {
      removeLoading();
      const items = document.querySelector('.items');
      dados.map(({ id: sku, title: name, thumbnail: image }) =>
        items.appendChild(createProductItemElement({ sku, name, image })));
    });
};

// ------------------------------------------------------------------------------------

function cartButton() {
  const buttons = document.querySelectorAll('.item__add'); 
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const id = event.target.parentElement.firstChild.innerText;
      return createCart(id);
    });
  });
};

// ------------------------------------------------------------------------------------

function cartItemClickListener(event) {
  event.target.remove();
  funcLocalStorage(); 
  sumPrices();
};

// ------------------------------------------------------------------------------------

function funcLocalStorage() {
  const itemsCar = '.cart__items';
  const cartItems = document.querySelector(itemsCar);
  localStorage.setItem('listaCarrinho', cartItems.innerHTML);
};

// ------------------------------------------------------------------------------------

function createCartItemElement({ sku, name, salePrice }) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  funcLocalStorage();
  return li;
};

// ------------------------------------------------------------------------------------

async function sumPrices() {
  const computers = [...document.querySelectorAll('li.cart__item')];
  const getPrices = computers.reduce((acc, li) => Number(li.innerText.split('$')[1]) + acc, 0);
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = `Valor total: R$ ${getPrices}`;
};

// ------------------------------------------------------------------------------------

function createCart(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((object) => {
      createCartItemElement({ sku: object.id, name: object.title, salePrice: object.price });
      sumPrices();
  });
};

// ------------------------------------------------------------------------------------

};

// // Requisito 5
// const somaProdutos = ({ price }) => {
//   const cartItems  = document.querySelector(itemsCar);
//   const priceItems = document.createElement('section');
//   priceItems.className = 'total-price';
//   const soma = price + price;
//   priceItems.innerText = `Preço Total: R$${soma}`;
//   cartItems.appendChild(priceItems);
// };

// Requisito 6
const btnLImpar = () => {
  const ol = document.querySelector(itemsCar);
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    ol.innerHTML = '';
  });  
};

window.onload = async () => {
  await criaProdutos();
  await btnCarrinho();
  await reloadLocalStorage();
  await btnLImpar();
};
