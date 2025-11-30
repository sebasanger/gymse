import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoMembresia } from './pago-membresia';

describe('PagoMembresia', () => {
  let component: PagoMembresia;
  let fixture: ComponentFixture<PagoMembresia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoMembresia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoMembresia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
