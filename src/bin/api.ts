import { build } from "../app";

const app = build();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App is listening on port ${port} http://localhost:${port}`);
});
