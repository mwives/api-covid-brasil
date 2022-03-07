import { Axios } from "axios";

interface IHttpClient {
  create(): Axios;
}

export { IHttpClient };
