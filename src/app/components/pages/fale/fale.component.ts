import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

interface SavedContent {
  text: string;
  date: Date;
}

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
  searchTerm: string = '';
  modalContent: SavedContent | null = null;
  modalElement: any;
  savedContents: SavedContent[] = [];
  //savedContents: string[] = []; // Array para armazenar o conteúdo salvo
  selectedLanguage: string = 'fr-FR'; // Idioma padrão para gravação
  showDeleteMessage: boolean = false;
  maxSavedContents: number = 10;

  constructor(private toastr: ToastrService, private elementRef: ElementRef, private renderer: Renderer2) {}


  ngAfterViewInit() {
    this.modalElement = this.elementRef.nativeElement.querySelector('.modal'); // Seleciona o elemento modal
  }


  ngOnInit() {
    this.loadSavedContents();
  }

  get filteredContents(): SavedContent[] {
    if (!this.searchTerm) {
      return this.savedContents;
    }
    return this.savedContents.filter(content =>
      content.text.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  loadSavedContents() {
    const savedContents = localStorage.getItem('savedContents');
    if(savedContents) {
      try {
        this.savedContents = JSON.parse(savedContents);
        this.savedContents.forEach(content => content.date = new Date(content.date));
      } catch (error) {
        console.error("Erro ao analisar o localStorage:", error);
        localStorage.removeItem('savedContents');
        this.savedContents = [];
      }
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('savedContents', JSON.stringify(this.savedContents));
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
          closeButton: false,
          timeOut: 3000, // 3000 milissegundos = 3 segundos
          positionClass: 'toast-bottom-right', // Posição do toast
          tapToDismiss: false
        });
      } else {
        // Se houver conteúdo, exibe uma mensagem de sucesso
        this.toastr.success('Conteúdo gravado com sucesso', 'Gravação concluída', {
          toastClass: 'toast-custom',
          progressBar: true,
          closeButton: false,
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
      if (this.savedContents.length < this.maxSavedContents) {
        const newContent: SavedContent = {
          text: this.content.trim(),
          date: new Date()
        };
        this.savedContents.push(newContent);
        this.content = '';
        this.saveToLocalStorage();
        this.toastr.success('Texto salvo com sucesso', 'Gravação concluída', {
          toastClass: 'toast-custom',
          progressBar: true,
          closeButton: false,
          timeOut: 3000,
          positionClass: 'toast-bottom-right',
          tapToDismiss: false
        });
      } else {
        this.toastr.warning('Limite de armazenamento atingido (10 gravações). Apague um item para salvar outro.', 'Aviso', {
          toastClass: 'toast-warning',
          progressBar: true,
          closeButton: false,
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
          tapToDismiss: false
        });
      }
    } else {
        this.toastr.error('Nenhum conteúdo detectado. Tente novamente!', 'Erro de gravação', {
            toastClass: 'toast-error',
            progressBar: true,
            closeButton: false,
            timeOut: 3000,
            positionClass: 'toast-bottom-right',
            tapToDismiss: false
          });
    }
  }


  deleteContent(contentToDelete: SavedContent) {
    this.savedContents = this.savedContents.filter(content => content !== contentToDelete);
    this.saveToLocalStorage();
    this.closeModal();
    this.toastr.success('Conteúdo removido com sucesso', 'Remoção concluída', {
        toastClass: 'toast-custom',
        progressBar: true,
        closeButton: false,
        timeOut: 3000,
        positionClass: 'toast-bottom-right',
        tapToDismiss: false
      });
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

  openModal(content: SavedContent) {
    console.log("openModal() foi chamado com:", content);
    this.modalContent = content;
    if (this.modalElement) {
        this.renderer.addClass(this.modalElement, 'show'); // Adiciona a classe 'show'
    }
  }

  closeModal() {
    if (this.modalElement) {
        this.renderer.removeClass(this.modalElement, 'show'); // Remove a classe 'show'
        setTimeout(() => {
            this.modalContent = null;
        }, 300); // Aguarda a transição antes de limpar o conteúdo
    } else {
        this.modalContent = null;
    }
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

}
