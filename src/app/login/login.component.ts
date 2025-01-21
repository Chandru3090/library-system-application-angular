import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordValidator } from '../utils/password.validator';
import { AuthService } from '../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { StaffMember } from '../utils/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  submitted: boolean = false;
  unsubscribe$: Subject<any> = new Subject<any>();
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.createLoginForm();
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).pipe(takeUntil(this.unsubscribe$)).subscribe((user: StaffMember[]) => {
        if (user.length) {
          this.authService.setLoginInfo(user[0]);
          this.router.navigate(['/dashboard']);
        } else {
          alert('Invalid Username / Password')
        }
      });
    }
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Valid email format
      password: ['', [Validators.required, passwordValidator()]],
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
