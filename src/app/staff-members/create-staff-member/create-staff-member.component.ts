import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { LibraryService } from '../../services/library.service';
import { ActivatedRoute } from '@angular/router';
import { STAFF_MEMBERS_ROLE } from '../../utils/constant';
import { CommonModule } from '@angular/common';
import { passwordValidator } from '../../utils/password.validator';

@Component({
  selector: 'app-create-staff-member',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-staff-member.component.html',
  styleUrl: './create-staff-member.component.scss'
})
export class CreateStaffMemberComponent {
  staffMembershipForm!: FormGroup;
  staffMembersRoles = STAFF_MEMBERS_ROLE;
  unsubscribe$: Subject<any> = new Subject<any>();
  staffMembersId!: string | null;

  constructor(private fb: FormBuilder,
    private service: LibraryService,
    private route: ActivatedRoute) {
    this.createStaffMembersForm();
  }

  ngOnInit(): void {
    this.staffMembersId = this.route.snapshot.paramMap.get('id');
    if (this.staffMembersId) {
      this.getStaffMembersDetailsById(this.staffMembersId);
    }
  }

  createStaffMembersForm() {
    this.staffMembershipForm = this.fb.group({
      name: ['', [Validators.required]], // Name is mandatory
      email: ['', [Validators.required, Validators.email]], // Valid email format
      password: ['', [Validators.required, passwordValidator()]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')], // 10-digit phone number
      ],
      role: [this.staffMembersRoles[0], Validators.required], // Membership type is mandatory
    });
  }

  createStaffMembers() {
    if (this.staffMembershipForm?.valid && !this.staffMembersId) {
      this.service.createStaffMember(this.staffMembershipForm.value).pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
        this.navigate();
      }, error => {
        console.error(error);
      });
    } else {
      const payload = { ...this.staffMembershipForm.value, id: this.staffMembersId };
      this.service.updateStaffMember(payload).pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
        this.navigate();
      }, error => {
        console.error(error);
      });
    }
  }

  getStaffMembersDetailsById(membershipId: string) {
    this.service.getStaffMemberById(membershipId).pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
      this.staffMembershipForm.patchValue({ ...data });
    }, error => {
      console.error(error)
    });
  }

  navigate() {
    this.service.navigate('/staff-members');
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
