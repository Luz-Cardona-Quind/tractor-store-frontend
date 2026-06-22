import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MfeErrorFallbackComponent } from './mfe-error-fallback.component';

const createFixture = async (mfeName?: string): Promise<ComponentFixture<MfeErrorFallbackComponent>> => {
  await TestBed.configureTestingModule({
    imports: [MfeErrorFallbackComponent],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { data: mfeName ? { mfeName } : {} } },
      },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(MfeErrorFallbackComponent);
  fixture.detectChanges();
  return fixture;
};

describe('MfeErrorFallbackComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('should create', async () => {
    expect((await createFixture('Explorar')).componentInstance).toBeTruthy();
  });

  it('should render the actionable error message', async () => {
    const fixture = await createFixture();
    const msg = fixture.nativeElement.querySelector('.mfe-error__message');
    expect(msg.textContent).toContain('Esta sección no está disponible. Intenta de nuevo.');
  });

  it('should show the mfeName from route data in the title', async () => {
    const fixture = await createFixture('Catálogo');
    const title = fixture.nativeElement.querySelector('.mfe-error__title');
    expect(title.textContent).toContain('Catálogo');
  });

  it('should fall back to "esta sección" when mfeName is absent', async () => {
    const fixture = await createFixture();
    const title = fixture.nativeElement.querySelector('.mfe-error__title');
    expect(title.textContent).toContain('esta sección');
  });

  it('should render the retry button with correct label', async () => {
    const fixture = await createFixture();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.mfe-error__retry');
    expect(btn).toBeTruthy();
    expect(btn.textContent).toContain('Intentar de nuevo');
    expect(btn.type).toBe('button');
  });

  it('should invoke retry() when the retry button is clicked', async () => {
    const fixture = await createFixture();
    const retrySpy = jest.spyOn(fixture.componentInstance as any, 'retry');
    fixture.nativeElement.querySelector('.mfe-error__retry').click();
    expect(retrySpy).toHaveBeenCalledTimes(1);
  });

  it('should have role="alert" for accessibility', async () => {
    const fixture = await createFixture();
    expect(fixture.nativeElement.querySelector('.mfe-error').getAttribute('role')).toBe('alert');
  });
});
