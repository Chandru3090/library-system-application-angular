import { Component, OnInit, ViewChild } from '@angular/core';
import { LibraryService } from '../services/library.service';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { Book, Membership, StaffMember, Transaction } from '../utils/models';
import { ApexChart, ApexNonAxisChartSeries, ApexResponsive, ChartComponent, NgApexchartsModule } from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  books$!: Observable<Book[]>;
  booksByGenre$!: Observable<any>;
  favoriteBooks$!: Observable<Book[]>;
  memberships$!: Observable<Membership[]>;
  staffMembers$!: Observable<StaffMember[]>;
  transactions$!: Observable<Transaction[]>;
  currentDate = new Date().toISOString().substring(0, 10);
  books: Book[] = [];
  groupedByBook: any;
  members: Membership[] = [];
  @ViewChild("bookChart") chartBook: ChartComponent | undefined;
  @ViewChild("memberChart") chartMember: ChartComponent | undefined;
  public chartOptionsBooks: Partial<ChartOptions> | undefined;
  public chartOptionsMembers: Partial<ChartOptions> | undefined;
  groupedByMembers: any;
  constructor(private service: LibraryService) { }

  ngOnInit(): void {
    this.books$ = this.service.getBooks().pipe(map((datas: Book[]) => { this.books = datas; return datas; }));
    this.booksByGenre$ = this.service.getBooks().pipe(map((books: Book[]) => books.reduce((acc, book) => {
      // Initialize the group if it doesn't exist
      if (!acc[book.genre]) {
        acc[book.genre] = [];
      }
      // Add the book to the group
      acc[book.genre].push(book);
      return acc;
    }, {} as Record<string, Book[]>)));
    this.favoriteBooks$ = this.service.getBooks().pipe(map((books: Book[]) => books.filter((book: Book) => book.isFavorite)));
    this.memberships$ = this.service.getMembership().pipe(map((datas: Membership[]) => { this.members = datas; return datas; }));
    this.staffMembers$ = this.service.getStaffMember();
    this.transactions$ = this.service.getTransactions().pipe(map((transaction: Transaction[]) => {
      this.groupedByBook = transaction.reduce((acc: any, item) => {
        if (!acc[item.book]) {
          acc[item.book] = [];
        }
        acc[item.book].push(item);
        return acc;
      }, {});

      this.groupedByMembers = transaction.reduce((acc: any, item) => {
        if (!acc[item.member]) {
          acc[item.member] = [];
        }
        acc[item.member].push(item);
        return acc;
      }, {});
      return transaction;
    }));
    setTimeout(() => {
      this.createPieChartForTopBooksLend();
      this.createPieChartForTopMember();
    }, 2000)

  }

  converDate(dateValue: any) {
    return new Date(dateValue).toISOString().substring(0, 10);
  }

  createPieChartForTopBooksLend() {
    const booksIds = Object.keys(this.groupedByBook);
    const toplendedBooks = this.books.map((book: any) => {
      return (booksIds.includes(book.id)) ? { name: book.title, value: this.groupedByBook[book.id].length } : '';
    }).filter(x => x);
    const series = toplendedBooks.map((x: any) => parseInt(x.value));
    const labels = toplendedBooks.map((x: any) => x.name);
    this.chartOptionsBooks = {
      series: [...series],
      chart: {
        type: "pie"
      },
      labels: [...labels],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  createPieChartForTopMember() {
    const membersIds = Object.keys(this.groupedByMembers);
    const topMembers = this.members.map((member: any) => {
      return (membersIds.includes(member.id)) ? { name: member.name, value: this.groupedByMembers[member.id].length } : '';
    }).filter(x => x);
    const series = topMembers.map((x: any) => parseInt(x.value));
    const labels = topMembers.map((x: any) => x.name);
    this.chartOptionsMembers = {
      series: [...series],
      chart: {
        type: "donut"
      },
      labels: [...labels],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
}
