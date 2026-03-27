import { OrdenStatusPipe } from "./orden-status-pipe";

describe('OrdenStatusPipe', () => {
  let pipe: OrdenStatusPipe;

  beforeEach(() => {
    pipe = new OrdenStatusPipe();
  });

  it('debe crearse correctamente', () => {
    expect(pipe).toBeTruthy();
  });

  it('debe traducir PENDING a Pendiente', () => {
    expect(pipe.transform('PENDING')).toBe('Pendiente');
  });

  it('debe traducir CONFIRMED a Confirmado', () => {
    expect(pipe.transform('CONFIRMED')).toBe('Confirmado');
  });

  it('debe traducir CANCELLED a Cancelado', () => {
    expect(pipe.transform('CANCELLED')).toBe('Cancelado');
  });

  it('debe traducir DELIVERED a Entregado', () => {
    expect(pipe.transform('DELIVERED')).toBe('Entregado');
  });

  it('debe retornar el valor original si no se reconoce', () => {
    expect(pipe.transform('UNKNOWN')).toBe('UNKNOWN');
  });
});
