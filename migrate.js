import client from "./src/Database/Index.js";
import kleur from "kleur";

import { readFile } from "fs/promises";

const query = await readFile("./code-migration.sql", "utf-8");

await client.connect();
await client.query(query);
await client.end();

console.log(kleur.bgGreen("MIGRATE SUCCESSFUL"));
