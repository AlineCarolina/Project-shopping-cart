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
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const itemsCar = '.cart__items';

// Requisito 4
const funcLocalStorage = () => {
  const cartItems = document.querySelector(itemsCar);
  localStorage.setItem('listaCarrinho', cartItems.innerHTML);
};

const reloadLocalStorage = () => {
  const cartItems = document.querySelector(itemsCar);
  cartItems.innerHTML = localStorage.getItem('listaCarrinho');
  funcLocalStorage(); 
};

// Requisito 3
function cartItemClickListener(event) {
  const cartItems = document.querySelector(itemsCar);
  cartItems.removeChild(event.target);
  funcLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  funcLocalStorage();
  return li;
}

// Requisito 1
const criaProdutos = async () => {
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

// Requisito 2
const criaCarrinho = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((object) => {
      createCartItemElement({ sku: object.id, name: object.title, salePrice: object.price });
      // somaProdutos({ price: object.price });
  });
};

const btnCarrinho = () => {
  const buttons = document.querySelectorAll('.item__add'); 
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const id = event.target.parentElement.firstChild.innerText;
      return criaCarrinho(id);
    });
  });
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
