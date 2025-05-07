function produtosComprados(){
    const listJson = localStorage.getItem('minhasCompras');
    const listProds = listJson ? JSON.parse(listJson) : [];

    const container = document.getElementById('productList');
    container.innerHTML = ''; 

    if (listProds.length === 0) {
        container.innerHTML = '<p class="empty">Você ainda não comprou nenhum produto.</p>';
        return;
    }

    listProds.forEach(prod => {
        
        const imgUrl = prod.urlImagem && prod.urlImagem.trim() !== ''
          ? prod.urlImagem
          : 'img/generica.jpg';
        const precoNum = typeof prod.valor === 'number'
          ? prod.valor
          : parseFloat(prod.valor) || 0;
    
      
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
          <img src="${imgUrl}" alt="${prod.descricao || 'Produto'}">
          <h2 class="product-name">${prod.descricao || '—'}</h2>
          <p class="product-description">${prod.descricao || ''}</p>
          <span class="product-price">R$ ${precoNum.toFixed(2).replace('.', ',')}</span>
        `;
        container.appendChild(card);
      });
}

function getNotificacoes(){
    const listJson = localStorage.getItem('notificacao') || '[]';
    const notificacoes = listJson ? JSON.parse(listJson) : [];

    const listJson2 = localStorage.getItem('alertas') || '[]';
    const alertas = listJson2 ? JSON.parse(listJson2) : [];
    
    const container = document.querySelector('.notification-list');
    if (!container) return;

    function formatData(ts) {
        const d = new Date(ts);
        return d.toLocaleString('pt-BR', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        });
      }
    
      notificacoes.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('notification-item');
        li.innerHTML = `
          <div class="notification-content">
            <p>${item.mensagem}</p>
            <span class="timestamp">${formatData(item.timestamp)}</span>
          </div>
        `;
        container.appendChild(li);
      });

      alertas.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('notification-item');
        li.innerHTML = `
          <div class="notification-content">
            <p>Alerta de preço desejado cadastrado para ${item.descricao}: ${item.precoDesejado}</p>
            <span class="timestamp">${formatData(item.criadoEm)}</span>
          </div>
        `;
        container.appendChild(li);
      });

      if (notificacoes.length === 0 && alertas.length === 0) {
        container.innerHTML = `
          <li class="notification-item">
            <div class="notification-content">
              <p>Nenhuma notificação disponível.</p>
            </div>
          </li>
        `;
      }

}

document.addEventListener("DOMContentLoaded", async () => {
    produtosComprados();
    getNotificacoes();
})