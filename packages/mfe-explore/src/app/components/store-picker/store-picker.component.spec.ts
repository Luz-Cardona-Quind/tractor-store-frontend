import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StorePickerComponent } from './store-picker.component';
import type { Store } from 'shared-catalog';

const MOCK_STORE: Store = {
  id: 'store-1',
  name: 'Tienda Central Bogotá',
  address: 'Av. El Dorado #68B-31, Bogotá',
  coordinates: { lat: 4.6512, lng: -74.1002 },
};

describe('StorePickerComponent', () => {
  let fixture: ComponentFixture<StorePickerComponent>;
  let component: StorePickerComponent;

  const setup = async (selected = false) => {
    await TestBed.configureTestingModule({
      imports: [StorePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StorePickerComponent);
    component = fixture.componentInstance;
    component.store = MOCK_STORE;
    component.selected = selected;
    fixture.detectChanges();
  };

  afterEach(() => TestBed.resetTestingModule());

  it('should create', async () => {
    await setup();
    expect(component).toBeTruthy();
  });

  it('should render the store name', async () => {
    await setup();
    const name = fixture.nativeElement.querySelector('.store-picker__name');
    expect(name.textContent).toContain('Tienda Central Bogotá');
  });

  it('should render the store address', async () => {
    await setup();
    const address = fixture.nativeElement.querySelector('.store-picker__address');
    expect(address.textContent).toContain('Av. El Dorado #68B-31, Bogotá');
  });

  it('should show "Seleccionar" when not selected', async () => {
    await setup(false);
    const btn = fixture.nativeElement.querySelector('.store-picker__btn');
    expect(btn.textContent).toContain('Seleccionar');
  });

  it('should show "Mi tienda" when selected', async () => {
    await setup(true);
    const btn = fixture.nativeElement.querySelector('.store-picker__btn');
    expect(btn.textContent).toContain('Mi tienda');
  });

  it('should apply --selected modifier class when selected', async () => {
    await setup(true);
    const article = fixture.nativeElement.querySelector('.store-picker');
    expect(article.classList).toContain('store-picker--selected');
  });

  it('should NOT apply --selected modifier class when not selected', async () => {
    await setup(false);
    const article = fixture.nativeElement.querySelector('.store-picker');
    expect(article.classList).not.toContain('store-picker--selected');
  });

  it('should emit storeSelected with the store when the button is clicked', async () => {
    await setup();
    const selected: Store[] = [];
    component.storeSelected.subscribe((s) => selected.push(s));

    fixture.nativeElement.querySelector('.store-picker__btn').click();
    expect(selected).toHaveLength(1);
    expect(selected[0]).toBe(MOCK_STORE);
  });

  it('should set aria-pressed="true" on the button when selected', async () => {
    await setup(true);
    const btn = fixture.nativeElement.querySelector('.store-picker__btn');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
  });
});
