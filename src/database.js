import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);
// console.log(databasePath)

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
    // convertendo o bd em json, para salvar no writeFile
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase().trim());
        });
      });
    }

    return data;
  }

  insert(table, data) {
    // se existe um array no database
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  update(table, id, data) {
    const rowIndex = this.find(table, id);

    if (rowIndex > -1) {
      let { title, description, updated_at, ...other } =
        this.#database[table][rowIndex];
      data.title = data.title == undefined ? title : data.title;
      data.description =
        data.description == undefined ? description : data.description;
      this.#database[table][rowIndex] = {
        id,
        ...data,
        ...other,
        updated_at: new Date().toLocaleDateString(),
      };
      this.#persist();
    }
  }

  delete(table, id) {
    const rowIndex = this.find(table, id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    } else {
      return;
    }
  }

  complete(table, id) {
    const rowIndex = this.find(table, id);
    let { completed_at, ...resto } = this.#database[table][rowIndex];
    if (completed_at == null) {
      this.#database[table][rowIndex] = {
        ...resto,
        completed_at: new Date().toLocaleDateString(),
      };
    } else {
      this.#database[table][rowIndex] = {
        ...resto,
        completed_at: null,
      };
    }
    this.#persist();
  }

  find(table, id) {
    return this.#database[table].findIndex((row) => row.id === id);
  }
}
