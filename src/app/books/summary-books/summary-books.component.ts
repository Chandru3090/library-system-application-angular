import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LibraryService } from '../../services/library.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Book, ToastType } from '../../utils/models';
import { CardComponent } from '../../shared/card/card.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

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

  private service: LibraryService = inject(LibraryService);
  public authService: AuthService = inject(AuthService);
  private toastService: NotificationService = inject(NotificationService);

  ngOnInit(): void {
    this.getBooks();
  }

  toggleFavorite(book: Book) {
    book.isFavorite = !book.isFavorite;
    this.service.updateBook(book).pipe(takeUntil(this.unsubscribe$)).subscribe((data: Book) => {
      this.toastService.show('Success', `${book.title} has been ${book.isFavorite ? 'marked' : 'unmarked'} as favorite`, ToastType.Success);
    });
  }

  removeBook(bookId: string) {
    this.service.removeBook(bookId).pipe(takeUntil(this.unsubscribe$)).subscribe((data: Book) => {
      this.toastService.show('Success', `${data.title} removed successfully`, ToastType.Success);
      this.getBooks();
    });
  }

  navigate(url: string, id?: any) {
    this.service.navigate(url, id);
  }

  getBooks() {
    this.books$ = this.service.getBooks();
  }

  rateBook(book: Book, rating: number) {
    book.rating = rating;
    this.service.updateBook(book).pipe(takeUntil(this.unsubscribe$)).subscribe((data: Book) => {
      this.toastService.show('Success', `${book.title} rated successfully`, ToastType.Success);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
