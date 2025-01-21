import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryBooksComponent } from './summary-books.component';

describe('SummaryBooksComponent', () => {
  let component: SummaryBooksComponent;
  let fixture: ComponentFixture<SummaryBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryBooksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
