import { AbrigoAnimais } from "./abrigo-animais";

describe('Abrigo de Animais', () => {
  test('Deve rejeitar animal inválido', () => {
    // passando um animal que nao existe (lulu)    
    // o sistema deve retornar erro e nao gerar lista
    const resultado = new AbrigoAnimais().encontraPessoas('CAIXA,RATO', 'RATO,BOLA', 'Lulu');
      expect(resultado.erro).toBe('Animal inválido');
      expect(resultado.lista).toBeFalsy();
  });

  test('Deve encontrar pessoa para um animal', () => {
      // fofo nao encontra correspondencia e volta para o abrigo
      // rex tem todos os brinquedos com a pessoa 1
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
    // testa a regra de que os brinquedos podem ser intercalados
    // mesmo que venham acompanhados de itens que o animal nao gosta
      expect(resultado.lista[0]).toBe('Bola - abrigo');
      expect(resultado.lista[1]).toBe('Fofo - pessoa 2');
      expect(resultado.lista[2]).toBe('Mimi - abrigo');
      expect(resultado.lista[3]).toBe('Rex - abrigo');
      expect(resultado.lista.length).toBe(4);
      expect(resultado.erro).toBeFalsy();
  });
  test('cada pessoa nao pode adotar mais de 3', () => {
    // valida o limite de adocao: cada pessoa so pode adotar ate 3 animais
    const resultado = new AbrigoAnimais().encontraPessoas(
      'RATO,BOLA,LASER,CAIXA',
      'RATO,BOLA,LASER,CAIXA,NOVELO',
      'Rex,Mimi,Fofo,Zero,BOLA,BEBE'
    );
    const adotadosPessoa1 = resultado.lista.filter(a => a.includes('pessoa 1')).length;
    const adotadosPessoa2 = resultado.lista.filter(a => a.includes('pessoa 2')).length;
      expect(adotadosPessoa1).toBeLessThanOrEqual(3);
      expect(adotadosPessoa2).toBeLessThanOrEqual(3);
  })
  test('gatos nao dividem seus brinquedos)', () => {
    // mimi e gato, entao nao divide brinquedos com outros
    const resultado = new AbrigoAnimais().encontraPessoas(
      'BOLA,LASER,RATO',
      'NOVELO,CAIXA',
      'Mimi,Fofo'
    );
      expect(resultado.lista[0]).toBe('Fofo - abrigo');
      expect(resultado.lista[1]).toBe('Mimi - pessoa 1');
      expect(resultado.erro).toBeFalsy();
  });


  test('LOCO nao liga para a regra dos brinquedos se for adotado com outro pet', () => {
    // loco pode ser adotado mesmo sem respeitar ordem de brinquedos
    // desde que esteja junto com outro animal
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
    // se loco for adotado sozinho, segue as regras normais
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
     // quando as duas pessoas tem os brinquedos iguais, o animal nao e adotado
    const resultado = new AbrigoAnimais().encontraPessoas(
      'RATO,BOLA',
      'RATO,BOLA',
      'Rex'
    );
      expect(resultado.lista[0]).toBe('Rex - abrigo');
      expect(resultado.erro).toBeFalsy();
  });

});
