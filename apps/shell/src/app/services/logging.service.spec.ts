import { TestBed } from '@angular/core/testing';
import { LoggingService } from './logging.service';

describe('LoggingService', () => {
  let service: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call console.error with prefixed message on error()', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const cause = new Error('red');
    service.error('algo falló', cause);
    expect(spy).toHaveBeenCalledWith('[Shell] algo falló', cause);
    spy.mockRestore();
  });

  it('should call console.error with empty string when cause is omitted', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    service.error('sin causa');
    expect(spy).toHaveBeenCalledWith('[Shell] sin causa', '');
    spy.mockRestore();
  });

  it('should call console.warn with prefixed message on warn()', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    service.warn('advertencia', { key: 'value' });
    expect(spy).toHaveBeenCalledWith('[Shell] advertencia', { key: 'value' });
    spy.mockRestore();
  });

  it('should call console.info with prefixed message on log()', () => {
    const spy = jest.spyOn(console, 'info').mockImplementation(() => {});
    service.log('petición saliente', { url: '/api' });
    expect(spy).toHaveBeenCalledWith('[Shell] petición saliente', { url: '/api' });
    spy.mockRestore();
  });

  it('should call console.info with empty string when context is omitted on log()', () => {
    const spy = jest.spyOn(console, 'info').mockImplementation(() => {});
    service.log('sin contexto');
    expect(spy).toHaveBeenCalledWith('[Shell] sin contexto', '');
    spy.mockRestore();
  });
});
