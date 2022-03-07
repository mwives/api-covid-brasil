import { Request, Response } from "express";
import { container } from "tsyringe";

import { ObterIndicadoresUseCase } from "./ObterIndicadoresUseCase";

class ObterIndicadoresController {
  async handle(req: Request, res: Response): Promise<Response> {
    const obterIndicadoresUseCase = container.resolve(ObterIndicadoresUseCase);

    const indicadores = await obterIndicadoresUseCase.execute();

    return res.json(indicadores);
  }
}

export { ObterIndicadoresController };
