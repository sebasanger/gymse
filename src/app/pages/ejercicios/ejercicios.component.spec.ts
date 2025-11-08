import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { EjerciciosComponent } from './ejercicios.component';

describe('EjerciciosComponent', () => {
  let component: EjerciciosComponent;
  let fixture: ComponentFixture<EjerciciosComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EjerciciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
