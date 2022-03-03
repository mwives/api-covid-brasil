# Api Covid Brasil

Api para consulta a respeito de dados da COVID-19 no Brasil e em seus respectivos estados.

## Rotas

| Método | Endpoint     | Descrição                              |
| ------ | ------------ | -------------------------------------- |
| `GET`  | /indicadores | Retorna os dados da COVID-19 no Brasil |

---

## Rodando a aplicação localmente

```
$ git clone https://github.com/mwives/api-covid-brasil.git
$ yarn install
$ yarn start:dev
```

Ou com npm:

```
$ git clone https://github.com/mwives/api-covid-brasil.git
$ npm install
$ npm run start:dev
```

A aplicação já deve estar rodando em http://localhost:3333.

#

### Rodando os testes

```
// Saída enxuta
$ yarn test
// Saída detalhada
$ yarn test:verbose
```

Ou com npm:

```
// Saída enxuta
$ npm run test
// Saída detalhada
$ npm run test:verbose
```
