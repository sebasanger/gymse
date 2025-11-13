import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoRutina } from './seguimiento-rutina';

describe('SeguimientoRutina', () => {
  let component: SeguimientoRutina;
  let fixture: ComponentFixture<SeguimientoRutina>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoRutina]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoRutina);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
