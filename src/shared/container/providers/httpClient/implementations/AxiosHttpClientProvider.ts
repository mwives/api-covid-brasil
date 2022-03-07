import axios, { Axios } from "axios";

import { IHttpClient } from "../IHttpClient";

class AxiosHttpClientProvider implements IHttpClient {
  create(): Axios {
    return axios.create();
  }
}

export { AxiosHttpClientProvider };
