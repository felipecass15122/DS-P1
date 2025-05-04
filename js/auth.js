$(document).ready(function() {
    // Inicializa a validação no form com id="formulario"
    $("#formulario").validate({
      rules: {
        login: { required: true },
        senha: { required: true }
      },
      messages: {
        login: { required: "Campo obrigatório" },
        senha: { required: "Campo obrigatório" }
      },
      errorPlacement: function(error, element) {
        error.insertAfter(element);
      },
      submitHandler: function(form) {
        // Quando o formulário for válido, chama a função de autenticação
        autenticar();
      }
    });
  });
  
  // Função assíncrona para autenticar o usuário
  async function autenticar() {
    // Só executa se o form estiver válido
    if ($("#formulario").valid()) {
      const login = $("#login").val();
      const senha = $("#senha").val();
  
      try {
        // Ajuste a URL para seu endpoint real
        const resposta = await fetch(
          `https://api-odinline.odiloncorrea.com/usuario/${login}/${senha}/autenticar`
        );
        const usuario = await resposta.json();
        console.log("id: " + usuario.id);
  
        if (usuario.id && usuario.id > 0) {
          localStorage.setItem("usuarioAutenticado", JSON.stringify(usuario));
          window.location.href = "minhasCompras.html";
        } else {
          alert("Usuário ou senha inválidos.");
        }
      } catch (error) {
        console.error(error);
        alert("Erro ao tentar autenticar.");
      }
    }
  }
  