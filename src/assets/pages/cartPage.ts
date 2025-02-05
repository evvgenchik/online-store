import { data } from '../utils/types';
export const cartPage = () => {
  const cart: data[] = [];
  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  let blockWithCard = '';
  let blockWithTotalPrice = '';
  let data: data = JSON.parse(localStorage.getItem('cart') as string).filter((el: string) => Boolean(el));
  const price = document.querySelector('.price') as HTMLElement;
  const countProduct = document.querySelector('.counter-products') as HTMLElement;
  const getTotal = () => {
    const totalAmount: number = data.reduce((sum: number, el) => el.price * el.count + sum, 0);
    let count: number = data.reduce((sum: number, el) => el.count + sum, 0);
    price.innerHTML = `$${totalAmount}`;
    countProduct.innerHTML = `${count++}`;
    blockWithTotalPrice = ` <div class="block_buy">
    <div class="block_promo-apply">
        <h1 class ="promo-apply__title"></h1>
    </div>
    <div class="discount_price">
</div>
    <div class="block_price">
        <h2 class="total-price__number">Total: $${totalAmount}</h2>
    </div>
    <div class="block_disount">
    <h2 class="total__discount">Discount: <span class="total__discount-number">0</span>%</h2>
</div>
    <div class="block_count">
  <h2 class="total__count">Items: ${--count}</h2>
    </div>
    <div class="block__submit">
        <button class="buy__submit button">SUBMIT</button>
    </div>
  </div>`;
  };
  function renderCart(): void {
    getTotal();
    for (let i = 0; i < data.length; i++) {
      if (data[i] == null) continue;
      blockWithCard += `
        <div class="content__inner cart__product">
            <div class="content__item">
            <a href="/product-detail_${data[i].id}">
            <img src="${data[i].image[0]}" width="300" height="200"alt=""></a>
            <div class="item__info">
                <p class="item__name">${i + 1}.${data[i].name.toUpperCase()}</p>
                <p>${data[i].category.toUpperCase()}/${data[i].company.toUpperCase()}</p>
            </div>
            </div>
            <div class="content__price">
              $${data[i].price}
            </div>
            <div class="content__quantity">
              <button class="counter_minus btn button" data-id="${data[i].id}">-</button>
                ${data[i].count}
              <button class="counter_plus btn button" data-id="${data[i].id}">+</button>
            </div>
            <div class="content__subtotal">
              $${data[i].price * data[i].count}
            </div>
            <button class="delete__product btn button" data-id="${data[i].id}">REMOVE</i></button>
            </div>
            
        `;
    }
  }
  if (localStorage.getItem('cart')) {
    renderCart();
  }
  document.onclick = (event) => {
    const target = event.target as HTMLElement;
    const id = target.dataset.id as string;
    const product = JSON.parse(localStorage.getItem('cart') as string);
    const index = product.findIndex((n: { id: string }) => n.id === id);
    const updateTotal = () => {
      data = product;
      getTotal();
    };
    const deleteItem = (isMinus: boolean) => {
      product.splice(index, 1);
      localStorage.setItem(`cart`, JSON.stringify(product));
      const cartProduct = isMinus ? target.parentElement?.parentElement : target.parentElement;
      cartProduct?.remove();
      if (!product.length) {
        location.reload();
      }
      updateTotal();
    };
    const changeCount = (isMinus: boolean) => {
      if (product[index].stock == 1 && !isMinus) {
        alert('Товар закончился');
        return;
      }
      if (isMinus && product[index].count == 1) {
        deleteItem(true);
      } else {
        if (isMinus && product[index].count) {
          product[index].count--;
          product[index].stock++;
        } else {
          product[index].count++;
          product[index].stock--;
        }
        const counter = isMinus ? <Element>target.nextSibling : <Element>target.previousSibling;
        counter.textContent = ` ${product[index].count} `;
        const cartProduct = <HTMLElement>target.parentElement?.parentElement;
        const cartProductSubtotal = <HTMLElement>cartProduct.querySelector('.content__subtotal');
        const subtotal = `$${(product[index].price as number) * (product[index].count as number)}`;
        cartProductSubtotal.textContent = subtotal;
      }
      localStorage.setItem(`cart`, JSON.stringify(product.filter((el: string) => Boolean(el))));
      updateTotal();
    };
    if (target.classList.contains('delete__product')) deleteItem(false);
    if (target.classList.contains('counter_minus')) changeCount(true);
    if (target.classList.contains('counter_plus')) changeCount(false);
  };
  return ` <div class="history">
<div class="container">
<div class="navigation-main__block">
<h3>
  <a href="/">Home</a>
</h3>
<h3>/</h3>
<h3>
  <a href="/cart">Cart</a>
</h3>
</div>
</div>
</div>
<div class="container__cart">
<div class="container">
<div class="content__control">
  <h3 class="control-content__title">Products In Cart</h3>
  <div class="control-content__pgn pgn">
    <div class="pgn__limit">
      <span class="limit-pgn__text">Limit:</span>
      <input type="number" value="1" min = "1"  class="limit-pgn__input">
    </div>
    <div class="pgn__page">
      <span class="page-pgn__text">Page:</span>
      <button class="page-pgn__button-left button"><</button>
      <span class="page-pgn__number">1</span>
      <button class="page-pgn__button-right button">></button>
    </div>
  </div>
</div>
  <div class="content__inner">
    <h4>Item</h4>
    <h4>Price</h4>
    <h4>Quantity</h4>
    <h4>Subtotal</h4>
    <h5></h5>
  </div>
  <div class = "products-container">
  ${blockWithCard}
  </div>
  ${blockWithTotalPrice}
  <div promo>
  <form class="promo__form">
  <div class="promo-list">Applied codes:</div>
    <input type="text" placeholder="Promo for test: 'RS', 'EPM'" class="promo__input">
    <button class="promo__button button" type="submit">Check</button>
    <div class="promo__codes">
    <p class="codes__apply1"></p>
    <p class="codes__apply2"></p>
  </div>
  </form>
</div>
</div>
</div>

<div class= "popup-wrapper">
  <div class="popup">
  <form class="popup__container form__popup">
    <h2 class="popup__title">Personal details </h2>
    <div class="popup__person">
      <div class="popup__name popup__input-container">
        <input type="text" placeholder="Name" class="popup__name-input popup__input">
      </div>
      <div class="popup__phone popup__input-container">
        <input type="phone" placeholder="Phone" class="popup__phone-input popup__input">
      </div>
      <div class="popup__address popup__input-container">
        <input type="text" placeholder="Address" class="popup__address-input popup__input">
      </div>
      <div class="popup__email popup__input-container">
        <input type="text" placeholder="E-mail" class="popup__email-input popup__input">
      </div>
    </div>
    <div class="popup__card">
      <div class="card__container">
        <h2 class="popup__title">Card details</h2>
        <img src="./img/no-logo.webp" alt="card form" class="card__form">
        <div class="card__number">
          <input type="text" placeholder="Card number" class="card__number_input popup__input">
        </div>
        <div class="card__data">
          <input maxlength="5" type="text" placeholder="Month/Year" class="card__data_input popup__input">
        </div>
        <div class="card__code">
          <input type="number" placeholder="CVV" class="card__code_input popup__input">
        </div>
      </div>
    </div>
    <button class="popup__button button">Confirm</button>
  </form>
  </div>
</div>
`;
};
