import { Router } from "express";
import { ObterIndicadoresController } from "../../../../useCases/obterIndicadores/ObterIndicadoresController";

const router = Router();

const obterIndicadoresController = new ObterIndicadoresController();

router.get("/indicadores", obterIndicadoresController.handle);

export { router };
