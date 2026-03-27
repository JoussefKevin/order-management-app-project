import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { OrdenListado } from './orden-listado';

describe('OrdenListado', () => {
  let component: OrdenListado;
  let fixture: ComponentFixture<OrdenListado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OrdenListado,
        CommonModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [
        provideAnimations()
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(OrdenListado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
