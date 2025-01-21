import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';

export const routes: Routes = [
  { path: '', component: TransactionListComponent },
  { path: 'create', component: CreateTransactionComponent },
  { path: 'edit/:id', component: CreateTransactionComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class TransactionsModule { }
