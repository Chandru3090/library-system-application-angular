import { Component, inject } from '@angular/core';
import { LibraryService } from '../../services/library.service';
import { UserCardComponent } from '../../shared/user-card/user-card.component';
import { Observable, Subject, takeUntil } from 'rxjs';
import { StaffMember, ToastType } from '../../utils/models';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

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

  private service: LibraryService = inject(LibraryService);
  public authService: AuthService = inject(AuthService);
  private toastService: NotificationService = inject(NotificationService);

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
      this.toastService.show('Success', `${data.name} removed successfully`, ToastType.Success);
      this.getStaffMembers();
    });
  }

  toggleFavorite(staffMember: StaffMember) {
    staffMember.isFavorite = !staffMember.isFavorite;
    this.service.updateStaffMember(staffMember).pipe(takeUntil(this.unsubscribe$)).subscribe((data: StaffMember) => {
      this.toastService.show('Success', `${staffMember.name} has been ${staffMember.isFavorite ? 'marked' : 'unmarked'} as favorite`, ToastType.Success);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
