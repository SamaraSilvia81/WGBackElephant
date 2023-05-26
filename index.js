import "dotenv/config";
import cors from "cors";
import express from "express";
import sequelize from './database/connection';

const app = express();

// Configurações do servidor
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Importe as rotas
import userRoutes from './routes/userRoutes';
import characterRoutes from './routes/characterRoutes';
import listRoutes from './routes/listRoutes';

// Defina as rotas
app.use('/user', userRoutes);
app.use('/character', characterRoutes);
app.use('/list', listRoutes);

// Rota inicial
app.get('/', (req, res) => {
  res.json({ message: 'Hello Express!!' });
});

// Configuração do banco de dados e inicialização do servidor
const port = process.env.PORT || 3000;
const eraseDatabaseOnSync = process.env.ERASE_DATABASE_ON_SYNC === "true";

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    await createUsersWithMessages();
  }

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});