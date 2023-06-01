import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-routes-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        "tasks",
        search
          ? {
              title: search.replace(/%20/g, " "),
              description: search.replace(/%20/g, " "),
              //substituindo %20 por espaço, para o search aceitar espaço
            }
          : null
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      if (req.body != null) {
        const { title, description } = req.body;
        if (title && description) {
          const task = {
            id: randomUUID(),
            title,
            description,
            created_at: new Date().toLocaleDateString(),
            updated_at: null,
            completed_at: null,
          };

          database.insert("tasks", task);
          //definindo nome da tabela e inserindo dados nela

          return res.writeHead(201).end();
        } else {
          return res
            .writeHead(401)
            .end(JSON.stringify("Obrigatorio preencher title e description"));
        }
      } else {
        return res.writeHead(401).end(JSON.stringify("Envie os dados da task"));
      }
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      if (req.body != null) {
        const { title, description } = req.body;
        const rowIndex = database.find("tasks", id);

        if (rowIndex > -1) {
          database.update("tasks", id, {
            title,
            description,
          });

          res.writeHead(204).end();
        } else {
          res.writeHead(404).end(JSON.stringify("Registro inexiste"));
        }
      } else {
        res
          .writeHead(401)
          .end(JSON.stringify("Obrigatorio preencher title e/ou description"));
      }
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const rowIndex = database.find("tasks", id);

      if (rowIndex > -1) {
        // Deleta a tarefa
        database.delete("tasks", id);
        res.writeHead(204).end();
      } else {
        // Retorna a requisição com uma mensagem de erro
        res.writeHead(404).end(JSON.stringify("Registro inexiste"));
      }
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;
      const rowIndex = database.find("tasks", id);

      if (rowIndex > -1) {
        database.complete("tasks", id);
        res.writeHead(204).end();
      } else {
        res.writeHead(404).end(JSON.stringify("Registro inexiste"));
      }
    },
  },
];
