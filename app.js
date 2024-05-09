// Seleciona elementos HTML relevantes
let cartTab = document.querySelector('.cartTab'); // Seleciona o elemento com a classe 'cartTab'
let cartTabSpan = document.querySelector('.cartTabSpan'); // Seleciona o elemento com a classe 'cartTabSpan'
let bag = document.querySelector('.bag'); // Seleciona o elemento com a classe 'bag'
let body = document.querySelector('body'); // Seleciona o elemento 'body'
let close = document.querySelector('.cartTab .btn .close'); // Seleciona o botão de fechar do carrinho
let listProductHtml = document.querySelector('.listProduct'); // Seleciona a lista de produtos na página
let listCartHTML = document.querySelector('.listCartTab'); // Seleciona a lista de produtos no carrinho

// Arrays para armazenar produtos e itens do carrinho
let products = [];
let cart = [];

// Event listener para abrir o carrinho ao clicar no ícone de sacola
bag.addEventListener('click', () => {
    body.classList.add('showCart'); // Adiciona a classe 'showCart' ao corpo do documento para exibir o carrinho
})

// Event listener para fechar o carrinho ao clicar no botão de fechar
close.addEventListener('click', () =>{
    console.log('Close button clicked'); // Registra no console que o botão de fechar foi clicado
    body.classList.remove('showCart'); // Remove a classe 'showCart' do corpo do documento para ocultar o carrinho
})

// Função para adicionar dados dos produtos ao HTML da página
const addDataToHtml = () => {
    // Limpa a lista de produtos HTML
    listProductHtml.innerHTML = '';
    // Verifica se há produtos a serem exibidos
    if(products.length > 0) {
        // Itera sobre cada produto
        products.forEach(product => {
            // Cria um novo elemento para o produto
            let newProduct = document.createElement('div');
            // Adiciona a classe 'item' ao elemento
            newProduct.classList.add('item');
            // Define o atributo 'data-id' como o ID do produto
            newProduct.dataset.id = product.id;
            // Define o HTML interno do elemento com os detalhes do produto
            newProduct.innerHTML = `
                <img src="${product.image}">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addToCart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-bag" viewBox="0 0 16 16">
                        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
                    </svg>
                </button>
            `;
            // Adiciona o novo produto à lista de produtos na página
            listProductHtml.appendChild(newProduct);
        })
    } 
}

// Event listener para adicionar produtos ao carrinho ao clicar no botão 'Adicionar ao Carrinho'
listProductHtml.addEventListener('click', (event) => {
    let positionClick = event.target;
    let itemElement = positionClick.closest('.item');
    if(itemElement){
        let id_product = itemElement.dataset.id;
        addToCart(id_product);
    }
    console.log('Clicked addToCART'); // Registra no console que o botão 'Adicionar ao Carrinho' foi clicado
})

// Função para adicionar um produto ao carrinho
const addToCart = (product_id) => {
    // Verifica se o produto já está no carrinho
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    // Adiciona o produto ao carrinho
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if(positionThisProductInCart < 0){
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    console.log('Cart after addToCart:', cart); // Registra no console o estado atual do carrinho após a adição do produto
    addCartToHTML(); // Atualiza o carrinho no HTML
    addCartToMemory(); // Salva o carrinho na memória
}

// Função para salvar o carrinho na memória local
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Função para adicionar o carrinho ao HTML
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity = totalQuantity + item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            let itemPrice = info.price * item.quantity;  // Recalcula o preço com base na quantidade
            totalPrice += itemPrice;

            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="image">
                <img src="${info.image}" alt="">
            </div>
            <div class="name">${info.name}</div>
            <input type="number" value="${item.quantity}" class="cart-quantity">
            <div class="priceTab">$${itemPrice.toFixed(2)}</div>  <!-- Mostra o preço recalculado -->
            <div class="delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                </svg>
            </div>
            `;
        });
    }

    // Atualiza o total no carrinho
    document.querySelector('.total-price').innerText = `${totalPrice.toFixed(2)}`;

    // Atualiza o preço total na classe 'total'
    document.querySelector('.total-price').innerText = `${totalPrice.toFixed(2)}`;
}

// Event listener para remover itens do carrinho ao clicar no botão de exclusão
listCartHTML.addEventListener('click', (event) => {
    let deleteButton = event.target.closest('.delete');
    if (deleteButton) {
        let itemElement = deleteButton.closest('.item');
        if (itemElement) {
            let id_product = itemElement.dataset.id;
            removeFromCart(id_product);
        }
    }
});

// Função para remover um item do carrinho
const removeFromCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if (positionThisProductInCart >= 0) {
        cart.splice(positionThisProductInCart, 1);
        console.log('Item removed from cart:', product_id); // Registra no console que o item foi removido do carrinho
        addCartToHTML(); // Atualiza o carrinho no HTML
        addCartToMemory(); // Salva o carrinho na memória
    }
}

// Event listener para atualizar a quantidade de itens no carrinho ao modificar a quantidade
listCartHTML.addEventListener('change', (event) => {
    let quantityInput = event.target.closest('.cart-quantity');
    if (quantityInput) {
        let itemElement = quantityInput.closest('.item');
        if (itemElement) {
            let id_product = itemElement.dataset.id;
            let newQuantity = parseInt(quantityInput.value, 10);

            updateQuantityInCart(id_product, newQuantity);
        }
    }
});

// Função para atualizar a quantidade de um produto no carrinho
const updateQuantityInCart = (product_id, newQuantity) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if (newQuantity <= 0) {
        // Se a nova quantidade for zero ou menor, remova o item do carrinho
        cart.splice(positionThisProductInCart, 1);
    }
    else{
        cart[positionThisProductInCart].quantity = newQuantity;
        console.log('Quantity updated in cart:', product_id, newQuantity); // Registra no console que a quantidade foi atualizada no carrinho
    }
    addCartToHTML(); // Atualiza o carrinho no HTML
    addCartToMemory(); // Salva o carrinho na memória
}

// Função de inicialização da aplicação
const initApp = () => {
    // Obtém dados do produto e inicializa a aplicação
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHtml();
    })
}

initApp(); // Inicializa a aplicação
