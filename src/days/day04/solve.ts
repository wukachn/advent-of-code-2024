import { padMatrix } from '../../util/matrix'

const readAndPreProcessFile = async (
  paddingLayers: number
): Promise<string[][]> => {
  const puzzleInput = await Bun.file(`${__dirname}/input.txt`).text()

  var paddedInput = padMatrix(
    puzzleInput.split('\n').map((line) => line.split('')),
    '.',
    paddingLayers
  )

  return paddedInput
}

const countXmasAt = (grid: string[][], i: number, j: number): number => {
  let total = 0
  if (grid[i][j] === 'X') {
    if (
      grid[i - 1][j] === 'M' &&
      grid[i - 2][j] === 'A' &&
      grid[i - 3][j] === 'S'
    ) {
      total++
    }

    if (
      grid[i + 1][j] === 'M' &&
      grid[i + 2][j] === 'A' &&
      grid[i + 3][j] === 'S'
    ) {
      total++
    }

    if (
      grid[i][j - 1] === 'M' &&
      grid[i][j - 2] === 'A' &&
      grid[i][j - 3] === 'S'
    ) {
      total++
    }

    if (
      grid[i][j + 1] === 'M' &&
      grid[i][j + 2] === 'A' &&
      grid[i][j + 3] === 'S'
    ) {
      total++
    }

    if (
      grid[i - 1][j - 1] === 'M' &&
      grid[i - 2][j - 2] === 'A' &&
      grid[i - 3][j - 3] === 'S'
    ) {
      total++
    }

    if (
      grid[i - 1][j + 1] === 'M' &&
      grid[i - 2][j + 2] === 'A' &&
      grid[i - 3][j + 3] === 'S'
    ) {
      total++
    }

    if (
      grid[i + 1][j + 1] === 'M' &&
      grid[i + 2][j + 2] === 'A' &&
      grid[i + 3][j + 3] === 'S'
    ) {
      total++
    }

    if (
      grid[i + 1][j - 1] === 'M' &&
      grid[i + 2][j - 2] === 'A' &&
      grid[i + 3][j - 3] === 'S'
    ) {
      total++
    }
  }
  return total
}

const isCrossSectionOfXmas = (
  grid: string[][],
  i: number,
  j: number
): boolean => {
  if (
    grid[i][j] === 'A' &&
    ((grid[i - 1][j - 1] === 'M' && grid[i + 1][j + 1] === 'S') ||
      (grid[i - 1][j - 1] === 'S' && grid[i + 1][j + 1] === 'M')) &&
    ((grid[i - 1][j + 1] === 'M' && grid[i + 1][j - 1] === 'S') ||
      (grid[i - 1][j + 1] === 'S' && grid[i + 1][j - 1] === 'M'))
  ) {
    return true
  }
  return false
}

const solve_ex1 = async () => {
  const PADDING = 3
  const grid = await readAndPreProcessFile(PADDING)

  let total = 0
  for (let i = PADDING; i < grid.length - PADDING; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      total += countXmasAt(grid, i, j)
    }
  }

  console.log('Ex 1: ' + total) // 2504
}

const solve_ex2 = async () => {
  const PADDING = 1
  const grid = await readAndPreProcessFile(PADDING)

  let total = 0
  for (let i = 1; i < grid.length - 1; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (isCrossSectionOfXmas(grid, i, j)) {
        total++
      }
    }
  }

  console.log('Ex 2: ' + total) // 1923
}

solve_ex1()
solve_ex2()
