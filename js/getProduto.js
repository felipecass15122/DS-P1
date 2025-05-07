var comprar = document.getElementById('comprar');
var alerta = document.getElementById('alerta');
    
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
  
   
    let compras = JSON.parse(localStorage.getItem('minhasCompras')) || [];
    let notificacoes = JSON.parse(localStorage.getItem('notificacao')) || [];
  
    
    compras.push(produto);
   
    const valorFormatado = parseFloat(produto.valor).toFixed(2).replace('.', ',');
    const mensagem = `Você comprou “${produto.descricao}” por R$ ${valorFormatado}.`;

  // Adiciona a notificação à lista
  notificacoes.push({
    mensagem,
    timestamp: new Date().toISOString()
  });
  
    // Salva a lista atualizada no localStorage
    localStorage.setItem('minhasCompras', JSON.stringify(compras));
    localStorage.setItem('notificacao', JSON.stringify(notificacoes))
  
    alert("Produto adicionado às suas compras!");
  }

  async function gerarAlerta(){
    console.log("Função ativarAlertaDePreco chamada.");

    const produto = await getProd();
    if (!produto) {
      window.alert("Produto não encontrado!");
      return;
    }
  
    console.log(`Produto encontrado: ${produto.descricao}`);
  
    // Adiciona um try-catch para capturar possíveis erros
    try {

      const alertas = JSON.parse(localStorage.getItem('alertas')) || []; 

      const alertaExistente = alertas.some(alerta => alerta.id === produto.id);

      if (alertaExistente) {
        alert('Alerta para produto já cadastrado');
        return;
      }
      
      const atualFmt = parseFloat(produto.valor).toFixed(2).replace('.', ',');
      const precoDesejadoStr = window.prompt(
        `Informe o preço desejado para "${produto.descricao}" (atual: R$ ${atualFmt}):`
      )?.trim();
  
      console.log(`Valor digitado: ${precoDesejadoStr}`);
  
      if (precoDesejadoStr === null || precoDesejadoStr === "") {
        console.log("Prompt cancelado ou vazio.");
        return; 
      }
  
      const precoDesejado = parseFloat(precoDesejadoStr.replace(',', '.'));
      if (isNaN(precoDesejado) || precoDesejado <= 0) {
        window.alert("Preço inválido. Tente novamente.");
        console.log("Preço inválido informado.");
        return;
      }
  
      
      const alertaObj = {
        id: produto.id,
        descricao: produto.descricao,
        valorAtual: Number(produto.valor),
        precoDesejado,
        criadoEm: new Date().toISOString()
      };
  
      alertas.push(alertaObj);
      localStorage.setItem('alertas', JSON.stringify(alertas));

 

      alert(
         `Alerta criado! Você será avisado quando "${produto.descricao}" chegar a R$ ${precoDesejado}.`
      );
  
      console.log("Alerta salvo com sucesso.");
    } catch (error) {
      console.error("Erro ao definir alerta:", error);
    }

    window.location.reload();
  }
  
  comprar.addEventListener('click', comprarProduto);
  alerta.addEventListener('click', gerarAlerta);
  