import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TsButtonComponent } from './button.component';

describe('TsButtonComponent', () => {
  let fixture: ComponentFixture<TsButtonComponent>;
  let component: TsButtonComponent;
  let buttonEl: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    buttonEl = fixture.nativeElement.querySelector('button');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── Default state ──────────────────────────────────────────────────────────

  it('should render a <button> element with type="button"', () => {
    expect(buttonEl).toBeTruthy();
    expect(buttonEl.type).toBe('button');
  });

  it('should apply the primary variant class by default', () => {
    expect(buttonEl.classList).toContain('ts-btn--primary');
  });

  it('should apply the md size class by default', () => {
    expect(buttonEl.classList).toContain('ts-btn--md');
  });

  it('should not be disabled by default', () => {
    expect(buttonEl.disabled).toBe(false);
  });

  // ── Variants ──────────────────────────────────────────────────────────────

  it('should apply ts-btn--secondary for secondary variant', () => {
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.detectChanges();
    expect(buttonEl.classList).toContain('ts-btn--secondary');
    expect(buttonEl.classList).not.toContain('ts-btn--primary');
  });

  it('should apply ts-btn--ghost for ghost variant', () => {
    fixture.componentRef.setInput('variant', 'ghost');
    fixture.detectChanges();
    expect(buttonEl.classList).toContain('ts-btn--ghost');
    expect(buttonEl.classList).not.toContain('ts-btn--primary');
  });

  // ── Sizes ─────────────────────────────────────────────────────────────────

  it('should apply ts-btn--sm for sm size', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(buttonEl.classList).toContain('ts-btn--sm');
    expect(buttonEl.classList).not.toContain('ts-btn--md');
  });

  it('should apply ts-btn--lg for lg size', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(buttonEl.classList).toContain('ts-btn--lg');
    expect(buttonEl.classList).not.toContain('ts-btn--md');
  });

  // ── Disabled state ────────────────────────────────────────────────────────

  it('should set the native disabled attribute when disabled=true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(buttonEl.disabled).toBe(true);
  });

  it('should not emit clicked when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const spy = jest.spyOn(component.clicked, 'emit');
    component.handleClick();
    expect(spy).not.toHaveBeenCalled();
  });

  // ── Loading state ─────────────────────────────────────────────────────────

  it('should apply ts-btn--loading class when loading=true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(buttonEl.classList).toContain('ts-btn--loading');
  });

  it('should render the spinner element when loading=true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('.ts-btn__spinner');
    expect(spinner).toBeTruthy();
  });

  it('should set aria-busy when loading=true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(buttonEl.getAttribute('aria-busy')).toBe('true');
  });

  it('should not render the spinner when loading=false', () => {
    const spinner = fixture.nativeElement.querySelector('.ts-btn__spinner');
    expect(spinner).toBeNull();
  });

  it('should disable the native button when loading=true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(buttonEl.disabled).toBe(true);
  });

  it('should not emit clicked when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const spy = jest.spyOn(component.clicked, 'emit');
    component.handleClick();
    expect(spy).not.toHaveBeenCalled();
  });

  // ── Click emission ────────────────────────────────────────────────────────

  it('should emit clicked when the button is clicked in a normal state', () => {
    const spy = jest.spyOn(component.clicked, 'emit');
    buttonEl.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not emit clicked when the native button is clicked while disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const spy = jest.spyOn(component.clicked, 'emit');
    buttonEl.click();
    expect(spy).not.toHaveBeenCalled();
  });
});
