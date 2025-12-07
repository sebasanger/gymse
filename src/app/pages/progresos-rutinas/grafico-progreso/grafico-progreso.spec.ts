import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoProgreso } from './grafico-progreso';

describe('GraficoProgreso', () => {
  let component: GraficoProgreso;
  let fixture: ComponentFixture<GraficoProgreso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoProgreso]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoProgreso);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
