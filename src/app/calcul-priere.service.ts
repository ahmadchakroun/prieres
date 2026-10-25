import { Injectable } from '@angular/core';

export interface Priere { nom: string; heure: string; }

@Injectable({ providedIn: 'root' })
export class CalculPriereService {

  // Heure actuelle en secondes depuis minuit, dans le fuseau de la ville
  secondesActuelles(fuseau: string): number {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: fuseau || undefined,
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date());
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
    return get('hour') * 3600 + get('minute') * 60 + get('second');
  }

  enSecondes(heure: string): number {
    const [h, m] = heure.split(':').map(Number);
    return h * 3600 + m * 60;
  }

  // Retourne la prochaine prière et le temps restant en secondes
  prochainePriere(horaires: Priere[], fuseau: string): { priere: Priere; reste: number } {
    const maintenant = this.secondesActuelles(fuseau);
    const suivante = horaires.find((p) => this.enSecondes(p.heure) > maintenant);
    if (suivante) {
      return { priere: suivante, reste: this.enSecondes(suivante.heure) - maintenant };
    }
    // Après Isha : la prochaine est le Fajr de demain
    return {
      priere: horaires[0],
      reste: 86400 - maintenant + this.enSecondes(horaires[0].heure)
    };
  }

  formaterDuree(secondes: number): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const h = Math.floor(secondes / 3600);
    const m = Math.floor((secondes % 3600) / 60);
    const s = secondes % 60;
    return `${pad(h)}h ${pad(m)}min ${pad(s)}s`;
  }
}