import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { typeDefs } from "../src/graphql/typeDefs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.resolve(__dirname, "..", "schema.graphql");

writeFileSync(schemaPath, typeDefs.trim() + "\n");
console.log(`GraphQL schema written to ${schemaPath}`);
