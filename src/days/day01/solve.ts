import { transpose } from '../../util/matrix'

const readAndPreProcessFile = async (): Promise<[number[], number[]]> => {
  const puzzleInput = await Bun.file(`${__dirname}/input.txt`).text()

  const [list1, list2] = transpose(
    puzzleInput.split('\n').map((list) => list.split('   '))
  )

  return [list1, list2]
}

const solve_ex1 = async () => {
  const [list1, list2] = await readAndPreProcessFile()

  list1.sort()
  list2.sort()

  let distance = 0
  for (let i = 0; i < list1.length; i++) {
    distance += Math.abs(list1[i] - list2[i])
  }

  console.log('Ex 1: ' + distance) // 2164381
}

const solve_ex2 = async () => {
  const [list1, list2] = await readAndPreProcessFile()

  const similarity = list1
    .map((value) => value * list2.filter((b) => b === value).length)
    .reduce((acc, value) => acc + value, 0)

  console.log('Ex 2: ' + similarity) // 20719933
}

solve_ex1()
solve_ex2()
