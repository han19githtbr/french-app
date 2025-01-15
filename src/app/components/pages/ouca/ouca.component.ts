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

  constructor(private translationService: TranslationService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {}

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

  navigateToSearchResult(): void {
    if (this.searchKeyword.trim() !== '') {
      this.router.navigate(['/translate'], { queryParams: { q: this.searchKeyword } });
    }
  }
}
