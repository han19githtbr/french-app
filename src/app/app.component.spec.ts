import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/shared/header/header.component'; // Importe AQUI
import { RouterTestingModule } from '@angular/router/testing'; // Se usar roteamento
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Importe o CUSTOM_ELEMENTS_SCHEMA

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, HeaderComponent], // Declare AQUI
      imports: [RouterTestingModule], // Se usar roteamento
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Adicione o schemas aqui
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'french-app'`, () => {
    expect(app.title).toEqual('french-app');
  });

  it('should render header', () => {
    const headerElement = fixture.nativeElement.querySelector('app-header');
    expect(headerElement).toBeTruthy();
  });
});
