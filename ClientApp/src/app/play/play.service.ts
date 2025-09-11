import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlayService {
  apiUrl = environment.apiUrl;
  
  private http = inject(HttpClient);
  
  getPlayers() {
    return this.http.get(this.apiUrl + 'play/get-players');
  }

}
