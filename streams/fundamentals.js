// process.stdin.pipe(process.stdout);

import { Readable, Writable, Transform } from "node:stream";

class oneToHundredStream extends Readable {
  index = 1;
  //metodo obrigatorio para a readable
  _read() {
    const i = this.index++;

    setTimeout(() => {
      if (i > 20) {
        this.push(null);
      } else {
        const buf = Buffer.from(String(i));
        this.push(buf);
      }
    }, 500);
  }
}

class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1;

    callback(null, Buffer.from(String(transformed)));
  }
}

class MultiplyByTenStream extends Writable {
  //metodo obrigatorio para a writable
  _write(chunk, encoding, callback) {
    console.log(Number(chunk.toString()) * 10);
    callback();
  }
}

new oneToHundredStream()
  .pipe(new InverseNumberStream())
  .pipe(new MultiplyByTenStream());
