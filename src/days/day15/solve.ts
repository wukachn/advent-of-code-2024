enum Direction {
  UP = '^',
  RIGHT = '>',
  DOWN = 'v',
  LEFT = '<'
}

const getDiff = (direction: Direction): [number, number] => {
  switch (direction) {
    case Direction.UP:
      return [-1, 0]
    case Direction.RIGHT:
      return [0, 1]
    case Direction.DOWN:
      return [1, 0]
    case Direction.LEFT:
      return [0, -1]
  }
}

const readAndPreProcessFile = async (
  isPart2 = false
): Promise<[string[][], Direction[]]> => {
  const puzzleInput = await Bun.file(`${__dirname}/input.txt`).text()

  const [rawMap, rawIntructions] = puzzleInput.split('\n\n')

  let map = rawMap.split('\n').map((line) => line.split(''))
  if (isPart2) {
    map = map.map((row) =>
      row.flatMap((cell) => {
        if (cell === '@') return ['@', '.']
        if (cell === '#') return ['#', '#']
        if (cell === 'O') return ['[', ']']
        return [cell, cell]
      })
    )
  }

  const instructions = rawIntructions
    .split('\n')
    .map((line) => line.split('') as Direction[])
    .flat()

  return [map, instructions]
}

const getInitialPosition = (map: string[][]): [number, number] => {
  let row = map.findIndex((line) => line.includes('@'))
  let col = map[row].findIndex((cell) => cell === '@')
  return [row, col]
}

const canPush = (
  map: string[][],
  pos: [number, number],
  direction: Direction,
  isPart2: boolean
): boolean => {
  const [dx, dy] = getDiff(direction)
  const [newX, newY] = [pos[0] + dx, pos[1] + dy]
  const current = map[newX][newY]

  if (current === '#') {
    return false
  }

  if (!isPart2 && current === 'O') {
    return canPush(map, [newX, newY], direction, isPart2)
  }

  if (current === '[' || current === ']') {
    if (direction === Direction.UP || direction === Direction.DOWN) {
      const offset = current === '[' ? 1 : -1
      return (
        canPush(map, [newX, newY], direction, isPart2) &&
        canPush(map, [newX, newY + offset], direction, isPart2)
      )
    }

    return canPush(map, [newX, newY], direction, isPart2)
  }

  return true
}

const doPush = (
  map: string[][],
  pos: [number, number],
  direction: Direction,
  isPart2: boolean
): [string[][], [number, number]] => {
  const [dx, dy] = getDiff(direction)
  const [newX, newY] = [pos[0] + dx, pos[1] + dy]
  let current = map[newX][newY]

  if (!isPart2) {
    if (current === 'O') {
      ;[map] = doPush(map, [newX, newY], direction, isPart2)
    }
  } else {
    if (current === '[' || current === ']') {
      if (direction === Direction.UP || direction === Direction.DOWN) {
        const offset = current === '[' ? 1 : -1
        ;[map] = doPush(map, [newX, newY], direction, isPart2)
        ;[map] = doPush(map, [newX, newY + offset], direction, isPart2)
      } else {
        ;[map] = doPush(map, [newX, newY], direction, isPart2)
      }
    }
  }

  current = map[newX][newY]
  map[newX][newY] = map[pos[0]][pos[1]]
  map[pos[0]][pos[1]] = current
  return [map, [newX, newY]]
}

const applyInstructions = (
  map: string[][],
  instructions: Direction[],
  isPart2: boolean
): string[][] => {
  let currentPosition = getInitialPosition(map)
  map[currentPosition[0]][currentPosition[1]] = '.'

  for (let instruction of instructions) {
    if (canPush(map, currentPosition, instruction, isPart2)) {
      ;[map, currentPosition] = doPush(
        map,
        currentPosition,
        instruction as Direction,
        isPart2
      )
    }
  }

  return map
}

const sumOfGps = (map: string[][]): number => {
  let total = 0
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] === 'O' || map[i][j] === '[') {
        total += 100 * i + j
      }
    }
  }
  return total
}

const solve_ex1 = async () => {
  const [map, instructions] = await readAndPreProcessFile()

  const finalMap = applyInstructions(map, instructions, false)

  const result = sumOfGps(finalMap)

  console.log('Ex 1: ' + result) // 1438161
}

const solve_ex2 = async () => {
  const [map, instructions] = await readAndPreProcessFile(true)

  const finalMap = applyInstructions(map, instructions, true)

  const result = sumOfGps(finalMap)

  console.log('Ex 2: ' + result) // 1437981
}

solve_ex1()
solve_ex2()
