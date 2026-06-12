import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TsDesignSystem } from './ts-design-system';

describe('TsDesignSystem', () => {
  let component: TsDesignSystem;
  let fixture: ComponentFixture<TsDesignSystem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsDesignSystem],
    }).compileComponents();

    fixture = TestBed.createComponent(TsDesignSystem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
