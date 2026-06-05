import app, { loadReferences } from "./app";

const PORT = Number(process.env.PORT) || 5000;

const start = async () => {
  await loadReferences();
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

start();
