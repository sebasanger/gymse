import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateEjerciciosComponent } from './create-update-ejercicios.component';

describe('CreateUpdateEjerciciosComponent', () => {
  let component: CreateUpdateEjerciciosComponent;
  let fixture: ComponentFixture<CreateUpdateEjerciciosComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateEjerciciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
