import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { LocalStorageService } from '@app/shared/services/localStorage.service';
import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'app-characters-list',
  template: `
    <section class="character__list" infiniteScroll (scrolled)="onScrollDown()">
      <app-characters-card
        *ngFor="let character of characters$ | async"
        [character]="character"
      ></app-characters-card>
      <button *ngIf="showButton" class="button" (click)="onTopPage()">
        ⬆️
      </button>
    </section>
  `,
  styleUrls: ['./characters-list.component.scss'],
})
export class CharactersListComponent {
  characters$ = this.dataSVC.characters$;
  showButton: boolean = false;

  private scrollHeight = 500;
  private pageNum = 1;

  constructor(
    @Inject(DOCUMENT) private document: Document,

    private dataSVC: DataService,
    private localStorageSvc: LocalStorageService
  ) {}

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const yOffSet = window.pageXOffset;
    const scrollTop = this.document.documentElement.scrollTop;
    this.showButton = (yOffSet || scrollTop) > this.scrollHeight;
  }

  onTopPage(): void {
    this.document.documentElement.scrollTop = 0;
  }

  onScrollDown(): void {
    this.pageNum++;
    this.dataSVC.getCharacterByPage(this.pageNum);
  }
}
