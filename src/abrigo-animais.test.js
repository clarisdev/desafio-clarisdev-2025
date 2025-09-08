import { AbrigoAnimais } from "./abrigo-animais";

describe('Abrigo de Animais', () => {

  test('Deve rejeitar animal inválido', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('CAIXA,RATO', 'RATO,BOLA', 'Lulu');
      expect(resultado.erro).toBe('Animal inválido');
      expect(resultado.lista).toBeFalsy();
  });

  test('Deve encontrar pessoa para um animal', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'RATO,BOLA', 'RATO,NOVELO', 'Rex,Fofo');
      expect(resultado.lista[0]).toBe('Fofo - abrigo');
      expect(resultado.lista[1]).toBe('Rex - pessoa 1');
      expect(resultado.lista.length).toBe(2);
      expect(resultado.erro).toBeFalsy();
  });

  test('Deve encontrar pessoa para um animal intercalando brinquedos', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('BOLA,LASER',
      'BOLA,NOVELO,RATO,LASER', 'Mimi,Fofo,Rex,Bola');

      expect(resultado.lista[0]).toBe('Bola - abrigo');
      expect(resultado.lista[1]).toBe('Fofo - pessoa 2');
      expect(resultado.lista[2]).toBe('Mimi - abrigo');
      expect(resultado.lista[3]).toBe('Rex - abrigo');
      expect(resultado.lista.length).toBe(4);
      expect(resultado.erro).toBeFalsy();
  });
  test('cada pessoa nao pode adotar mais de 3', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'RATO,BOLA,LASER,CAIXA',
      'RATO,BOLA,LASER,CAIXA,NOVELO',
      'Rex,Mimi,Fofo,Zero,BOLA,BEBE'
    );
    // Verifica se ambas as pessoas atingiram o limite de 3
    const adotadosPessoa1 = resultado.lista.filter(a => a.includes('pessoa 1')).length;
    const adotadosPessoa2 = resultado.lista.filter(a => a.includes('pessoa 2')).length;
      expect(adotadosPessoa1).toBeLessThanOrEqual(3);
      expect(adotadosPessoa2).toBeLessThanOrEqual(3);
  })
  test('gatos nao dividem seus brinquedos)', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'BOLA,LASER,RATO',
      'NOVELO,CAIXA',
      'Mimi,Fofo' // Mimi (BOLA, LASER) e Fofo (BOLA, RATO, LASER)
    );
      expect(resultado.lista[0]).toBe('Fofo - abrigo');
      expect(resultado.lista[1]).toBe('Mimi - pessoa 1');
      expect(resultado.erro).toBeFalsy();
  });


  test('LOCO nao liga para a regra dos brinquedos se for adotado com outro pet', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
        'RATO,BOLA,SKATE',
        'NOVELO',
        'Rex,Loco'
    );
      expect(resultado.lista[0]).toBe('Loco - pessoa 1');
      expect(resultado.lista[1]).toBe('Rex - pessoa 1');
      expect(resultado.erro).toBeFalsy();
  });
  test('mantem a regra dos brinquedos caso LOCO seja adotado sozinho', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
        'RATO,SKATE',
        'NOVELO',
        'Zero,Loco' 
    );
      expect(resultado.lista[0]).toBe('Loco - abrigo');
      expect(resultado.lista[1]).toBe('Zero - abrigo');
      expect(resultado.erro).toBeFalsy();
  });
   test('volta para o abrigo em caso de empate', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'RATO,BOLA',
      'RATO,BOLA',
      'Rex'
    );
      expect(resultado.lista[0]).toBe('Rex - abrigo');
      expect(resultado.erro).toBeFalsy();
  });

});
