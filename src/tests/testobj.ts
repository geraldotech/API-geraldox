
interface Register {
  name: string
  age: number
}

function register(data: Register): void{
  console.log(data.name, data.age)
}

register({name: 'Geraldo', age: 2})

console.log(`oi`)

interface erros {
  age: number
}

function handler(error: erros){
  if(error.age == 2){
    console.log(`two`)
  }
}
interface acertos {
  age: number
}

function handler2(certo: acertos){
  if(certo.age == 2){
    console.log(`two`)
  }
}