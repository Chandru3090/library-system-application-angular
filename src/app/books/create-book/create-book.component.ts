import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LibraryService } from '../../services/library.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

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
  constructor(private fb: FormBuilder,
    private service: LibraryService,
    private route: ActivatedRoute
  ) {
    this.createBookForm();
  }

  ngOnInit(): void {
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
      availableCopies: [0, [Validators.required, Validators.min(0)]],
      isbnNumber: ['', Validators.required], // Add unique validation in your service or backend
      rating: [
        '',
        [Validators.required, Validators.min(1), Validators.max(5)]
      ],
    });
  }

  createBook(): void {
    if (this.bookForm?.valid && !this.bookId) {
      
      this.service.createBook(this.bookForm.value).pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
        this.navigate();
      }, error => {
        console.error(error);
      });
    } else {
      const payload = { ...this.bookForm.value, id: this.bookId }
      this.service.updateBook(payload).pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
        this.navigate();
      }, error => {
        console.error(error);
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
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
