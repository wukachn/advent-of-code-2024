const MAX_ROW = 103
const MAX_COL = 101

const readAndPreProcessFile = async (): Promise<
  [[number, number][], [number, number][]]
> => {
  const puzzleInput = await Bun.file(`${__dirname}/input.txt`).text()

  const lines = puzzleInput
    .split('\n')
    .map((line) => line.replace('p=', '').split(' v='))
  const robots = lines.map(
    (line) => line[0].split(',').map(Number) as [number, number]
  )
  const velocities = lines.map(
    (line) => line[1].split(',').map(Number) as [number, number]
  )

  return [robots, velocities]
}

const getNextPosition = (
  robot: [number, number],
  velocity: [number, number]
): [number, number] => {
  let nextCol = robot[0] + velocity[0]
  let nextRow = robot[1] + velocity[1]

  if (nextCol < 0) {
    nextCol = MAX_COL + nextCol
  } else if (nextCol >= MAX_COL) {
    nextCol = nextCol - MAX_COL
  }

  if (nextRow < 0) {
    nextRow = MAX_ROW + nextRow
  } else if (nextRow >= MAX_ROW) {
    nextRow = nextRow - MAX_ROW
  }

  return [nextCol, nextRow]
}

const safetyScore = (robots: [number, number][]): number => {
  const colMidpoint = Math.floor(MAX_COL / 2)
  const rowMidpoint = Math.floor(MAX_ROW / 2)

  const q1 = robots.filter(
    ([col, row]) => col < colMidpoint && row < rowMidpoint
  ).length
  const q2 = robots.filter(
    ([col, row]) => col < colMidpoint && row > rowMidpoint
  ).length
  const q3 = robots.filter(
    ([col, row]) => col > colMidpoint && row < rowMidpoint
  ).length
  const q4 = robots.filter(
    ([col, row]) => col > colMidpoint && row > rowMidpoint
  ).length

  return q1 * q2 * q3 * q4
}

const solve_ex1 = async () => {
  let [robots, velocities] = await readAndPreProcessFile()

  for (let i = 0; i < 100; i++) {
    for (let r = 0; r < robots.length; r++) {
      robots[r] = getNextPosition(robots[r], velocities[r])
    }
  }

  const result = safetyScore(robots)

  console.log('Ex 1: ' + result) // 222208000
}

const render = (robots: [number, number][]) => {
  const grid = Array.from({ length: MAX_ROW }, () =>
    Array.from({ length: MAX_COL }, () => '.')
  )

  robots.forEach(([col, row]) => {
    grid[row][col] = '#'
  })
  console.log(grid.map((row) => row.join('')).join('\n'))
}

const solve_ex2 = async () => {
  let [robots, velocities] = await readAndPreProcessFile()

  const SECONDS_UNTIL_TREE = 7623
  for (let i = 0; i < SECONDS_UNTIL_TREE; i++) {
    for (let r = 0; r < robots.length; r++) {
      robots[r] = getNextPosition(robots[r], velocities[r])
    }
  }

  console.log('Ex 2: ' + SECONDS_UNTIL_TREE) // 7623
  console.log('Behold, Christmas Tree:')
  render(robots)
}

solve_ex1()
solve_ex2()
