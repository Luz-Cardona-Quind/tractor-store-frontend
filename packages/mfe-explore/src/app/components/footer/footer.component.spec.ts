import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let component: FooterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the footer element', () => {
    const footer = fixture.nativeElement.querySelector('.explore-footer');
    expect(footer).toBeTruthy();
  });

  it('should render the brand logo', () => {
    const logo = fixture.nativeElement.querySelector('.explore-footer__logo');
    expect(logo).toBeTruthy();
    expect(logo.textContent).toContain('Tractor Store');
  });

  it('should render navigation links', () => {
    const links = fixture.nativeElement.querySelectorAll('.explore-footer__link');
    expect(links.length).toBeGreaterThanOrEqual(3);
  });

  it('should render the copyright notice', () => {
    const copyright = fixture.nativeElement.querySelector('.explore-footer__copyright');
    expect(copyright).toBeTruthy();
    expect(copyright.textContent).toContain('2026');
  });
});
