import fs from "node:fs";
import { parse } from "csv-parse";

const csvPath = new URL("../tasks.csv", import.meta.url);

const stream = fs.createReadStream(csvPath);

const parser = stream.pipe(parse({ from_line: 2 }));

let count = 0;

for await (let record of parser) {
  process.stdout.write(`${count++} ${record.join(",")}\n`);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  let title = record[0];
  let description = record[1];

  const resultado = await go(title, description);
  if (resultado.status == 201) {
    console.log("Cadastrado com sucesso");
  } else {
    console.log("Erro no cadastro");
  }
}

async function go(title, description) {
  return await fetch("http://localhost:3344/tasks", {
    method: "POST",
    duplex: "half",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
    }),
  });
}
