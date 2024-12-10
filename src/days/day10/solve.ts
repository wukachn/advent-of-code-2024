import { padMatrix } from '../../util/matrix.ts'

const readAndPreProcessFile = async (): Promise<number[][]> => {
  const puzzleInput = await Bun.file(`${__dirname}/input.txt`).text()

  return padMatrix(
    puzzleInput.split('\n').map((line) => line.split('').map(Number)),
    -1,
    1
  )
}

const findZeroPositions = (map: number[][]): [number, number][] => {
  const positions: [number, number][] = []
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === 0) {
        positions.push([i, j])
      }
    }
  }
  return positions
}

const getNextPositions = (
  map: number[][],
  row: number,
  col: number
): [number, number][] => {
  const currentValue = map[row][col]
  const nextPositions: [number, number][] = []
  if (map[row + 1][col] === currentValue + 1) {
    nextPositions.push([row + 1, col])
  }
  if (map[row - 1][col] === currentValue + 1) {
    nextPositions.push([row - 1, col])
  }
  if (map[row][col + 1] === currentValue + 1) {
    nextPositions.push([row, col + 1])
  }
  if (map[row][col - 1] === currentValue + 1) {
    nextPositions.push([row, col - 1])
  }
  return nextPositions
}

const getAllReachableEndPositions = (
  map: number[][],
  position: [number, number]
): [number, number][] => {
  const row = position[0]
  const col = position[1]
  const currentValue = map[row][col]
  if (currentValue === 9) {
    return [[row, col]]
  }

  const nextPositions = getNextPositions(map, row, col)

  return nextPositions
    .map((pos) => getAllReachableEndPositions(map, pos))
    .flat()
}

const countUniquePaths = (
  map: number[][],
  position: [number, number]
): number => {
  const row = position[0]
  const col = position[1]
  const currentValue = map[row][col]
  if (currentValue === 9) {
    return 1
  }

  const nextPositions = getNextPositions(map, row, col)

  return nextPositions.reduce((acc, pos) => acc + countUniquePaths(map, pos), 0)
}

const solve_ex1 = async () => {
  const map = await readAndPreProcessFile()

  const zeroPositions = findZeroPositions(map)
  const sumOfTrailheadScores = zeroPositions
    .map((position) => getAllReachableEndPositions(map, position))
    .map(
      (endPositions) =>
        new Set(endPositions.map((endPosition) => JSON.stringify(endPosition)))
          .size
    )
    .reduce((acc, val) => acc + val, 0)

  console.log('Ex 1: ' + sumOfTrailheadScores) // 611
}

const solve_ex2 = async () => {
  const map = await readAndPreProcessFile()

  const zeroPositions = findZeroPositions(map)
  const numberOfUniquePaths = zeroPositions.reduce(
    (acc, position) => acc + countUniquePaths(map, position),
    0
  )

  console.log('Ex 2: ' + numberOfUniquePaths) // 1380
}

solve_ex1()
solve_ex2()
