import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { METHODES } from '../prieres.service';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {
  ville = 'Tunis';
  methode = 3;
  methodes = METHODES;
  erreur = '';

  constructor(private router: Router) {}

  rechercher() {
    if (!this.ville.trim()) return;
    this.router.navigate(['/horaires', this.ville.trim()], {
      queryParams: { methode: this.methode }
    });
  }

  utiliserPosition() {
    if (!navigator.geolocation) {
      this.erreur = 'La géolocalisation n’est pas supportée par ce navigateur.';
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.router.navigate(['/position'], {
          queryParams: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            methode: this.methode
          }
        });
      },
      () => { this.erreur = 'Position refusée ou indisponible.'; }
    );
  }
}