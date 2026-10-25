import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { HorairesComponent } from './horaires/horaires.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'horaires/:ville', component: HorairesComponent },   // recherche par ville
  { path: 'position', component: HorairesComponent },          // géolocalisation (queryParams)
  { path: '**', component: NotFoundComponent }
];