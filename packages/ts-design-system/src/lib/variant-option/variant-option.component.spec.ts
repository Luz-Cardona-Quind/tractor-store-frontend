import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TsVariantOptionComponent } from './variant-option.component';

describe('TsVariantOptionComponent', () => {
  let fixture: ComponentFixture<TsVariantOptionComponent>;
  let component: TsVariantOptionComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsVariantOptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TsVariantOptionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Verde');
    fixture.componentRef.setInput('value', 'verde');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── Render ────────────────────────────────────────────────────────────────

  it('should render as a button element', () => {
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn).toBeTruthy();
    expect(btn.type).toBe('button');
  });

  it('should render the label', () => {
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.textContent?.trim()).toBe('Verde');
  });

  it('should render an empty label when label is empty string', () => {
    fixture.componentRef.setInput('label', '');
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.textContent?.trim()).toBe('');
  });

  // ── Estado selected ───────────────────────────────────────────────────────

  it('should apply --selected modifier when selected=true', () => {
    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('ts-variant-option--selected');
  });

  it('should not apply --selected modifier when selected=false', () => {
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList).not.toContain('ts-variant-option--selected');
  });

  it('should set aria-pressed=true when selected=true', () => {
    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
  });

  it('should set aria-pressed=false when selected=false', () => {
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.getAttribute('aria-pressed')).toBe('false');
  });

  // ── Estado disabled ───────────────────────────────────────────────────────

  it('should be disabled when disabled=true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.disabled).toBe(true);
  });

  it('should not be disabled when disabled=false', () => {
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.disabled).toBe(false);
  });

  // ── Emisión de optionSelected ─────────────────────────────────────────────

  it('should emit optionSelected with the value on click', () => {
    const spy = jest.spyOn(component.optionSelected, 'emit');
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();
    expect(spy).toHaveBeenCalledWith('verde');
  });

  it('should not emit optionSelected when disabled=true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const spy = jest.spyOn(component.optionSelected, 'emit');
    component.handleClick();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not emit optionSelected when button is clicked while disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const spy = jest.spyOn(component.optionSelected, 'emit');
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();
    expect(spy).not.toHaveBeenCalled();
  });
});
