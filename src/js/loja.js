if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ler)
} else {
  ler()
}

const navBar = document.querySelector("nav");

function abrirMenu() { 
  navBar.classList.toggle("open");
}
 
var totalFinal = "0,00";
var qtdItem = 0;

function mudarQtdItem(qtdItem) {
  let add = document.querySelector("#adic-produto-"+qtdItem),
    sub = document.querySelector("#sub-produto-"+qtdItem);
  
  // alert("qtd-produto-"+qtdItem)

  add.addEventListener("click", () => {
    const idItem = add.id.split("-")[2]
    const qtdAntigo = document.querySelector("#qtd-produto-" + idItem).innerText;
    const qtdNovo = parseInt(qtdAntigo) + 1;
    // alert('Quantidade antiga: ' + qtdAntigo)
    // alert('Quantidade antiga inteiro: ' + parseInt(qtdAntigo))
    // alert('Quantidade nova: ' + qtdNovo)
    document.querySelector("#qtd-produto-" + idItem).innerText = qtdNovo;

    atualizarTotal()
  });

  sub.addEventListener("click", () => {
    const idItem = sub.id.split("-")[2]
    const qtdAntigo = document.querySelector("#qtd-produto-" + idItem).innerText;
    const qtdNovo = parseInt(qtdAntigo) - 1;
    if(qtdNovo > 0){
      document.querySelector("#qtd-produto-" + idItem).innerText = qtdNovo;
    }else{
      document.querySelector("#qtd-produto-" + idItem).parentElement.parentElement.parentElement.parentElement.remove();
    }
    atualizarTotal()
  }); 

}


function ler() {
  // Botão remover produto
  const btnRemoverProdutoCarrinho = document.getElementsByClassName("btn-remover-produto")
  for (var i = 0; i < btnRemoverProdutoCarrinho.length; i++) {
    btnRemoverProdutoCarrinho[i].addEventListener("click", removerProduto)
  }

  // Botão add produto ao carrinho
  const btnAddProdutoCarrinho = document.getElementsByClassName("btn-add-carrinho")
  for (var i = 0; i < btnAddProdutoCarrinho.length; i++) {
    btnAddProdutoCarrinho[i].addEventListener("click", addProdutoCarrinho)
  }

  // Botão finalizar compra
  const btnFinalizarCompra = document.getElementsByClassName("btn-finalizar-compra")[0]
  btnFinalizarCompra.addEventListener("click", finalizarCompra)
}

function removerProduto(event) {
  event.target.parentElement.parentElement.parentElement.parentElement.remove()
  atualizarTotal()
}

function addProdutoCarrinho(event) {
  const button = event.target
  console.log(button)
  const informacoesProduto = button.parentElement.parentElement;
  const imagemProduto = informacoesProduto.getElementsByClassName("img-produto")[0].src;
  const nomeProduto = informacoesProduto.getElementsByClassName("nome-produto")[0].innerText;
  const precoProduto = informacoesProduto.getElementsByClassName("valor-produto")[0].innerText;

  const nomesProdutosCarrinho = document.getElementsByClassName("titulo-produto-carrinho")
  //se o produto já estiver no carrinho, apenas muda a qtd no carrinho ao invés de add de novo o mesmo produto
  for (var i = 0; i < nomesProdutosCarrinho.length; i++) {
    if (nomesProdutosCarrinho[i].innerText === nomeProduto) {
      nomesProdutosCarrinho[i].parentElement.parentElement.getElementsByClassName("qtd-produto")[0].innerText++
      atualizarTotal();
      if(navBar.className.indexOf('open') == -1){
        abrirMenu()
      }
      return
    }
  }

  let novoProdutoCarrinho = document.createElement("div")
  novoProdutoCarrinho.classList.add("produto-carrinho")

  novoProdutoCarrinho.innerHTML =
    `
        <div class="identificacao-produto">
          <img src="${imagemProduto}" alt="${nomeProduto}" class="img-produto">

          <div class='div-produto-carrinho'>
            <div class="nome-lixeira">
              <span class="titulo-produto-carrinho titulo">${nomeProduto}</span>
              <img src="/assets/icons/trash.svg" alt="" class="btn-remover-produto">
            </div>

            <div>
              <strong class="preco-produto-carrinho">${precoProduto}</strong>
              <button class="sub" id="sub-produto-${qtdItem}">
                <img src="/assets/icons/minus.svg" alt="">
              </button>

              <span class="qtd-produto" id="qtd-produto-${qtdItem}">1</span>

              <button class="add" id="adic-produto-${qtdItem}">
                <img src="/assets/icons/plus.svg" alt="">
              </button>
            </div>
          </div>

        </div>
      `

  const tabelaProdutos = document.querySelector(".main-carrinho .itens-carrinho")
  tabelaProdutos.append(novoProdutoCarrinho)
  
  mudarQtdItem(qtdItem)
  atualizarTotal()
  qtdItem++

  if(navBar.className.indexOf('open') == -1){
    abrirMenu()
  }

  novoProdutoCarrinho.getElementsByClassName("btn-remover-produto")[0].addEventListener("click", removerProduto)
}

function finalizarCompra() {
  if (totalFinal === "0,00") {
    alert("Seu carrinho está vazio!")
  } else {
    alert(
      `
          Obrigado pela sua compra!
          Valor do pedido: R$${totalFinal}\n
          Volte sempre :)
        `
    )

    document.querySelector(".main-carrinho .itens-carrinho").innerHTML = ""
    atualizarTotal()
  }
}

// Atualizar o valor total do carrinho
function atualizarTotal() {
  const produtosCarrinho = document.getElementsByClassName("produto-carrinho")
  totalFinal = 0

  for (var i = 0; i < produtosCarrinho.length; i++) {
    // console.log(produtosCarrinho[i].getElementsByClassName("preco-produto-carrinho"))
    const precoProduto = produtosCarrinho[i].getElementsByClassName("preco-produto-carrinho")[0].innerText.replace("R$", "").replace(",", ".")
    const qtdProduto = produtosCarrinho[i].getElementsByClassName("qtd-produto")[0].innerText

    totalFinal += precoProduto * qtdProduto
  }

  totalFinal = totalFinal.toFixed(2)
  totalFinal = totalFinal.replace(".", ",")
  document.querySelector(".total-container span").innerText = "R$" + totalFinal
}