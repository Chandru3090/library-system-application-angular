import { Component, OnDestroy, OnInit } from '@angular/core';
import { LibraryService } from '../../services/library.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Book } from '../../utils/models';
import { CardComponent } from '../../shared/card/card.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary-books',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './summary-books.component.html',
  styleUrl: './summary-books.component.scss'
})
export class SummaryBooksComponent implements OnInit, OnDestroy {
  books$!: Observable<Book[]>;
  unsubscribe$: Subject<any> = new Subject<any>();
  constructor(private service: LibraryService) { }

  ngOnInit(): void {
    this.getBooks();
  }

  toggleFavorite(book: Book) {
    book.isFavorite = !book.isFavorite;
    this.service.updateBook(book).pipe(takeUntil(this.unsubscribe$)).subscribe((data: Book) => {
      console.log(data);
    });
  }

  removeBook(bookId: string) {
    this.service.removeBook(bookId).pipe(takeUntil(this.unsubscribe$)).subscribe((data: Book) => {
      this.getBooks();
    });
  }

  navigate(url: string, id?: any) {
    this.service.navigate(url, id);
  }

  getBooks() {
    this.books$ = this.service.getBooks();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
