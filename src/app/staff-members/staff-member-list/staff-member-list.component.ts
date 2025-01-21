import { Component } from '@angular/core';
import { LibraryService } from '../../services/library.service';
import { UserCardComponent } from '../../shared/user-card/user-card.component';
import { Observable, Subject, takeUntil } from 'rxjs';
import { StaffMember } from '../../utils/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-member-list',
  standalone: true,
  imports: [CommonModule, UserCardComponent],
  templateUrl: './staff-member-list.component.html',
  styleUrl: './staff-member-list.component.scss'
})
export class StaffMemberListComponent {
  staffMembers$!: Observable<StaffMember[]>;
  unsubscribe$: Subject<any> = new Subject<any>();

  constructor(private service: LibraryService) { }

  ngOnInit(): void {
    this.getStaffMembers()
  }

  getStaffMembers() {
    this.staffMembers$ = this.service.getStaffMember();
  }

  navigate(url: string, id?: string) {
    this.service.navigate(url, id);
  }

  removeStaffMember(staffMemberId: string) {
    this.service.removeStaffMember(staffMemberId).pipe(takeUntil(this.unsubscribe$)).subscribe((data: StaffMember) => {
      console.log(data);
      this.getStaffMembers();
    });
  }

  toggleFavorite(staffMember: StaffMember) {
    staffMember.isFavorite = !staffMember.isFavorite;
    this.service.updateStaffMember(staffMember).pipe(takeUntil(this.unsubscribe$)).subscribe((data: StaffMember) => {
      console.log(data);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
