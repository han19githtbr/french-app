import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component'; // Importe seu componente

describe('AppComponent', () => { // Descreve o componente que está sendo testado
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => { // Executa antes de cada teste
    await TestBed.configureTestingModule({ // Configura o módulo de teste
      declarations: [
        AppComponent // Declara o componente no módulo de teste
      ],
    }).compileComponents(); // Compila os componentes
  });

  beforeEach(() => { // Executa antes de cada teste (instancia o componente)
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Detecta mudanças no componente
  });

  it('should create the app', () => { // Teste: deve criar o app
    expect(component).toBeTruthy(); // Verifica se o componente foi criado
  });

  it(`should have as title 'french-app'`, () => { // Teste: deve ter o título 'french-app'
    expect(component.title).toEqual('french-app'); // Verifique se o título do componente corresponde
  });

  it('should render title', () => { // Teste: deve renderizar o título
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('french-app is running!'); // Adapte o seletor e o texto para o seu template
  });
});
