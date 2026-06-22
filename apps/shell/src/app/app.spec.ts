import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should show fallback header when remote fails to load', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    (fixture.componentInstance as any).headerFailed.set(true);
    fixture.detectChanges();

    const fallback = fixture.nativeElement.querySelector('shell-header-fallback');
    expect(fallback).toBeTruthy();
  });

  it('should show fallback footer when remote fails to load', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    (fixture.componentInstance as any).footerFailed.set(true);
    fixture.detectChanges();

    const fallback = fixture.nativeElement.querySelector('shell-footer-fallback');
    expect(fallback).toBeTruthy();
  });

  it('should not show fallback header when remote is loading', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const fallback = fixture.nativeElement.querySelector('shell-header-fallback');
    expect(fallback).toBeNull();
  });

  it('should render the router outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const outlet = fixture.nativeElement.querySelector('router-outlet');
    expect(outlet).toBeTruthy();
  });
});
