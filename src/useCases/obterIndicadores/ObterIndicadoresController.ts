import { Request, Response } from "express";
import { ObterIndicadoresUseCase } from "./ObterIndicadoresUseCase";

class ObterIndicadoresController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const obterIndicadoresUseCase = new ObterIndicadoresUseCase();

      const indicadores = await obterIndicadoresUseCase.execute();

      return res.json(indicadores);
    } catch (err) {
      return res.status(500).json({
        mensagem: "Erro interno de servidor",
      });
    }
  }
}

export { ObterIndicadoresController };
