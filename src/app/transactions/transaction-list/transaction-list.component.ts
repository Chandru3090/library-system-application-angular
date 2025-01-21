import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LibraryService } from '../../services/library.service';
import { Transaction } from '../../utils/models';
import { Observable, Subject, takeUntil } from 'rxjs';

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
  constructor(private router: Router,
    private service: LibraryService
  ) { }

  ngOnInit(): void {
    this.getTransactions();
  }

  getTransactions() {
    this.transactions$ = this.service.getTransactions();
  }

  navigate(url: string, id?: string) {
    this.service.navigate(url, id);
  }

  removeTransaction(id: string) {
    this.service.removeTransaction(id).pipe(takeUntil(this.unsubscribe$)).subscribe((data: Transaction) => {
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

}
