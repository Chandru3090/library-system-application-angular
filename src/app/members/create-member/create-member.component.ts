import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Membership, MemberShipType, ToastType } from '../../utils/models';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LibraryService } from '../../services/library.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-create-member',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-member.component.html',
  styleUrl: './create-member.component.scss'
})
export class CreateMemberComponent implements OnInit, OnDestroy {
  membershipForm!: FormGroup;
  membershipTypes = MemberShipType;
  unsubscribe$: Subject<any> = new Subject<any>();
  membershipId!: string | null;
  
  private fb: FormBuilder = inject(FormBuilder);
  private service: LibraryService = inject(LibraryService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private toastService: NotificationService = inject(NotificationService);

  get membershipTypeKeys(): string[] {
    return Object.keys(MemberShipType).filter((key) => isNaN(Number(key)));
  }

  ngOnInit(): void {
    this.createMembershipForm();
    this.membershipId = this.route.snapshot.paramMap.get('id');
    if (this.membershipId) {
      this.getMemberShipDetailsById(this.membershipId);
    }
  }

  createMembershipForm() {
    this.membershipForm = this.fb.group({
      name: ['', [Validators.required]], // Name is mandatory
      email: ['', [Validators.required, Validators.email]], // Valid email format
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')], // 10-digit phone number
      ],
      membershipStartDate: [new Date().toISOString().substring(0, 10)], // Default to current date
      membershipType: ['', Validators.required], // Membership type is mandatory
      maxBooksAllowed: [{ value: '' }], // Auto-filled
    });

    this.membershipForm.get('membershipType')?.valueChanges.subscribe((type) => {
      const maxBooks = this.membershipTypes[type as keyof typeof MemberShipType];
      this.membershipForm.patchValue({ maxBooksAllowed: maxBooks });
    });
  }

  createMembership() {
    if (this.membershipForm?.valid && !this.membershipId) {
      const payload = this.membershipForm.value;
      payload.lendsBookCount = 0;
      this.service.createMembership(payload).pipe(takeUntil(this.unsubscribe$)).subscribe((data: Membership) => {
        this.toastService.show('Success', `${data.name} user created successfully`, ToastType.Success);
        this.navigate();
      }, error => {
        console.error(error);
        this.toastService.show('Error', 'Membership user create API Failure', ToastType.Error);
      });
    } else {
      const payload = { ...this.membershipForm.value, id: this.membershipId }
      this.service.updateMembership(payload).pipe(takeUntil(this.unsubscribe$)).subscribe((data: Membership) => {
        this.toastService.show('Success', `${data.name} user updated successfully`, ToastType.Success);
        this.navigate();
      }, error => {
        console.error(error);
        this.toastService.show('Success', 'Membership user update API Failure', ToastType.Error);
      });
    }
  }

  getMemberShipDetailsById(membershipId: string) {
    this.service.getMemberShipById(membershipId).pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
      this.membershipForm.patchValue({ ...data });
    }, error => {
      console.error(error);
      this.toastService.show('Error', 'Get Membership API Failure', ToastType.Error);
    });
  }

  navigate() {
    this.service.navigate('/members');
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
