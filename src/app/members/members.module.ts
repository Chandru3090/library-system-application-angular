import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MemberListComponent } from './member-list/member-list.component';
import { CreateMemberComponent } from './create-member/create-member.component';

export const routes: Routes = [
  { path: '', component: MemberListComponent },
  { path: 'create', component: CreateMemberComponent },
  { path: 'edit/:id', component: CreateMemberComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MembersModule { }
