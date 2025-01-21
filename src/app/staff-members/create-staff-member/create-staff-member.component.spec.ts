import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStaffMemberComponent } from './create-staff-member.component';

describe('CreateStaffMemberComponent', () => {
  let component: CreateStaffMemberComponent;
  let fixture: ComponentFixture<CreateStaffMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateStaffMemberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStaffMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
