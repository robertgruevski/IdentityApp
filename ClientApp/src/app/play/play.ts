import { Component, inject, OnInit } from '@angular/core';
import { PlayService } from './play.service';

@Component({
  selector: 'app-play',
  imports: [],
  templateUrl: './play.html',
  styleUrl: './play.scss',
})
export class Play implements OnInit {
  text: string | undefined;

  private playService = inject(PlayService);

  ngOnInit(): void {
    this.playService.getPlayers().subscribe({
      next: (response: any) => {
        this.text = response.message;
      },
    });
  }
}
