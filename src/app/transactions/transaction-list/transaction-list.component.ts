import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LibraryService } from '../../services/library.service';
import { ToastType, Transaction } from '../../utils/models';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionListComponent implements OnInit {
  transactions$!: Observable<Transaction[]>;
  unsubscribe$: Subject<any> = new Subject<any>();
  currentDate = new Date().toISOString().substring(0, 10);
  isTransactionOverdueUpdated = false;

  private service: LibraryService = inject(LibraryService);
  public authService: AuthService = inject(AuthService);
  private toastService: NotificationService = inject(NotificationService);

  ngOnInit(): void {
    this.getTransactions();
  }

  getTransactions() {
    this.transactions$ = this.service.getTransactions().pipe(map((transactions: Transaction[]) => {
      return transactions.map(x => {
        if (this.converDate(x.returnDate) < this.currentDate && !this.isTransactionOverdueUpdated) {
          const overDueDays = this.getDifferenceDate(x.returnDate);
          x.fineAmount = Number(overDueDays) * 2;
          this.service.updateTransaction(x).pipe(takeUntil(this.unsubscribe$)).subscribe((data:any) => {
            console.log(data);
            this.isTransactionOverdueUpdated = true;
          });
        }
        return x;
      })
    }));
  }

  navigate(url: string, id?: string) {
    this.service.navigate(url, id);
  }

  removeTransaction(id: string) {
    this.service.removeTransaction(id).pipe(takeUntil(this.unsubscribe$)).subscribe((data: Transaction) => {
      this.toastService.show('Success', 'Transaction removed successfully', ToastType.Success);
      this.getTransactions();
    });
  }

  converDate(dateValue: any) {
    return new Date(dateValue).toISOString().substring(0, 10);
  }

  getBadgeClassByMembershipType(transaction: any) {
    const membersType = transaction.memberDetails?.membershipType;
    return (membersType == 'Basic') ? 'bg-red-500' : (membersType === 'Premium') ? 'bg-blue-500' : 'bg-green-500';
  }

  getDifferenceDate(date: any) {
    const currentDate = new Date();
    const returnDate = new Date(date);
    if (returnDate.getTime() < currentDate.getTime()) {
      const diffInMs = Math.abs(currentDate.getTime() - returnDate.getTime());
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
      return diffInDays;
    } else {
      return 0;
    }
  }

}
