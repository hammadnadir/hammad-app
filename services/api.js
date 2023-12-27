const data = [];


export function findProductByCode(code) {
  return data.find((product) => product.code === code);
}
