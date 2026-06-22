import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the logo with brand name', () => {
    const logo = fixture.nativeElement.querySelector('.explore-header__logo');
    expect(logo).toBeTruthy();
    expect(logo.textContent).toContain('Tractor Store');
  });

  it('should render at least three navigation links', () => {
    const links = fixture.nativeElement.querySelectorAll('.explore-header__nav-link');
    expect(links.length).toBeGreaterThanOrEqual(3);
  });

  it('should render the cart button', () => {
    const cartBtn = fixture.nativeElement.querySelector('explore-cart-button');
    expect(cartBtn).toBeTruthy();
  });

  it('should render a nav link to home (/)', () => {
    const homeLink = fixture.nativeElement.querySelector('.explore-header__nav-link[href="/"]');
    expect(homeLink).toBeTruthy();
  });
});
