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
  currentIndex: number = -1;
  previousImage: boolean = false;

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


  constructor(private translationService: TranslationService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) { }


  ngOnInit(): void {

  }


  trackByImage(index: number, image: { description: string, url: string }): string {
    return image.description;
  }


  showNextImage(): void {
    this.currentIndex++;
    this.spokenWord = ''; // Limpa a palavra falada ao mudar a imagem
    this.showImage(this.currentIndex);
  }

  showPreviousImage(): void {
    this.currentIndex--;
    this.showImage(this.currentIndex);
  }


  showImage(index: number): void {
    if (index >= 0 && index < this.images.length) {
        this.previousImage = index > 0;
        this.speakDescription(this.images[index].description);
        this.spokenWord = this.images[index].description; // Exibe a palavra falada imediatamente
        setTimeout(() => {
            this.spokenWord = ''; // Limpa após 6 segundos
        }, 6000);
    } else {
        if (index >= this.images.length) {
            this.currentIndex = this.images.length -1;
            this.toastr.info("Você chegou ao final das imagens.", "Informação")
        }
         if (index < 0) {
            this.currentIndex = 0;
            this.toastr.info("Você está na primeira imagem.", "Informação")
        }
    }
  }

  speakDescription(description: string): void {
    this.translationService.speakWord(description, this.language, this.speakingSpeed);
  }


  speakWord(): void {
    this.translationService.speakWord(this.word, this.language, this.speakingSpeed);
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

}
