import { container } from "tsyringe";

import { HTTP_CLIENT_PROVIDER } from "../injectionTokens";
import { IHttpClient } from "./IHttpClient";
import { AxiosHttpClientProvider } from "./implementations/AxiosHttpClientProvider";

container.registerSingleton<IHttpClient>(
  HTTP_CLIENT_PROVIDER,
  AxiosHttpClientProvider
);
