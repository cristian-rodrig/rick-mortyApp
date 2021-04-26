import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from '@shared/interface/data.interface';
import { ToastrService } from 'ngx-toastr';

const MY_FAVORITES = 'myFavorites';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private charactersFavSubject = new BehaviorSubject<Character[]>(null);
  charactersFav$ = this.charactersFavSubject.asObservable();

  constructor(private toastService: ToastrService) {
    this.InitialStorage();
  }

  addOrRemoveFavorites(character: Character) {
    const { id } = character;
    const currentsFav = this.getFavoritesCharacters();
    const found = !!currentsFav.find((fav: Character) => fav.id === id);
    found ? this.removeFromFavorite(id) : this.addToFavorite(character);
  }

  private addToFavorite(character: Character): void {
    try {
      const currentsFav = this.getFavoritesCharacters();
      localStorage.setItem(
        MY_FAVORITES,
        JSON.stringify([...currentsFav, character])
      );
      this.charactersFavSubject.next([...currentsFav, character]);
      this.toastService.success(
        `Favorito ${character.name} añadido a favorito`,
        ' Rick and Morty App'
      );
    } catch (error) {
      console.log('Error al añadir los favoritos a localstorage', error);
      this.toastService.error(
        `Error guardando en localstorage ${error}`,
        ' Rick and Morty App'
      );
    }
  }
  private removeFromFavorite(id: number): void {
    try {
      const currentsFav = this.getFavoritesCharacters();
      const characters = currentsFav.filter(
        (char: Character) => char.id !== id
      );
      localStorage.setItem(MY_FAVORITES, JSON.stringify([...characters]));
      this.charactersFavSubject.next([...characters]);
      this.toastService.warning(
        `Favorito eliminado de favoritos`,
        ' Rick and Morty App'
      );
    } catch (error) {
      console.log('Error al eliminar los favoritos a localstorage', error);
      this.toastService.error(
        `Error guardando en localstorage ${error}`,
        ' Rick and Morty App'
      );
    }
  }

  getFavoritesCharacters(): any {
    try {
      const charactersFav = JSON.parse(localStorage.getItem(MY_FAVORITES));
      this.charactersFavSubject.next(charactersFav);
      return charactersFav;
    } catch (error) {
      console.log('Error al obtener los favoritos de localstorage', error);
      this.toastService.error(
        `Error al obtener los favoritos del localstorage ${error}`,
        ' Rick and Morty App'
      );
    }
  }

  clearStorage() {
    try {
      localStorage.clear();
    } catch (error) {
      console.log('Error al limpiar localstorage', error);
    }
  }
  private InitialStorage(): void {
    const currents = JSON.parse(localStorage.getItem(MY_FAVORITES));
    if (!currents) {
      localStorage.setItem(MY_FAVORITES, JSON.stringify([]));
    }
    this.getFavoritesCharacters();
  }
}
