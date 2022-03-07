import { Request, Response } from "express";
import { ObterIndicadoresUseCase } from "./ObterIndicadoresUseCase";

class ObterIndicadoresController {
  async handle(req: Request, res: Response): Promise<Response> {
    const obterIndicadoresUseCase = new ObterIndicadoresUseCase();

    const indicadores = await obterIndicadoresUseCase.execute();

    return res.json(indicadores);
  }
}

export { ObterIndicadoresController };
