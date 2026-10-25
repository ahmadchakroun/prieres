import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-prayer-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './prayer-card.component.html',
  styleUrl: './prayer-card.component.css'
})
export class PrayerCardComponent {
  @Input() nom!: string;
  @Input() heure!: string;
  @Input() prochaine = false;
}