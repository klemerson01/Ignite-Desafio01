import http from "node:http";

const tasks = [];

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  console.log(method, url);

  if (method === "GET" && url === "/task") {
    return res
      .setHeader("Content-type", "application/json")
      .end(JSON.stringify(tasks));
  }

  if (method === "POST" && url === "/task") {
    tasks.push({
      id: 1,
      title: "Espera de um milagre",
      description: "Filme dramatico, com personagem principal John",
    });
    return res.end("Criação de task");
  }

  return res.end("Hello Word !");
});

server.listen(3344);
