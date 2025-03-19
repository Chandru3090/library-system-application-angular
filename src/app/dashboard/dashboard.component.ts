import { Component, OnInit, ViewChild } from '@angular/core';
import { LibraryService } from '../services/library.service';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { Book, Membership, StaffMember, Transaction } from '../utils/models';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexLegend, ApexNonAxisChartSeries, ApexResponsive, ApexStroke, ApexTitleSubtitle, ApexXAxis, ApexYAxis, ChartComponent, NgApexchartsModule } from "ng-apexcharts";

export type ChartOptionsForPieChart = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

export type ChartOptionsForAreaChart = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  xaxis?: ApexXAxis;
  stroke?: ApexStroke;
  dataLabels?: ApexDataLabels;
  yaxis?: ApexYAxis;
  title?: ApexTitleSubtitle;
  legend?: ApexLegend;
  subtitle?: ApexTitleSubtitle;
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
  overDuetransactions: Transaction[] = [];
  currentDate = new Date().toISOString().substring(0, 10);
  books: Book[] = [];
  groupedByBook: any;
  members: Membership[] = [];
  @ViewChild("bookChart") chartBook: ChartComponent | undefined;
  @ViewChild("memberChart") chartMember: ChartComponent | undefined;
  @ViewChild("overdueAmountChart") chartOverdueAmount: ChartComponent | undefined;
  public chartOptionsOverdueAmount: Partial<ChartOptionsForAreaChart> | undefined;
  public chartOptionsBooks: Partial<ChartOptionsForPieChart> | undefined;
  public chartOptionsMembers: Partial<ChartOptionsForPieChart> | undefined;
  groupedByMembers: any;
  totalOverdueAmount: number = 0;
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
    this.transactions$ = this.service.getTransactions().pipe(map((transactions: Transaction[]) => {
      this.groupedByBook = transactions.reduce((acc: any, item) => {
        if (!acc[item.book]) {
          acc[item.book] = [];
        }
        acc[item.book].push(item);
        return acc;
      }, {});

      this.groupedByMembers = transactions.reduce((acc: any, item) => {
        if (!acc[item.member]) {
          acc[item.member] = [];
        }
        acc[item.member].push(item);
        return acc;
      }, {});
      this.overDuetransactions = transactions.filter((transaction: Transaction) => this.converDate(transaction.returnDate) < this.currentDate);
      this.totalOverdueAmount = this.overDuetransactions
        .map(transaction => Number(transaction.fineAmount))
        .reduce((acc, fine) => acc + fine, 0);
      return transactions;
    }));
    setTimeout(() => {
      this.createPieChartForTopBooksLend();
      this.createPieChartForTopMember();
      this.createAreaChartForOverdueAmount();
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

  getBadgeClassByMembershipType(transaction: any) {
    const membersType = transaction.memberDetails?.membershipType;
    return (membersType == 'Basic') ? 'bg-red-500' : (membersType === 'Premium') ? 'bg-blue-500' : 'bg-green-500';
  }

  createAreaChartForOverdueAmount() {
    this.chartOptionsOverdueAmount = {
      series: [
        {
          name: "Overdue Amount Report",
          data: this.getOvedueAmountData()
        }
      ],
      chart: {
        type: "area",
        height: '300px',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },

      title: {
        text: "Overdue Amount Report",
        align: "left"
      },
      subtitle: {
        text: "Fine Amount",
        align: "left"
      },
      labels: this.getOverdueAmountLabel(),
      xaxis: {
        type: "category"
      },
      yaxis: {
        opposite: true
      },
      legend: {
        horizontalAlign: "left"
      }
    };
  }

  getOvedueAmountData() {
    return this.overDuetransactions.map((transaction: Transaction) => transaction.fineAmount);
  }

  getOverdueAmountLabel() {
    return this.overDuetransactions.map((transaction: Transaction) => transaction.memberDetails?.name);
  }
}
