"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
const app = (0, app_1.build)();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is listening on port ${port} http://localhost:${port}`);
});
