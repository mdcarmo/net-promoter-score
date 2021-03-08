import { app } from './app';

// import express, { response } from 'express';
// import { router } from './routes';

// const app = express();

// app.use(express.json());
// app.use(router);

/**
 * GET ==> Buscar
 * POST => Salvar
 * PUT => Alterar
 * DELETE => Deletar
 * PATCH => Alteração especifica
 */

//  app.get("/", (request,response) => {
//      return response.json({message: "Hello word"});
//  });

//  app.post("/", (request,response)=> {
//      //Recebeu dados para salvar
//      return response.json({message: "Os dados foram salvos com sucesso!"});
//  });
 
app.listen(3334,()=> console.log("Server is running!"));