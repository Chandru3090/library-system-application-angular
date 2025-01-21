import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SummaryBooksComponent } from './summary-books/summary-books.component';
import { CreateBookComponent } from './create-book/create-book.component';

export const routes: Routes = [
  { path: '', component: SummaryBooksComponent },
  { path: 'create', component: CreateBookComponent },
  { path: 'edit/:id', component: CreateBookComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class BooksModule { }
