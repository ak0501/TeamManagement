// jshint esversion:6
const express = require("express");
const port = process.env.PORT || 3030;
const app = express();

//
// ─── PARSE BODY AS ASJON ────────────────────────────────────────────────────────
//

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(expres.json());






































// ======================Listening Ports=======================================

app.listen(port, () => console.log(`listening on port ${port}...`));