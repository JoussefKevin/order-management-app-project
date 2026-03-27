import { ProductoSemaforoPipe } from "./producto-semaforo-pipe";


describe('ProductoSemaforoPipe', () => {
  let pipe: ProductoSemaforoPipe;

  beforeEach(() => {
    pipe = new ProductoSemaforoPipe();
  });

  it('debe crearse correctamente', () => {
    expect(pipe).toBeTruthy();
  });

  it('debe retornar danger cuando stock es 0', () => {
    expect(pipe.transform(0)).toBe('danger');
  });

  it('debe retornar warning cuando stock es 5 o menos', () => {
    expect(pipe.transform(1)).toBe('warning');
    expect(pipe.transform(5)).toBe('warning');
  });

  it('debe retornar success cuando stock es mayor a 5', () => {
    expect(pipe.transform(6)).toBe('success');
    expect(pipe.transform(100)).toBe('success');
  });
});
