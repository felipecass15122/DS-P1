// produtos.js
// Script para buscar e renderizar produtos do usuário
document.addEventListener('DOMContentLoaded', async () => {
    const produtos = await getProds();
    if (produtos.length) {
      renderizaProdutos(produtos);
    } else {
      document.getElementById('productList').innerHTML = '<p>Nenhum produto encontrado.</p>';
    }
  });

async function getProds() {
    // 1. Pega o JSON do usuário e extrai a chave
    const usuarioStr = localStorage.getItem('usuarioAutenticado');
    if (!usuarioStr) {
      console.error('Não há usuário autenticado no localStorage.');
      alert('Por favor, faça o login antes de ver seus produtos.');
      return [];
    }
  
    let usuario;
    try {
      usuario = JSON.parse(usuarioStr);
    } catch (e) {
      console.error('Erro ao parsear usuarioAutenticado:', e);
      alert('Dados de usuário corrompidos. Faça login novamente.');
      return [];
    }
  
    const { chave } = usuario;
    if (!chave) {
      console.error('Chave de usuário não encontrada:', usuario);
      alert('Token de acesso inválido. Faça login novamente.');
      return [];
    }
  
    // 2. Chama o endpoint
    const url = `https://api-odinline.odiloncorrea.com/produto/${encodeURIComponent(chave)}/usuario`;
    try {
      const response = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
  
      if (!response.ok) {
        // Tratamento genérico de erros HTTP
        throw new Error(`Erro ao buscar produtos: ${response.status} ${response.statusText}`);
      }
  
      const produtos = await response.json();
      // Aqui você pode chamar outra função para renderizar os produtos na UI
      // renderizaProdutos(produtos);
      return produtos;
  
    } catch (err) {
      console.error(err);
      alert('Erro ao tentar buscar os produtos.');
      return [];
    }
  }

  function renderizaProdutos(produtos) {
    const container = document.getElementById('productList');
    container.innerHTML = ''; // limpa o container
  
    produtos.forEach(prod => {
      // Cria o elemento card
      const card = document.createElement('div');
      card.classList.add('product-card');
    
      const imgUrl = prod.urlImagem && prod.urlImagem.trim() !== ''
      ? prod.urlImagem
      : './img/1311423.png';

      card.innerHTML = `
        <img src="${imgUrl}" alt="${prod.descricao}" class = "img-prods">
        <h2 class="product-name">${prod.descricao}</h2>
        <p class="product-description">${prod.descricao || ''}</p>
        <span class="product-price">R$ ${prod.valor.toFixed(2)}</span>
        <button class="btn details" data-id="${prod.id}">Detalhes</button>
      `;
  
      container.appendChild(card);
    });
  
    // Exemplo: adicionar listener aos botões “Detalhes”
    container.querySelectorAll('.btn.details').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.currentTarget.dataset.id;
        // redireciona para a página de detalhes ou abre modal
        window.location.href = `detalhes.html?produto=${id}`;
      });
    });
  }
