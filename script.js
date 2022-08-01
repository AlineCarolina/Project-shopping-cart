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
  const cartItems = document.querySelector('.cart__items');
  localStorage.setItem('listaCarrinho', cartItems.innerHTML);
  const price = document.querySelector('.total-price');
  localStorage.setItem('preço', price.innerHTML);
};

// ------------------------------------------------------------------------------------


function reloadLocalStorage() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = localStorage.getItem('listaCarrinho');
  const cartPrice = document.querySelector('.total-price');
  cartPrice.innerHTML = localStorage.getItem('preço');
  funcLocalStorage(); 
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
  funcLocalStorage();
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
};

// ------------------------------------------------------------------------------------

function clearButton() {
  const ol = document.querySelector('.cart__items');
  const price = document.querySelector('.total-price');
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    ol.innerHTML = '';
    price.innerHTML = 'Valor total: R$ 0'
    localStorage.clear();
  });  
};

// ------------------------------------------------------------------------------------

window.onload = async () => {
  await getProducts();
  await cartButton();
  await reloadLocalStorage();
  await clearButton();
};
