import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LibraryService } from '../../services/library.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { Book, ToastType } from '../../utils/models';

@Component({
  selector: 'app-create-book',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-book.component.html',
  styleUrl: './create-book.component.scss'
})
export class CreateBookComponent implements OnInit, OnDestroy {
  bookForm!: FormGroup;
  genres = ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Biography'];
  currentYear = new Date().getFullYear();
  unsubscribe$: Subject<any> = new Subject<any>();
  bookId!: string | null;

  private fb: FormBuilder = inject(FormBuilder);
  private service: LibraryService = inject(LibraryService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private toastService: NotificationService = inject(NotificationService);

  ngOnInit(): void {
    this.createBookForm();
    this.bookId = this.route.snapshot.paramMap.get('id');
    if (this.bookId) {
      this.getBookDetailsById(this.bookId);
    }
  }


  private createBookForm() {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      genre: ['', Validators.required],
      publicationYear: [
        '',
        [Validators.required, Validators.min(1900), Validators.max(this.currentYear)]
      ],
      totalCopies: [0, [Validators.required, Validators.min(0)]],
      isbnNumber: ['', Validators.required], // Add unique validation in your service or backend
      rating: [
        '',
        [Validators.required, Validators.min(1), Validators.max(5)]
      ],
    });
  }

  createBook(): void {
    if (this.bookForm?.valid && !this.bookId) {
      const payload = this.bookForm.value;
      payload.availableCopies = payload.totalCopies;
      this.service.createBook(payload).pipe(takeUntil(this.unsubscribe$)).subscribe((data: Book) => {
        this.toastService.show('Success', `${data.title} created successfully`, ToastType.Success);
        this.navigate();
      }, error => {
        console.error(error);
        this.toastService.show('Error', 'Book create API Failure', ToastType.Error);
      });
    } else {
      const payload = { ...this.bookForm.value, id: this.bookId };
      payload.availableCopies = payload.totalCopies;
      this.service.updateBook(payload).pipe(takeUntil(this.unsubscribe$)).subscribe((data: Book) => {
        this.toastService.show('Success', `${data.title} updated successfully`, ToastType.Success);
        this.navigate();
      }, error => {
        console.error(error);
        this.toastService.show('Error', 'Book update API Failure', ToastType.Error);
      });
    }
  }

  navigate() {
    this.service.navigate('/books');
  }

  getBookDetailsById(bookId: string) {
    this.service.getBookById(bookId).pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
      this.bookForm.patchValue({ ...data });
    }, error => {
      console.error(error)
      this.toastService.show('Error', 'Get Book API Failure', ToastType.Error);
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
