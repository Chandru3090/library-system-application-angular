import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
    {
        path: 'books',
        loadChildren: () => import('./books/books.module').then(m => m.BooksModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'members',
        loadChildren: () => import('./members/members.module').then(m => m.MembersModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'transactions',
        loadChildren: () => import('./transactions/transactions.module').then(m => m.TransactionsModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'staff-members',
        loadChildren: () => import('./staff-members/staff-members.module').then(m => m.StaffMembersModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(c => c.LoginComponent)
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    } // Default route
];
