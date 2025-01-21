import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { LibraryService } from '../../services/library.service';
import { Book, Membership, Transaction } from '../../utils/models';
import { CustomDropdownComponent } from '../../shared/custom-dropdown/custom-dropdown.component';
import { TRANSACTIONS_STATUS } from '../../utils/constant';

@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomDropdownComponent],
  templateUrl: './create-transaction.component.html',
  styleUrl: './create-transaction.component.scss'
})
export class CreateTransactionComponent implements OnInit, OnDestroy {
  transactionsForm!: FormGroup;
  unsubscribe$: Subject<any> = new Subject<any>();
  memberships$!: Observable<any[]>;
  books$!: Observable<any[]>;
  transactionsStatus = TRANSACTIONS_STATUS;
  transactionId!: string | null;
  bookNames: string[] = [];
  books: Book[] = [];
  memberNames: string[] = [];
  members: Membership[] = [];
  constructor(private fb: FormBuilder,
    private router: Router,
    private service: LibraryService,
    private route: ActivatedRoute) {
    this.createTransactionsForm()
  }

  ngOnInit(): void {
    this.transactionId = this.route.snapshot.paramMap.get('id');
    this.getBooks();
    this.getMemberships();
    if (this.transactionId) {
      this.getTransactionById(this.transactionId)
    }
  }

  getBooks() {
    const dropdownData: string[] = [];
    this.service.getBooks().pipe(takeUntil(this.unsubscribe$), map((datas: any[]) => {
      return datas.map(x => {
        dropdownData.push(`${x.id}_${x.title}`);
        return x;
      })
    })).subscribe((data: Book[]) => {
      this.bookNames = dropdownData;
      this.books = data;
    });
  }

  getMemberships() {
    const dropdownData: string[] = [];
    this.service.getMembership().pipe(takeUntil(this.unsubscribe$), map((datas: any[]) => {
      return datas.map(x => {
        dropdownData.push(`${x.id}_${x.name}`);
        return x;
      })
    })).subscribe((data: Membership[]) => {
      this.memberNames = dropdownData;
      this.members = data;
    });;
  }

  getTransactionById(transactionId: string) {
    this.service.getTransactionById(transactionId).pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
      data.member = this.members.filter((x: any) => (x.split('_')[0] === data.member))[0];
      data.book = this.bookNames.filter((x: any) => (x.split('_')[0] === data.book))[0];
      this.transactionsForm.patchValue({ ...data });
    }, error => {
      console.error(error)
    });
  }

  navigate() {
    this.router.navigate(['/transactions'])
  }

  createTransactionsForm() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 30);
    /* const lastDateForBookSubmition = new Date(today);
    lastDateForBookSubmition.setDate(today.getDate() + 30); */
    this.transactionsForm = this.fb.group({
      member: ['', [Validators.required]],
      book: ['', [Validators.required]],
      issueDate: [new Date().toISOString().substring(0, 10)], // Default to current date
      returnDate: [tomorrow.toISOString().substring(0, 10)],
      /* lastDate: [lastDateForBookSubmition.toISOString().substring(0, 10)], // Default to current date + 30 */
      status: [this.transactionsStatus[0], Validators.required],
      fineAmount: [0, [Validators.required]]
    });
  }

  createTransactions() {
    if (this.transactionsForm.valid && !this.transactionId) {
      const payload = { ...this.transactionsForm.value };
      payload.member = payload.member.split('_')[0];
      payload.book = payload.book.split('_')[0];
      payload.lastUpdated = new Date().toISOString().substring(0, 10);
      this.service.createTransaction(payload).pipe(takeUntil(this.unsubscribe$)).subscribe((data: Transaction) => {
        this.updateBook(payload.book);
      })
    } else {
      const payload = { ...this.transactionsForm.value, id: this.transactionId }
      payload.member = payload.member.split('_')[0];
      payload.book = payload.book.split('_')[0];
      payload.lastUpdated = new Date().toISOString().substring(0, 10);
      if (payload.status == 'Returned') {
        payload.returnDate = new Date().toISOString().substring(0, 10);
        payload.fineAmount = 0;
      } else if (payload.status == 'Book Lost') {
        payload.returnDate = new Date().toISOString().substring(0, 10);
        payload.fineAmount = 1000;
      }
      this.service.updateTransaction(payload).pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
        this.navigate();
      }, error => {
        console.error(error);
      });
    }
  }

  statusChange() {
    const setReturnDate = new Date().toISOString().substring(0, 10);
    if (this.transactionsForm.get('status')?.value === 'Returned') {
      this.transactionsForm.get('fineAmount')?.setValue(0);
    } else if (this.transactionsForm.get('status')?.value === 'Book Lost') {
      this.transactionsForm.get('fineAmount')?.setValue(1000);
    }
    this.transactionsForm.get('returnDate')?.setValue(setReturnDate);
  }

  dateChange(from: string) {
    if (this.transactionsForm.get('status')?.value !== 'Returned') {
      if (from === 'issueDate') {
        const today = new Date(this.transactionsForm.get('issueDate')?.value);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 30);
        this.transactionsForm.get('returnDate')?.setValue(tomorrow.toISOString().substring(0, 10));
      }
      const overDueDays = this.getDifferenceDate();
      this.transactionsForm.get('fineAmount')?.setValue(Number(overDueDays) * 2);
    }
  }

  getDifferenceDate() {
    const currentDate = new Date();
    const returnDate = new Date(this.transactionsForm.get('returnDate')?.value);
    if (returnDate.getTime() < currentDate.getTime()) {
      const diffInMs = Math.abs(currentDate.getTime() - returnDate.getTime());
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
      return diffInDays;
    } else {
      return 0;
    }
  }

  updateBook(bookId: string) {
    const book = this.books.filter((x: Book) => x.id === bookId)[0];
    book.availableCopies = book.availableCopies - 1;
    this.service.updateBook(book).subscribe(data => {
      this.navigate();
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
