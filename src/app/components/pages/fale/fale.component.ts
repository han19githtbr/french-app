import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fale',
  templateUrl: './fale.component.html',
  styleUrls: ['./fale.component.css']
})
export class FaleComponent implements OnInit {
  isRecording: boolean = false;
  content: string = '';
  timerValue: number = 120; // 2 minutos em segundos
  timer: any; // Referência ao temporizador
  recognition: any; // Referência ao reconhecimento de fala
  savedContents: string[] = []; // Array para armazenar o conteúdo salvo
  selectedLanguage: string = 'fr-FR'; // Idioma padrão para gravação

  constructor(private toastr: ToastrService) {}


  ngOnInit() {
    const savedContents = localStorage.getItem('savedContents');

    if (savedContents) {
      this.savedContents = JSON.parse(savedContents);
    }
  }

  toggleRecording() {
    if (!this.isRecording) {
      this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  startRecording() {
    this.isRecording = true;

    // Iniciar temporizador apenas se não estiver gravando
    if (!this.timer) {
      this.startTimer();
    }

    // Iniciar o reconhecimento de fala com o idioma selecionado
    this.recognition = new (<any>window).webkitSpeechRecognition();
    this.recognition.lang = this.selectedLanguage;

    this.recognition.onresult = (event: any) => {
      // Adicionar o resultado ao conteúdo enquanto a gravação está ocorrendo
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          this.content += event.results[i][0].transcript + ' ';
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      if (event.error !== 'no-speech') { // Ignorar erros devido a silêncio
        console.error('Erro ao gravar:', event.error);
        alert('Erro ao gravar. Por favor, tente novamente.');
        this.stopRecording();
      }
    };

    this.recognition.onend = () => {
      // Reiniciar a gravação quando termina, apenas se o botão "Parar Gravação" não tiver sido clicado
      if (this.isRecording) {
        this.startRecording();
      }
    };

    this.recognition.start();
  }

  stopRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      // Parar o reconhecimento de fala
      this.recognition.stop();
      // Parar o temporizador
      clearInterval(this.timer);
      // Reiniciar o temporizador para 2 minutos
      this.timerValue = 120;
      // Definir o temporizador como null para indicar que não está em execução
      this.timer = null;

      // Exibir toast personalizado
      this.toastr.success('Conteúdo gravado com sucesso', 'Gravação concluída', {
        toastClass: 'toast-custom',
        progressBar: true,
        closeButton: true,
        timeOut: 3000, // 3000 milissegundos = 3 segundos
        positionClass: 'toast-bottom-right', // Posição do toast
        tapToDismiss: false
      });
    }
  }


  showToast() {
    this.toastr.success('Mensagem de exemplo', 'Título do Toast', {
      closeButton: true
    });
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.timerValue > 0) {
        this.timerValue--;
        // Mudar a cor do temporizador para vermelho quando passar de 60 segundos
        if (this.timerValue <= 60) {
          const timerElement = document.getElementById('timer');
          if (timerElement) {
            timerElement.style.color = 'red';
          }
        }
      } else {
        clearInterval(this.timer); // Parar o temporizador quando o tempo acabar
        alert('O tempo acabou.');
        this.reset(); // Reiniciar a aplicação
      }
    }, 1000); // Atualizar a cada segundo
  }

  saveContent() {
    if (this.content.trim() !== '') {
      this.savedContents.push(this.content.trim());
      this.content = '';

      localStorage.setItem('savedContents', JSON.stringify(this.savedContents));

      this.toastr.success('Texto salvo com sucesso', 'Gravação concluída', {
        toastClass: 'toast-custom',
        progressBar: true,
        closeButton: true,
        timeOut: 3000, // 3000 milissegundos = 3 segundos
        positionClass: 'toast-bottom-right', // Posição do toast
        tapToDismiss: false
      });

    }
  }

  deleteContent(content: string) {
    const index = this.savedContents.indexOf(content);
    if (index !== -1) {
      this.savedContents.splice(index, 1);

      this.toastr.success('Conteúdo removido com sucesso', 'Remoção concluída', {
        toastClass: 'toast-custom',
        progressBar: true,
        closeButton: true,
        timeOut: 3000, // 3000 milissegundos = 3 segundos
        positionClass: 'toast-bottom-right', // Posição do toast
        tapToDismiss: false
      });

    }
  }

  clearContent() {
    this.content = '';
  }

  reset() {
    this.stopRecording();
    this.content = '';
    this.timerValue = 120;
    this.timer = null;
  }

  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = seconds % 60;
    const minutesStr: string = minutes < 10 ? '0' + minutes : String(minutes);
    const secondsStr: string = remainingSeconds < 10 ? '0' + remainingSeconds : String(remainingSeconds);
    return `${minutesStr}:${secondsStr}`;
  }
}
