import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgStyle, TitleCasePipe } from '@angular/common';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { METHODES, PrieresService } from '../prieres.service';
import { CalculPriereService, Priere } from '../calcul-priere.service';
import { PrayerCardComponent } from '../prayer-card/prayer-card.component';

@Component({
  selector: 'app-horaires',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe, NgStyle, TitleCasePipe, PrayerCardComponent],
  templateUrl: './horaires.component.html',
  styleUrl: './horaires.component.css'
})
export class HorairesComponent implements OnInit, OnDestroy {
  ville = '';
  methode = 3;
  methodes = METHODES;

  horaires: Priere[] = [];
  dateJour!: Date;
  dateHijri = '';
  fuseau = '';
  lat: number | null = null;
  lng: number | null = null;

  prochaine: Priere | null = null;
  reste = 0;
  tempsRestant = '';

  erreur = '';
  chargement = false;

  private routeSub!: Subscription;
  private timer: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prieresService: PrieresService,
    private calcul: CalculPriereService
  ) {}

  ngOnInit() {
    // On écoute le paramètre :ville ET les queryParams (methode, lat, lng)
    this.routeSub = combineLatest([this.route.params, this.route.queryParams])
      .subscribe(([params, query]) => {
        this.methode = Number(query['methode']) || 3;

        if (params['ville']) {
          this.ville = params['ville'];
          this.lat = null;
          this.lng = null;
          this.charger(this.prieresService.parVille(this.ville, this.methode));
        } else if (query['lat'] && query['lng']) {
          this.ville = '';
          this.lat = Number(query['lat']);
          this.lng = Number(query['lng']);
          this.charger(this.prieresService.parPosition(this.lat, this.lng, this.methode));
        }
      });

    // Mise à jour du temps restant chaque seconde
    this.timer = setInterval(() => this.majProchainePriere(), 1000);
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    clearInterval(this.timer);
  }

  changerMethode(id: number) {
    // Même page, on change seulement le queryParam : la page se recharge toute seule
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { methode: id },
      queryParamsHandling: 'merge'
    });
  }

  private charger(requete: Observable<any>) {
    this.erreur = '';
    this.chargement = true;
    requete.subscribe({
      next: (rep) => {
        this.traiter(rep);
        this.chargement = false;
      },
      error: () => {
        this.horaires = [];
        this.prochaine = null;
        this.erreur = 'Ville introuvable ou API indisponible.';
        this.chargement = false;
      }
    });
  }

  private traiter(rep: any) {
    const t = rep.data.timings;
    // L'API peut ajouter un suffixe, ex. "04:58 (CET)" : on garde "04:58"
    this.horaires = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
      .map((nom) => ({ nom, heure: t[nom].split(' ')[0] }));

    this.fuseau = rep.data.meta.timezone;

    // Date grégorienne renvoyée par l'API (format JJ-MM-AAAA), affichée avec le pipe date
    const [j, m, a] = rep.data.date.gregorian.date.split('-').map(Number);
    this.dateJour = new Date(a, m - 1, j);

    const h = rep.data.date.hijri;
    this.dateHijri = `${h.day} ${h.month.en} ${h.year} H`;

    this.majProchainePriere();
  }

  majProchainePriere() {
    if (!this.horaires.length) return;
    const r = this.calcul.prochainePriere(this.horaires, this.fuseau);
    this.prochaine = r.priere;
    this.reste = r.reste;
    this.tempsRestant = this.calcul.formaterDuree(r.reste);
  }
}