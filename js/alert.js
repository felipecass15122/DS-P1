async function sendAlert() {
  try {
    let prodsAlert = JSON.parse(localStorage.getItem('alertas')) || [];
    let updatedAlerts = [];

    for (const element of prodsAlert) {
      const id = element.id;
      const precoDesejado = element.precoDesejado;

      const url = `https://api-odinline.odiloncorrea.com/produto/${id}`;

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
          console.error(`Erro ao buscar produto: ${response.status} ${response.statusText}`);
          updatedAlerts.push(element);
          continue;
        }

        const produto = await response.json();

        if (produto.valor <= precoDesejado) {
          alert(`${produto.descricao} alcançou o valor desejado de R$ ${precoDesejado.toFixed(2)}`);
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
        } else {

          updatedAlerts.push(element);
        }

      } catch (err) {
        console.error(`Erro ao buscar produto ${id}:`, err);
        updatedAlerts.push(element);
      }
    }

    // Atualiza a lista de alertas no localStorage
    localStorage.setItem('alertas', JSON.stringify(updatedAlerts));
    window.location.reload();

  } catch (err) {
    console.error("Erro ao processar alertas:", err);
    alert('Erro ao tentar verificar os alertas.');
  }
}


setInterval(sendAlert, 5000);