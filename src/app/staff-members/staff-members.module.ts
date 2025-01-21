import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StaffMemberListComponent } from './staff-member-list/staff-member-list.component';
import { CreateStaffMemberComponent } from './create-staff-member/create-staff-member.component';

export const routes: Routes = [
  { path: '', component: StaffMemberListComponent },
  { path: 'create', component: CreateStaffMemberComponent },
  { path: 'edit/:id', component: CreateStaffMemberComponent }];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class StaffMembersModule { }
