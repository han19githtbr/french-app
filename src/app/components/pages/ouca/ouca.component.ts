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
  currentImageTimeout: any;
  imageVisible: boolean = false;

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
    this.clearImageTimeout();
    this.currentIndex++;
    this.spokenWord = ''; // Limpa a palavra falada ao mudar a imagem
    this.showImage();
  }

  showPreviousImage(): void {
    this.clearImageTimeout();
    this.currentIndex--;
    this.showImage();
  }

  showImage(): void {
    if (this.currentIndex >= 0 && this.currentIndex < this.images.length) {
      this.previousImage = this.currentIndex > 0;
      this.speakDescription(this.images[this.currentIndex].description);
      this.spokenWord = this.images[this.currentIndex].description;
      this.imageVisible = true;

      this.clearImageTimeout(); // Clear any existing timeout before setting a new one

      this.currentImageTimeout = setTimeout(() => {
        // Only change the image if it's still the current one
        this.imageVisible = false;
      }, 6000);
    } else {
      this.handleOutOfBoundsIndex(this.currentIndex);
    }
  }

  private handleOutOfBoundsIndex(index: number) {
    if (index >= this.images.length) {
      this.currentIndex = this.images.length - 1;
      this.toastr.info("Você chegou ao final das imagens.", "Informação");
    } else if (index < 0) {
      this.currentIndex = 0;
      this.toastr.info("Você está na primeira imagem.", "Informação");
    }
  }

  private clearImageTimeout() {
    if (this.currentImageTimeout) {
      clearTimeout(this.currentImageTimeout);
      this.currentImageTimeout = null;
    }
  }

  speakDescription(description: string): void {
    this.translationService.speakWord(description, this.language, this.speakingSpeed);
  }

  speakWord(): void {
    this.translationService.speakWord(this.word, this.language, this.speakingSpeed);
  }

  onImageClick(description: string): void {
    this.speakDescription(description);
  }

  playAudio(audioUrl: string): void {
    const audio = new Audio(audioUrl);
    audio.playbackRate = this.speakingSpeed;
    audio.play();
  }

  onSpeedChange(event: any): void {
    this.speakingSpeed = event.target.value;
  }

  navigateToSearchResult(): void {
    if (this.searchKeyword.trim() !== '') {
      this.router.navigate(['/translate'], { queryParams: { q: this.searchKeyword } });
    }
  }
}
