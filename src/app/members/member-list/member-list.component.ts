import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Membership, ToastType } from '../../utils/models';
import { LibraryService } from '../../services/library.service';
import { UserCardComponent } from '../../shared/user-card/user-card.component';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule, UserCardComponent],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent implements OnInit, OnDestroy {
  memberships$!: Observable<Membership[]>;
  unsubscribe$: Subject<any> = new Subject<any>();

  private service: LibraryService = inject(LibraryService);
  public authService: AuthService = inject(AuthService);
  private toastService: NotificationService = inject(NotificationService);

  ngOnInit(): void {
    this.getMemberships()
  }

  getMemberships() {
    this.memberships$ = this.service.getMembership();
  }

  navigate(url: string, id?: string) {
    this.service.navigate(url, id);
  }

  removeMember(membershipId: string) {
    this.service.removeMembership(membershipId).pipe(takeUntil(this.unsubscribe$)).subscribe((data: Membership) => {
      this.toastService.show('Success', `${data.name} removed successfully`, ToastType.Success);
      this.getMemberships();
    });
  }

  toggleFavorite(membership: Membership) {
    membership.isFavorite = !membership.isFavorite;
    this.service.updateMembership(membership).pipe(takeUntil(this.unsubscribe$)).subscribe((data: Membership) => {
      this.toastService.show('Success', `${data.name} has been ${membership.isFavorite ? 'marked' : 'unmarked'} as favorite`, ToastType.Success);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
