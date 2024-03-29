import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../../service/translation.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ouca',
  templateUrl: './ouca.component.html',
  styleUrls: ['./ouca.component.css']
})
export class OucaComponent implements OnInit {
  word: string = '';
  language: string = 'fr';
  searchKeyword: string = '';
  speakingSpeed: number = 1; // Velocidade padrão de fala
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
    // Adicione outras imagens aqui...
  ];


  conversations: { description: string, audioUrl: string }[] = [
    { description: 'Salut, comment tu t\'appelles?', audioUrl: '../../../assets/audio/salut_comment_tu_tappelles.mp3' },
    { description: 'Salut, je m’appelle Joseph, et toi, comment tu t’appelles?', audioUrl: '../../../assets/audio/salut_je_mapelle_joseph.mp3' },
    { description: 'Enchanté, Joseph! Je m\'appelle Paul', audioUrl: '../../../assets/audio/enchante_joseph_je_mapelle_paul.mp3' },
    { description: 'Je suis ravi de connaître, Paul!', audioUrl: '../../../assets/audio/je_suis_ravi_de_connaitre_paul.mp3' },
    { description: 'Salut, Paul. À bientôt!', audioUrl: '../../../assets/audio/salut_paul_a_bientot.mp3' },
    { description: 'À bientôt, Joseph!', audioUrl: '../../../assets/audio/a_bientot_joseph.mp3' },
  ];


  constructor(private translationService: TranslationService, private route: ActivatedRoute, private router: Router) { }

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
    this.spokenWord = description; // Atualiza a palavra falada
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


  /*onVideoClick(description: string, videoUrl: string): void {
    const delayInSeconds = 7;
    this.speakDescription(description, videoUrl, delayInSeconds);
  }*/

}
