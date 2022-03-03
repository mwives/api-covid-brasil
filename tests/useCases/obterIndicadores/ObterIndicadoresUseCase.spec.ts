import { ObterIndicadoresUseCase } from "../../../src/useCases/obterIndicadores/ObterIndicadoresUseCase";

const obterIndicadoresUseCase = new ObterIndicadoresUseCase();

describe("Obter indicadores", () => {
  it("pais deve conter propriedades obrigatórias com seus respectivos tipos", async () => {
    const { pais } = await obterIndicadoresUseCase.execute();

    expect(typeof pais.nome).toBe("string");
    expect(typeof pais.expectativa_vida).toBe("number");
    expect(typeof pais.total_casos_confirmados).toBe("number");
    expect(typeof pais.numero_populacao).toBe("number");
    expect(typeof pais.total_casos_confirmados).toBe("number");
    expect(typeof pais.total_obitos).toBe("number");
    expect(typeof pais.total_doses_aplicadas).toBe("number");
    expect(typeof pais.pessoas_vacinadas).toBe("number");
    expect(typeof pais.pessoas_parcialmente_vacinadas).toBe("number");
  });

  it("deve conter 27 estados", async () => {
    const indicadores = await obterIndicadoresUseCase.execute();

    expect(indicadores.estados).toHaveLength(27);
  });

  it("estado deve conter propriedades obrigatórias com seus respectivos tipos", async () => {
    const { estados } = await obterIndicadoresUseCase.execute();

    expect(typeof estados[0].nome).toBe("string");
    expect(typeof estados[0].confirmados).toBe("number");
    expect(typeof estados[0].obitos).toBe("number");
    expect(typeof estados[0].ultima_atualizacao).toBe("string");
  });

  it("propriedade 'ultima_atualizacao' deve respeitar formato 'DD/MM/YYYY HH:MM:SS", async () => {
    const { estados } = await obterIndicadoresUseCase.execute();

    //* Regex feita na esperança da pandemia acabar até 2029 🙏
    estados.forEach((estado, index) => {
      expect(estados[index].ultima_atualizacao).toMatch(
        /^(([012][0-9]|3[01])\/(0[1-9]|1[012])\/(2019|202[0-9])) (([01][0-9]|2[123]):[0-5][0-9]:[0-5][0-9])$/
      );
    });
  });
});
