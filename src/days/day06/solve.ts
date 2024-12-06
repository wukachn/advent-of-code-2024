import { padMatrix } from '../../util/matrix'

const readAndPreProcessFile = async (): Promise<string[][]> => {
  const puzzleInput = await Bun.file(`${__dirname}/input.txt`).text()

  return padMatrix(
    puzzleInput.split('\n').map((line) => line.split('')),
    '0',
    1
  )
}

enum Direction {
  UP = '^',
  RIGHT = '>',
  DOWN = 'v',
  LEFT = '<'
}

interface Step {
  row: number
  col: number
  direction: Direction
}

const getIntialStep = (map: string[][]): Step => {
  let row = map.findIndex((line) =>
    line.some((cell) => Object.values(Direction).includes(cell as Direction))
  )
  let col = map[row].findIndex((cell) =>
    Object.values(Direction).includes(cell as Direction)
  )

  let direction = map[row][col] as Direction
  return { row, col, direction }
}

const stepForward = (step: Step): Step => {
  switch (step.direction) {
    case Direction.UP:
      return { row: step.row - 1, col: step.col, direction: step.direction }
    case Direction.RIGHT:
      return { row: step.row, col: step.col + 1, direction: step.direction }
    case Direction.DOWN:
      return { row: step.row + 1, col: step.col, direction: step.direction }
    case Direction.LEFT:
      return { row: step.row, col: step.col - 1, direction: step.direction }
  }
}

const rotateClockwise90 = (direction: Direction): Direction => {
  switch (direction) {
    case Direction.UP:
      return Direction.RIGHT
    case Direction.RIGHT:
      return Direction.DOWN
    case Direction.DOWN:
      return Direction.LEFT
    case Direction.LEFT:
      return Direction.UP
  }
}

const getNextStep = (map: string[][], step: Step): Step => {
  let nextStep = stepForward(step)
  while (map[nextStep.row][nextStep.col] === '#') {
    nextStep = stepForward({
      ...step,
      direction: rotateClockwise90(nextStep.direction)
    })
  }
  return nextStep
}

const walk = (map: string[][], step: Step): Step[] => {
  if (map[step.row][step.col] === '0') {
    return []
  }
  return [step, ...walk(map, getNextStep(map, step))]
}

const isLooping = (map: string[][], step: Step): boolean => {
  const steps = [step]
  let currentStep = getNextStep(map, step)
  while (true) {
    if (map[currentStep.row][currentStep.col] === '0') {
      return false
    }

    if (
      steps.some(
        (s) =>
          s.row === currentStep.row &&
          s.col === currentStep.col &&
          s.direction === currentStep.direction
      )
    ) {
      return true
    }

    steps.push(currentStep)
    currentStep = getNextStep(map, currentStep)
  }
}

const solve_ex1 = (map: string[][], initialStep: Step) => {
  const steps = walk(map, initialStep)

  const uniqueSteps = new Set<String>(
    steps.map((step) => JSON.stringify([step.row, step.col]))
  )
  console.log('Ex 1: ' + uniqueSteps.size) // 5331

  // Unique coords traversed
  return [...uniqueSteps].map((step) => JSON.parse(String(step)))
}

const solve_ex2 = (
  map: string[][],
  initialStep: Step,
  possibleBlockerPositions: number[][]
) => {
  let total = 0
  for (let [row, col] of possibleBlockerPositions) {
    const originalValue = map[row][col]
    map[row][col] = '#'

    if (isLooping(map, initialStep)) {
      total++
    }

    map[row][col] = originalValue
  }
  console.log('Ex 2: ' + total) // 1812
}

const solve = async () => {
  const map = await readAndPreProcessFile()
  const intialStep = getIntialStep(map)

  const possibleBlockerPositions: number[][] = solve_ex1(map, intialStep)
  solve_ex2(map, intialStep, possibleBlockerPositions)
}

solve()
