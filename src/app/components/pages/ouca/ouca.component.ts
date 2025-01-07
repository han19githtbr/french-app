import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../../service/translation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ouca',
  templateUrl: './ouca.component.html',
  styleUrls: ['./ouca.component.css']
})
export class OucaComponent implements OnInit {
  word: string = '';
  option: string = 'fr';
  language: string = 'fr';
  searchKeyword: string = '';
  speakingSpeed: number = 1;
  changingAttempts: number = 3;
  spokenWord: string = '';
  imageFound: boolean = false;

  images: { description: string, url: string }[] = [
    { description: 'Courir', url: '../../../assets/img/correr.jpg' },
    { description: 'Marcher', url: '../../../assets/img/caminhar.jpg' },
    { description: 'Cuisiner', url: '../../../assets/img/cozinhar.jpg' },
    { description: 'Piloter', url: '../../../assets/img/dirigir.jpg' },
    { description: 'Plante', url: '../../../assets/img/natureza.jpg' },
    { description: 'Nature', url: '../../../assets/img/jour.jpg' },
    { description: 'Soleil', url: '../../../assets/img/coucher.jpg' },
    { description: 'Maison', url: '../../../assets/img/maison.jpg' },
  ];


  checkOption(option: string, correctOption: string): void {

    if (option === correctOption) {
      this.toastr.success('Você acertou a legenda', 'Parabéns', {
        toastClass: 'toast-custom',
        progressBar: true,
        closeButton: true,
        timeOut: 3000,
        positionClass: 'toast-bottom-right',
        tapToDismiss: false
      });
      this.translationService.speakWord('Parabéns! Você acertou a legenda', 'pt', this.speakingSpeed);
    } else {
      this.toastr.error('Errou a legenda!', 'Errou', {
        toastClass: 'toast-error',
        progressBar: true,
        closeButton: true,
        timeOut: 3000,
        positionClass: 'toast-bottom-right',
        tapToDismiss: false
      });
      this.translationService.speakWord('Errou a legenda! Tente novamente', 'pt', this.speakingSpeed);
      this.changingAttempts--;
      if (this.changingAttempts === 0) {
        this.toastr.error('Número de tentativas esgotadas!', 'Fim de jogo', {
          toastClass: 'toast-error',
          progressBar: true,
          closeButton: true,
          timeOut: 3000,
          positionClass: 'toast-bottom-right',
          tapToDismiss: false
        });
        this.translationService.speakWord('Número de tentativas esgotadas! Fim de Jogo', 'pt', this.speakingSpeed);
        this.changingAttempts = 3;

      }
    }
  }


  constructor(private translationService: TranslationService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) { }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchKeyword = params['q'] || '';
      if (this.searchKeyword) {
        this.search(this.searchKeyword);
      }
    });
  }


  search(keyword: string): void {
    const lowercaseKeyword = keyword.toLowerCase();
    const image = this.images.find(img => img.description.toLowerCase().includes(lowercaseKeyword));
    if (image) {
      this.applyBlinkEffect(true);
      const element = document.getElementById(image.description);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      this.applyBlinkEffect(false);
    }
  }

  // Função para aplicar ou remover a classe .blink com base na pesquisa
  applyBlinkEffect(found: boolean): void {
    this.imageFound = found;
  }

  speakWord(): void {
    this.translationService.speakWord(this.word, this.language, this.speakingSpeed);
  }

  speakDescription(description: string): void {
    this.translationService.speakWord(description, this.language, this.speakingSpeed);
    this.spokenWord = description;
  }

  speakDescriptionVideo(description: string, audioUrl: string, delay: number): void {
    setTimeout(() => {
      this.playAudio(audioUrl);
      this.spokenWord = description;
    }, delay * 1000);
  }

  playAudio(audioUrl: string): void {
    const audio = new Audio(audioUrl);
    audio.playbackRate = this.speakingSpeed;
    audio.play();
  }

  onSpeedChange(event: any): void {
    this.speakingSpeed = event.target.value;
  }

  onImageClick(description: string): void {
    this.speakDescription(description);
  }

  navigateToSearchResult(): void {
    if (this.searchKeyword.trim() !== '') {
      this.router.navigate(['/translate'], { queryParams: { q: this.searchKeyword } });
    }
  }

  controlarTentativas(value: number): void {
    this.changingAttempts = value;
  }
}
