import { Readable } from "node:stream";

class oneToHundredStream extends Readable {
  index = 1;
  //metodo obrigatorio para a readable
  _read() {
    const i = this.index++;

    setTimeout(() => {
      if (i > 5) {
        this.push(null);
      } else {
        const buf = Buffer.from(String(i));
        this.push(buf);
      }
    }, 500);
  }
}

fetch("http://localhost:3334", {
  method: "POST",
  body: new oneToHundredStream(),
  duplex: "half",
})
  .then((response) => {
    return response.text();
  })
  .then((data) => {
    console.log(data);
  });
