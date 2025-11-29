import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesMembresiaDialog } from './detalles-membresia-dialog';

describe('DetallesMembresiaDialog', () => {
  let component: DetallesMembresiaDialog;
  let fixture: ComponentFixture<DetallesMembresiaDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesMembresiaDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesMembresiaDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
