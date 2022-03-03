import { httpClient } from "../../shared/infra/http/client/axiosHttpClient";

interface IEstado {
  confirmed: number;
  deaths: number;
  updated: Date;
}

interface IInfoPais {
  All: {
    confirmed: number;
    deaths: number;
    country: string;
    population: number;
    life_expectancy: string;
  };
  Acre: IEstado;
  Alagoas: IEstado;
  Amapa: IEstado;
  Amazonas: IEstado;
  Bahia: IEstado;
  Ceara: IEstado;
  "Distrito Federal": IEstado;
  "Espirito Santo": IEstado;
  Maranhao: IEstado;
  "Mato Grosso": IEstado;
  "Mato Grosso do Sul": IEstado;
  "Minas Gerais": IEstado;
  Para: IEstado;
  Paraiba: IEstado;
  Parana: IEstado;
  Pernambuco: IEstado;
  Piaui: IEstado;
  "Rio Grande do Norte": IEstado;
  "Rio Grande do Sul": IEstado;
  "Rio de Janeiro": IEstado;
  Rondonia: IEstado;
  Roraima: IEstado;
  "Santa Catarina": IEstado;
  "Sao Paulo": IEstado;
  Sergipe: IEstado;
  Tocantins: IEstado;
}

interface IInfoVacinacaoPais {
  All: {
    administered: number;
    people_vaccinated: number;
    people_partially_vaccinated: number;
  };
}

interface IDadosFormatados {
  pais: {
    nome: string;
    expectativa_vida: number;
    total_casos_confirmados: number;
    numero_populacao: number;
    total_obitos: number;
    total_doses_aplicadas: number;
    pessoas_vacinadas: number;
    pessoas_parcialmente_vacinadas: number;
  };
  estados: Array<{
    nome: string;
    confirmados: number;
    obitos: number;
    ultima_atualizacao: string;
  }>;
}

interface IMap {
  [key: string]: IEstado;
}

class ObterIndicadoresUseCase {
  async execute() {
    /*
      console.time("double await");
      //* Média de 1.6 segundos
      const {
        data: { All: infoPais, ...estados },
      } = await httpClient.get<IInfoPais>(
        "https://covid-api.mmediagroup.fr/v1/cases?country=Brazil"
      );

      const {
        data: { All: countryVaccinationInfo },
      } = await httpClient.get<IInfoVacinacaoPais>(
        "https://covid-api.mmediagroup.fr/v1/vaccines?country=Brazil"
      );
      console.timeEnd("double await");
    */

    //* Promise.all é em média 2x mais rápido que 2 awaits
    // console.time("Promise.all");
    //* Média de 0.8 segundos
    const [
      {
        data: { All: infoPais, ...estados },
      },
      {
        data: { All: infoVacinacaoPais },
      },
    ] = await Promise.all([
      httpClient.get<IInfoPais>(
        "https://covid-api.mmediagroup.fr/v1/cases?country=Brazil"
      ),
      httpClient.get<IInfoVacinacaoPais>(
        "https://covid-api.mmediagroup.fr/v1/vaccines?country=Brazil"
      ),
    ]);
    // console.timeEnd("Promise.all");

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { country, life_expectancy, confirmed, population, deaths } =
      infoPais;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { administered, people_vaccinated, people_partially_vaccinated } =
      infoVacinacaoPais;

    const dadosFormatados: IDadosFormatados = {
      pais: {
        nome: country,
        expectativa_vida: Number(life_expectancy),
        total_casos_confirmados: confirmed,
        numero_populacao: population,
        total_obitos: deaths,
        total_doses_aplicadas: administered,
        pessoas_vacinadas: people_vaccinated,
        pessoas_parcialmente_vacinadas: people_partially_vaccinated,
      },
      estados: [],
    };

    //* Formata os dados para cada estado
    for (const estado in estados) {
      const nome = estado;
      const confirmados = (estados as unknown as IMap)[estado].confirmed;
      const obitos = (estados as unknown as IMap)[estado].deaths;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const ultima_atualizacao = new Date(
        (estados as unknown as IMap)[estado].updated
      ).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      dadosFormatados.estados.push({
        nome,
        confirmados,
        obitos,
        ultima_atualizacao,
      });
    }

    return dadosFormatados;
  }
}

export { ObterIndicadoresUseCase };
