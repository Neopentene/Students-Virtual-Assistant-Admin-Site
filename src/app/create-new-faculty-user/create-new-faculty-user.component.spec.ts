import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewFacultyUserComponent } from './create-new-faculty-user.component';

describe('CreateNewFacultyUserComponent', () => {
  let component: CreateNewFacultyUserComponent;
  let fixture: ComponentFixture<CreateNewFacultyUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewFacultyUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewFacultyUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
