import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Membership } from '../../utils/models';
import { LibraryService } from '../../services/library.service';
import { UserCardComponent } from '../../shared/user-card/user-card.component';

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
  constructor(private service: LibraryService) { }

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
      this.getMemberships();
    });
  }

  toggleFavorite(membership: Membership) {
    membership.isFavorite = !membership.isFavorite;
    this.service.updateMembership(membership).pipe(takeUntil(this.unsubscribe$)).subscribe((data: Membership) => {
      console.log(data);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
