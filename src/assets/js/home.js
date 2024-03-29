// Função para mostrar o texto letra por letra
function showText(el, text, interval) {
  var index = 0;
  var timer = setInterval(function() {
    if (index < text.length) {
      el.innerHTML += text[index];
      index++;
    } else {
      clearInterval(timer);
    }
  }, interval);
}

// Função para animar a mensagem
function animateMessage() {
  var mensagemContainer = document.getElementById('mensagem_boas_vindas');
  mensagemContainer.style.left = '30px'; /* ou ajuste conforme necessário */
  setTimeout(function() {
    mensagemContainer.style.left = '-400px'; /* ou ajuste conforme necessário */
    setTimeout(function() {
      mensagemContainer.classList.add('hide');
    }, 1000); // 1 segundo para esconder a mensagem após a animação de saída
  }, 6000); // 4 segundos para manter a mensagem na tela
}

// Espera 3 segundos após o carregamento da página
setTimeout(function() {
  var mensagem = document.getElementById('welcome_message');
  var text = "Olá, vamos praticar?";
  var interval = 100;

  // Inicia a digitação da mensagem
  showText(mensagem, text, interval);

  // Inicia a animação da mensagem
  animateMessage();
}, 5000); // 3 segundos antes de começar a animação
