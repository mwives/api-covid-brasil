import { inject, injectable } from "tsyringe";

import { IHttpClient } from "../../shared/container/providers/httpClient/IHttpClient";
import { HTTP_CLIENT_PROVIDER } from "../../shared/container/providers/injectionTokens";
import { AppError } from "../../shared/errors/AppError";

interface IInfoEstado {
  confirmed: number;
  deaths: number;
  updated: Date;
}

/**
 * Se Futuramente a API for pegar dados de outros países,
 * esta parte de interfaces precisa ser melhorada para reutilização.
 */
interface IInfoPais {
  All: {
    confirmed: number;
    deaths: number;
    country: string;
    population: number;
    life_expectancy: string;
  };
  Acre: IInfoEstado;
  Alagoas: IInfoEstado;
  Amapa: IInfoEstado;
  Amazonas: IInfoEstado;
  Bahia: IInfoEstado;
  Ceara: IInfoEstado;
  "Distrito Federal": IInfoEstado;
  "Espirito Santo": IInfoEstado;
  Maranhao: IInfoEstado;
  "Mato Grosso": IInfoEstado;
  "Mato Grosso do Sul": IInfoEstado;
  "Minas Gerais": IInfoEstado;
  Para: IInfoEstado;
  Paraiba: IInfoEstado;
  Parana: IInfoEstado;
  Pernambuco: IInfoEstado;
  Piaui: IInfoEstado;
  "Rio Grande do Norte": IInfoEstado;
  "Rio Grande do Sul": IInfoEstado;
  "Rio de Janeiro": IInfoEstado;
  Rondonia: IInfoEstado;
  Roraima: IInfoEstado;
  "Santa Catarina": IInfoEstado;
  "Sao Paulo": IInfoEstado;
  Sergipe: IInfoEstado;
  Tocantins: IInfoEstado;
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
  [key: string]: IInfoEstado;
}

@injectable()
class ObterIndicadoresUseCase {
  private httpClient;

  constructor(
    @inject(HTTP_CLIENT_PROVIDER)
    private httpClientFactory: IHttpClient
  ) {
    //! Não tenho certeza se é assim que se usam factories
    this.httpClient = this.httpClientFactory.create();
  }

  async execute(): Promise<IDadosFormatados> {
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
      this.httpClient.get<IInfoPais>(
        "https://covid-api.mmediagroup.fr/v1/cases?country=Brazil"
      ),
      this.httpClient.get<IInfoVacinacaoPais>(
        "https://covid-api.mmediagroup.fr/v1/vaccines?country=Brazil"
      ),
    ]).catch(() => {
      throw new AppError("Não foi possível se conectar com API externa.", 500);
    });
    // console.timeEnd("Promise.all");

    /* eslint-disable @typescript-eslint/naming-convention */
    const { country, life_expectancy, confirmed, population, deaths } =
      infoPais;

    const { administered, people_vaccinated, people_partially_vaccinated } =
      infoVacinacaoPais;
    /* eslint-enable @typescript-eslint/naming-convention */

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

      const dadosEstadoFormatados = {
        nome,
        confirmados,
        obitos,
        ultima_atualizacao,
      };

      dadosFormatados.estados.push(dadosEstadoFormatados);
    }

    return dadosFormatados;
  }
}

export { ObterIndicadoresUseCase };
