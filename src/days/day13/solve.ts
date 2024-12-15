import * as math from 'mathjs'

interface Machine {
  buttonA: [number, number]
  buttonB: [number, number]
  prize: [number, number]
}

const extractMachine = (input: string, isPart2: boolean): Machine => {
  const REGEX = /\d+/g
  const [aX, aY, bX, bY, prizeXX, prizeXY] = input.match(REGEX)!.map(Number)
  const correction = isPart2 ? 10000000000000 : 0
  return {
    buttonA: [aX, aY],
    buttonB: [bX, bY],
    prize: [prizeXX + correction, prizeXY + correction]
  }
}

const readAndPreProcessFile = async (isPart2: boolean): Promise<Machine[]> => {
  const puzzleInput = await Bun.file(`${__dirname}/input.txt`).text()
  return puzzleInput.split('\n\n').map((line) => extractMachine(line, isPart2))
}

const winPrize = (machine: Machine): [number, number] => {
  const { buttonA, buttonB, prize } = machine

  const coefficients = [
    [buttonA[0], buttonB[0]],
    [buttonA[1], buttonB[1]]
  ]
  const targets = [prize[0], prize[1]]

  const solution = math.lusolve(coefficients, targets) as number[][]
  return [solution[0][0], solution[1][0]]
}

const withinThreshold = (value: number): boolean => {
  return Math.abs(Math.round(value) - value) < 0.0001
}

const winPrizes = (machines: Machine[], isPart2: boolean): number => {
  return machines.reduce((acc, machine) => {
    const [pressesA, pressesB] = winPrize(machine)
    if (!withinThreshold(pressesA) || !withinThreshold(pressesB)) return acc
    if (!isPart2 && (pressesA > 100 || pressesB > 100)) return acc
    return acc + pressesA * 3 + pressesB
  }, 0)
}

const solve_ex1 = async () => {
  let machines = await readAndPreProcessFile(false)

  let tokens = winPrizes(machines, false)

  console.log('Ex 1: ' + tokens) // 29187
}

const solve_ex2 = async () => {
  let machines = await readAndPreProcessFile(true)

  let tokens = winPrizes(machines, true)

  console.log('Ex 2: ' + tokens) // 99968222587852
}

solve_ex1()
solve_ex2()
