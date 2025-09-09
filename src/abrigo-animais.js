class AbrigoAnimais {
  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    //banco de dados dos bichinhos
    const bichinhos = {
      'REX': { especie: 'cao', favoritos: ["RATO", 'BOLA'] },
      'MIMI': { especie: 'gato', favoritos: ["BOLA", "LASER"] },
      'FOFO': { especie: 'gato', favoritos: ["BOLA", "RATO", "LASER"] },
      'ZERO': { especie: 'gato', favoritos: ["RATO", "BOLA"] },
      'BOLA': { especie: 'cao', favoritos: ["CAIXA", "NOVELO"] },
      'BEBE': { especie: 'cao', favoritos: ["LASER", "RATO", "BOLA"] },
      'LOCO': { especie: 'jabuti', favoritos: ["SKATE", "RATO"] }
    };
    //cria uma lista dos brinquedos do abrigo e valida se o brinquedo nao foi inventado
    const todosOsBrinquedos = new Set();
    for (const bichinho of Object.values(bichinhos)) {
      bichinho.favoritos.forEach(b => todosOsBrinquedos.add(b));
    }
    //lista de brinquedos e ordem dos animais
    const brinquedosP1 = brinquedosPessoa1.split(',').map(b => b.trim().toUpperCase());
    const brinquedosP2 = brinquedosPessoa2.split(',').map(b => b.trim().toUpperCase());
    const ordemDosAnimais = ordemAnimais.split(',').map(a => a.trim().toUpperCase());
    //verifica quantos animais a pessoa tem (maximo 3)
    const contagemDeAdotados = { 'pessoa 1': 0, 'pessoa 2': 0 };
    const resultado = {};

    const formataNome = (nome) => nome.charAt(0) + nome.slice(1).toLowerCase();
    //checando se os brinquedos sao validos e nao estao se repetindo
    const checaValidade = (lista) => {
      const unicos = new Set();
      for (const item of lista) {
        if (unicos.has(item)) return 'repetido';
        if (!todosOsBrinquedos.has(item)) return 'naoExiste';
        unicos.add(item);
      }
      return 'ok';
    };
    //checa se os animais existem no abrigo
    const checaAnimais = (lista) => {
      const unicos = new Set();
      for (const item of lista) {
        if (unicos.has(item)) return 'repetido';
        if (!bichinhos[item]) return 'naoExiste';
        unicos.add(item);
      }
      return 'ok';
    };
    //animal invalido o codigo para aqui
    if (checaValidade(brinquedosP1) !== 'ok' || checaValidade(brinquedosP2) !== 'ok') {
      return { erro: "Brinquedo inválido" };
    }
    if (checaAnimais(ordemDosAnimais) !== 'ok') {
      return { erro: 'Animal inválido' };
    }
    //loop passando por cada animal
    for (const nomeDoBichinho of ordemDosAnimais) {
      if (resultado[nomeDoBichinho]) continue;

      const bichinho = bichinhos[nomeDoBichinho];
      //verificando se a pessoa tem os brinquedos que o animal gosta, na ordem certa.
      //LOCO sendo uma execao
      const podeLevar = (brinquedosPessoa, favoritos, ignoraOrdem = false) => {
        let indiceFavorito = 0;
        for (const brinquedo of brinquedosPessoa) {
          if (ignoraOrdem) {
            if (favoritos.includes(brinquedo)) indiceFavorito++;
          } else {
            if (brinquedo === favoritos[indiceFavorito]) indiceFavorito++;
          }
        }
        return indiceFavorito === favoritos.length;
      };
      //verificando se a a pessoa pode adotar com a regra dos 3 animais e a do loco
      const p1PodeAdotar = (contagemDeAdotados['pessoa 1'] < 3) && podeLevar(
        brinquedosP1,
        bichinho.favoritos,
        nomeDoBichinho === 'LOCO' && (contagemDeAdotados['pessoa 1'] > 0 || contagemDeAdotados['pessoa 2'] > 0)
      );

      const p2PodeAdotar = (contagemDeAdotados['pessoa 2'] < 3) && podeLevar(
        brinquedosP2,
        bichinho.favoritos,
        nomeDoBichinho === 'LOCO' && (contagemDeAdotados['pessoa 1'] > 0 || contagemDeAdotados['pessoa 2'] > 0)
      );
      //se o gato gosta dos mesmos brinquedos de outro
      const verificaGato = (pessoa) => {
        if (bichinho.especie !== 'gato') return true;
        for (const adotadoNome in resultado) {
          const adotado = bichinhos[adotadoNome];
          if (adotado.especie === 'gato' && resultado[adotadoNome].includes(pessoa)) {
            if (bichinho.favoritos.some(b => adotado.favoritos.includes(b))) return false;
          }
        }
        return true;
      };
      //se as duas podem adotar nenhuma leva
      if (p1PodeAdotar && p2PodeAdotar) {
        resultado[nomeDoBichinho] = `${formataNome(nomeDoBichinho)} - abrigo`;
        //se uma pode adotar e a regra do gato esteja sendo obedecida ela leva o bichinho
      } else if (p1PodeAdotar && verificaGato('pessoa 1')) {
        contagemDeAdotados['pessoa 1']++;
        resultado[nomeDoBichinho] = `${formataNome(nomeDoBichinho)} - pessoa 1`;
      } else if (p2PodeAdotar && verificaGato('pessoa 2')) {
        contagemDeAdotados['pessoa 2']++;
        resultado[nomeDoBichinho] = `${formataNome(nomeDoBichinho)} - pessoa 2`;
        //ninguem pode entao o animal vai para o abrigo de volta
      } else {
        resultado[nomeDoBichinho] = `${formataNome(nomeDoBichinho)} - abrigo`;
      }
    }
    //ordenando a lista por nome do animal
    const resultadoOrdenado = Object.keys(resultado)
      .sort()
      .map(key => resultado[key]);

    return { lista: resultadoOrdenado, erro: false };
  }
}

export { AbrigoAnimais as AbrigoAnimais };
