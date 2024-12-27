import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
//import { HeaderComponent } from '../../shared/header/header.component';

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

      if (this.content.trim() === '') {
        // Se o conteúdo estiver vazio, exibe uma mensagem de erro em vermelho
        this.toastr.error('Nenhum conteúdo gravado. Grave novamente!', 'Erro de gravação', {
          toastClass: 'toast-error',
          progressBar: true,
          closeButton: true,
          timeOut: 3000, // 3000 milissegundos = 3 segundos
          positionClass: 'toast-bottom-right', // Posição do toast
          tapToDismiss: false
        });
      } else {
        // Se houver conteúdo, exibe uma mensagem de sucesso
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

      //this.headerComponent.addNotification('Você salvou um texto.');

      localStorage.setItem('savedContents', JSON.stringify(this.savedContents));

      this.toastr.success('Texto salvo com sucesso', 'Gravação concluída', {
        toastClass: 'toast-custom',
        progressBar: true,
        closeButton: true,
        timeOut: 3000, // 3000 milissegundos = 3 segundos
        positionClass: 'toast-bottom-right', // Posição do toast
        tapToDismiss: false
      });

    } else {
      this.toastr.error('Nenhum conteúdo detectado. Tente novamente!', 'Erro de gravação', {
        toastClass: 'toast-error',
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

      // *** ADICIONADO: Atualiza o localStorage após a deleção ***
      localStorage.setItem('savedContents', JSON.stringify(this.savedContents));

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

  playText() {
    if (this.content.trim() === '') {
      alert('Sem conteúdo para reproduzir.');
      return; // Se não houver conteúdo, exibe uma mensagem de erro e sai do método
    }

    const languageCodeMap: { [key: string]: string } = {
      'fr': 'fr-FR',
      'pt': 'pt-BR',
      'en': 'en-US'
    };

    const languageCode = languageCodeMap[this.selectedLanguage.split('-')[0]] || 'en-US';

    // Define o texto a ser reproduzido
    const textToSpeak = this.content;

    // Usando a funcionalidade de síntese de voz do navegador para reproduzir o texto
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    utterance.text = textToSpeak;
    utterance.lang = languageCode;

    window.speechSynthesis.speak(utterance);
  }


  downloadTextAsAudio() {
    const textToSpeak = this.content.trim();

    if (!textToSpeak) {
      alert('Sem conteúdo para converter em áudio.');
      return;
    }

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Configurar o idioma, voz, etc. conforme necessário
    utterance.lang = this.selectedLanguage;

    // Iniciar a síntese de fala
    synth.speak(utterance);

    // Lidar com o evento de finalização da síntese de fala
    utterance.onend = () => {
      const audioContext = new AudioContext();
      const audioStream = new MediaStream();
      const audioSource = audioContext.createMediaStreamSource(audioStream);
      const recorder = new MediaRecorder(audioStream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/mpeg' });

        // Criar um link para download do arquivo de áudio
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'texto_convertido.mp3';
        document.body.appendChild(a);

        // Simular um clique no link para iniciar o download
        a.click();

        // Remover o link do DOM
        document.body.removeChild(a);

        // Revogar o URL do objeto
        window.URL.revokeObjectURL(url);
      };

      // Iniciar a gravação do buffer de áudio
      recorder.start();

      // Capturar a saída de áudio do contexto de áudio da síntese de fala
      const destination = audioContext.createMediaStreamDestination();
      audioSource.connect(destination);
      destination.stream.getAudioTracks().forEach(track => audioStream.addTrack(track));

      // Parar a síntese de fala após um breve atraso para garantir que a gravação comece
      setTimeout(() => {
        synth.cancel();
      }, 500);
    };
  }

}
