import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export const METHODES = [
  { id: 3, nom: 'Muslim World League' },
  { id: 5, nom: 'Egyptian General Authority of Survey' },
  { id: 1, nom: 'University of Islamic Sciences, Karachi' },
  { id: 4, nom: 'Umm Al-Qura University, Makkah' }
];

@Injectable({ providedIn: 'root' })
export class PrieresService {
  private url = 'https://api.aladhan.com/v1';

  constructor(private http: HttpClient) {}

  parVille(ville: string, methode: number): Observable<any> {
    return this.http.get<any>(
      `${this.url}/timingsByAddress?address=${encodeURIComponent(ville)}&method=${methode}`
    );
  }

  parPosition(lat: number, lng: number, methode: number): Observable<any> {
    return this.http.get<any>(
      `${this.url}/timings?latitude=${lat}&longitude=${lng}&method=${methode}`
    );
  }
}