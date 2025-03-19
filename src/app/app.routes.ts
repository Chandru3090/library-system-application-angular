import { Routes } from '@angular/router';
import { AuthGuard } from './services/guards/auth.guard';
import { RoleGuard } from './services/guards/role.guard';

export const routes: Routes = [
    {
        path: 'books',
        children: [
            { path: '', loadComponent: () => import('./books/summary-books/summary-books.component').then(c => c.SummaryBooksComponent) },
            { path: 'create', loadComponent: () => import('./books/create-book/create-book.component').then(c => c.CreateBookComponent), canActivate: [RoleGuard] },
            { path: 'edit/:id', loadComponent: () => import('./books/create-book/create-book.component').then(c => c.CreateBookComponent), canActivate: [RoleGuard] }
        ],
        canActivate: [AuthGuard]
    },
    {
        path: 'members',
        children: [
            { path: '', loadComponent: () => import('./members/member-list/member-list.component').then(c => c.MemberListComponent) },
            { path: 'create', loadComponent: () => import('./members/create-member/create-member.component').then(c => c.CreateMemberComponent), canActivate: [RoleGuard] },
            { path: 'edit/:id', loadComponent: () => import('./members/create-member/create-member.component').then(c => c.CreateMemberComponent), canActivate: [RoleGuard] }
        ],
        canActivate: [AuthGuard]
    },
    {
        path: 'transactions',
        children: [
            { path: '', loadComponent: () => import('./transactions/transaction-list/transaction-list.component').then(c => c.TransactionListComponent) },
            { path: 'create', loadComponent: () => import('./transactions/create-transaction/create-transaction.component').then(c => c.CreateTransactionComponent), canActivate: [RoleGuard] },
            { path: 'edit/:id', loadComponent: () => import('./transactions/create-transaction/create-transaction.component').then(c => c.CreateTransactionComponent), canActivate: [RoleGuard] }
        ],
        canActivate: [AuthGuard]
    },
    {
        path: 'staff-members',
        children: [
            { path: '', loadComponent: () => import('./staff-members/staff-member-list/staff-member-list.component').then(c => c.StaffMemberListComponent) },
            { path: 'create', loadComponent: () => import('./staff-members/create-staff-member/create-staff-member.component').then(c => c.CreateStaffMemberComponent), canActivate: [RoleGuard] },
            { path: 'edit/:id', loadComponent: () => import('./staff-members/create-staff-member/create-staff-member.component').then(c => c.CreateStaffMemberComponent), canActivate: [RoleGuard] }
        ],
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
