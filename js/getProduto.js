var comprar = document.getElementById('comprar');
    

async function getProd() {
    const urlParams = window.location.search;
    const params = new URLSearchParams(urlParams);
    const id = params.get("produto");
  
    if (!id) {
      alert('ID do produto não informado.');
      return null;
    }
  
    const url = `https://api-odinline.odiloncorrea.com/produto/${id}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
  
      if (!response.ok) {
        throw new Error(`Erro ao buscar produto: ${response.status} ${response.statusText}`);
      }
  
      let produto;
      try {
        produto = await response.json();
      } catch (jsonErr) {
        throw new Error("Erro ao processar JSON da resposta.");
      }
  
      return produto;
  
    } catch (err) {
      console.error(err);
      alert('Erro ao tentar buscar o produto.');
      return null;
    }
  }

  function renderizaProduto(produto) {
    if (!produto) return;
  
    document.getElementById("product-img").src = produto.urlImagem;
    document.getElementById("product-title").textContent = produto.descricao;
    document.getElementById("product-desc").textContent = "Confira os detalhes do produto disponível.";
    document.getElementById("product-price").textContent = `R$ ${parseFloat(produto.valor).toFixed(2).replace('.', ',')}`;
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const produto = await getProd();
    renderizaProduto(produto);
  });
  

  async function comprarProduto() {
    const produto = await getProd();
    if (!produto) {
      alert("Produto não encontrado!");
      return;
    }
  
    // Recupera as compras existentes ou cria uma nova lista
    let compras = JSON.parse(localStorage.getItem('minhasCompras')) || [];
  
    // Adiciona o novo produto
    compras.push(produto);
  
    // Salva a lista atualizada no localStorage
    localStorage.setItem('minhasCompras', JSON.stringify(compras));
  
    alert("Produto adicionado às suas compras!");
  }
  
  comprar.addEventListener('click', comprarProduto);
  