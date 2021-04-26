import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { getInclusionDirectives } from '@apollo/client/utilities';
import { Character } from '@app/shared/interface/data.interface';
import { LocalStorageService } from '../../../../shared/services/localStorage.service';

@Component({
  selector: 'app-characters-card',
  templateUrl: './characters-card.component.html',
  styleUrls: ['./characters-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersCardComponent {
  @Input() character: Character;

  constructor(private localStorageSVC: LocalStorageService) {}

  toggleFavorite(): void {
    const isFavorite = this.character.isFavorite;
    this.getIcon();
    this.character.isFavorite = !isFavorite;
    this.localStorageSVC.addOrRemoveFavorites(this.character);
  }

  getIcon(): string {
    return this.character.isFavorite ? 'heart-solid.svg' : 'heart.svg';
  }
}
