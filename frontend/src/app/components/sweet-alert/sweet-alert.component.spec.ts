import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SweetAlertComponent } from './sweet-alert.component';

describe('SweetAlertComponent', () => {
  let component: SweetAlertComponent;
  let fixture: ComponentFixture<SweetAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SweetAlertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SweetAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
