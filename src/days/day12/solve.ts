import { padMatrix } from '../../util/matrix'

const readAndPreProcessFile = async (): Promise<string[][]> => {
  const puzzleInput = await Bun.file(`${__dirname}/input.txt`).text()

  return padMatrix(
    puzzleInput.split('\n').map((line) => line.split('')),
    '.',
    1
  )
}

const blowUpPointsBy2 = (points: [number, number][]): [number, number][] => {
  const blownupPoints: [number, number][] = []
  points.forEach(([i, j]) => {
    blownupPoints.push([i * 2, j * 2])
    blownupPoints.push([i * 2, j * 2 + 1])
    blownupPoints.push([i * 2 + 1, j * 2])
    blownupPoints.push([i * 2 + 1, j * 2 + 1])
  })
  return blownupPoints
}

const countCorners = (points: [number, number][]): number => {
  let corners = 0
  for (let [row, col] of points) {
    const n = points.some(([r, c]) => r === row - 1 && c === col)
    const ne = points.some(([r, c]) => r === row - 1 && c === col + 1)
    const e = points.some(([r, c]) => r === row && c === col + 1)
    const se = points.some(([r, c]) => r === row + 1 && c === col + 1)
    const s = points.some(([r, c]) => r === row + 1 && c === col)
    const sw = points.some(([r, c]) => r === row + 1 && c === col - 1)
    const w = points.some(([r, c]) => r === row && c === col - 1)
    const nw = points.some(([r, c]) => r === row - 1 && c === col - 1)

    if (n && ne && e && !se && !s && !sw && !w && !nw) corners++
    if (!n && !ne && e && se && s && !sw && !w && !nw) corners++
    if (!n && !ne && !e && !se && s && sw && w && !nw) corners++
    if (n && !ne && !e && !se && !s && !sw && w && nw) corners++

    if (n && !ne && e && se && s && sw && w && nw) corners++
    if (n && ne && e && !se && s && sw && w && nw) corners++
    if (n && ne && e && se && s && !sw && w && nw) corners++
    if (n && ne && e && se && s && sw && w && !nw) corners++

    if (!n && !ne && e && se && s && !sw && !w && nw) corners++
    if (n && !ne && !e && se && !s && !sw && w && nw) corners++
    if (n && ne && e && !se && !s && sw && !w && !nw) corners++
    if (!n && ne && !e && !se && s && sw && w && !nw) corners++
  }
  return corners
}

const getPerimeter = (map: string[][], i: number, j: number): number => {
  const crop = map[i][j]
  let perimeter = 0
  if (map[i - 1][j] !== crop) perimeter++
  if (map[i + 1][j] !== crop) perimeter++
  if (map[i][j - 1] !== crop) perimeter++
  if (map[i][j + 1] !== crop) perimeter++
  return perimeter
}

const solve = async () => {
  let map = await readAndPreProcessFile()

  let total_part1 = 0
  let total_part2 = 0
  for (let i = 1; i < map.length - 1; i++) {
    for (let j = 1; j < map[i].length - 1; j++) {
      const crop = map[i][j]
      if (crop === '.') {
        continue
      }

      const visited = new Set<string>([JSON.stringify([i, j])])
      const queue: [number, number][] = [[i, j]]

      while (queue.length > 0) {
        const [currentRow, currentCol] = queue.shift()!

        const directions = [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0]
        ]

        for (const [dRow, dCol] of directions) {
          const newRow = currentRow + dRow
          const newCol = currentCol + dCol

          if (
            map[newRow][newCol] === crop &&
            !visited.has(JSON.stringify([newRow, newCol]))
          ) {
            queue.push([newRow, newCol])
            visited.add(JSON.stringify([newRow, newCol]))
          }
        }
      }

      const points = [...visited].map(
        (point) => JSON.parse(point) as [number, number]
      )

      const area = points.length
      const perimeter = points.reduce(
        (acc, [i, j]) => acc + getPerimeter(map, i, j),
        0
      )
      const sides = countCorners(blowUpPointsBy2(points))

      points.forEach(([i, j]) => {
        map[i][j] = '.'
      })

      total_part1 += area * perimeter
      total_part2 += area * sides
    }
  }

  console.log('Ex 1: ' + total_part1) // 1471452
  console.log('Ex 2: ' + total_part2) // 863366
}

solve()
