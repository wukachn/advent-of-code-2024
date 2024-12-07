const readAndPreProcessFile = async (): Promise<Equation[]> => {
  const puzzleInput = await Bun.file(`${__dirname}/input.txt`).text()

  return puzzleInput
    .split('\n')
    .map((line) => line.split(' ').map((part) => part.replace(':', '')))
    .map((parts) => {
      return {
        testValue: Number(parts[0]),
        parts: parts.splice(1).map((part) => Number(part))
      }
    })
}

interface Equation {
  testValue: number
  parts: number[]
}

const isSolvable = (
  testValue: number,
  currentValue: number,
  parts: number[],
  useConcatOp = false
): boolean => {
  if (parts.length === 0) {
    return testValue === currentValue
  }

  if (
    isSolvable(testValue, currentValue + parts[0], parts.slice(1), useConcatOp)
  ) {
    return true
  }

  if (
    isSolvable(testValue, currentValue * parts[0], parts.slice(1), useConcatOp)
  ) {
    return true
  }

  return (
    useConcatOp &&
    isSolvable(
      testValue,
      Number(String(currentValue) + String(parts[0])),
      parts.slice(1),
      useConcatOp
    )
  )
}

const solve_ex1 = async () => {
  const equations = await readAndPreProcessFile()
  const result = equations
    .filter((equation) => isSolvable(equation.testValue, 0, equation.parts))
    .reduce((acc, equation) => acc + equation.testValue, 0)

  console.log('Ex 1: ' + result) // 20281182715321
}

const solve_ex2 = async () => {
  const equations = await readAndPreProcessFile()
  const result = equations
    .filter((equation) =>
      isSolvable(equation.testValue, 0, equation.parts, true)
    )
    .reduce((acc, equation) => acc + equation.testValue, 0)

  console.log('Ex 2: ' + result) // 159490400628354
}

solve_ex1()
solve_ex2()
