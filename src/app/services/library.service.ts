import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../utils/constant';
import { Book, Membership, StaffMember, Transaction } from '../utils/models';
import { forkJoin, map, Observable, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  constructor(private http: HttpClient, private router: Router) { }
  private BOOK_URL = `${API_BASE_URL}/books`;
  private MEMBERSHIP_URL = `${API_BASE_URL}/members`;
  private TRANSACTIONS_URL = `${API_BASE_URL}/transactions`;
  private STAFF_MEMBERS_URL = `${API_BASE_URL}/staff-members`;

  /* Books */

  createBook(payload: Book): Observable<Book> {
    return this.http.post<Book>(`${this.BOOK_URL}`, payload);
  }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.BOOK_URL}`);
  }

  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.BOOK_URL}/${id}`);
  }

  updateBook(payload: Book): Observable<Book> {
    return this.http.put<Book>(`${this.BOOK_URL}/${payload.id}`, payload);
  }

  removeBook(bookId: string): Observable<Book> {
    return this.http.delete<Book>(`${this.BOOK_URL}/${bookId}`);
  }

  /* Membership */

  createMembership(payload: Membership): Observable<Membership> {
    return this.http.post<Membership>(`${this.MEMBERSHIP_URL}`, payload);
  }

  getMembership(): Observable<Membership[]> {
    return this.http.get<Membership[]>(`${this.MEMBERSHIP_URL}`);
  }

  getMemberShipById(membershipId: string): Observable<Membership> {
    return this.http.get<Membership>(`${this.MEMBERSHIP_URL}/${membershipId}`);
  }

  updateMembership(payload: Membership): Observable<Membership> {
    return this.http.put<Membership>(`${this.MEMBERSHIP_URL}/${payload.id}`, payload);
  }

  removeMembership(membershipId: string): Observable<Membership> {
    return this.http.delete<Membership>(`${this.MEMBERSHIP_URL}/${membershipId}`);
  }

  /* Transactions */

  createTransaction(payload: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.TRANSACTIONS_URL}`, payload);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.TRANSACTIONS_URL}`).pipe(
      switchMap((transactions: Transaction[]) => {
        // Map transactions to include asynchronous calls for book and member details
        const updatedTransactions$ = transactions.map((transaction: any) =>
          forkJoin({
            bookDetails: this.getBookById(transaction.book),
            memberDetails: this.getMemberShipById(transaction.member),
          }).pipe(
            map((details) => ({
              ...transaction, // Keep original transaction properties
              bookDetails: details.bookDetails,
              memberDetails: details.memberDetails,
            }))
          )
        );

        // Wait for all transactions to be updated
        return forkJoin(updatedTransactions$);
      }));
  }

  getTransactionById(transactionId: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.TRANSACTIONS_URL}/${transactionId}`);
  }

  updateTransaction(payload: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.TRANSACTIONS_URL}/${payload.id}`, payload);
  }

  removeTransaction(transactionId: string): Observable<Transaction> {
    return this.http.delete<Transaction>(`${this.TRANSACTIONS_URL}/${transactionId}`);
  }

  /* Staff Members */

  createStaffMember(payload: StaffMember): Observable<StaffMember> {
    return this.http.post<StaffMember>(`${this.STAFF_MEMBERS_URL}`, payload);
  }

  getStaffMember(): Observable<StaffMember[]> {
    return this.http.get<StaffMember[]>(`${this.STAFF_MEMBERS_URL}`);
  }

  getStaffMemberById(staffMembersId: string): Observable<StaffMember> {
    return this.http.get<StaffMember>(`${this.STAFF_MEMBERS_URL}/${staffMembersId}`);
  }

  updateStaffMember(payload: StaffMember): Observable<StaffMember> {
    return this.http.put<StaffMember>(`${this.STAFF_MEMBERS_URL}/${payload.id}`, payload);
  }

  removeStaffMember(staffMembersId: string): Observable<StaffMember> {
    return this.http.delete<StaffMember>(`${this.STAFF_MEMBERS_URL}/${staffMembersId}`);
  }

  navigate(url: string, id?: string) {
    !id ? this.router.navigate([url]) : this.router.navigate([url, id]);
  }


}
