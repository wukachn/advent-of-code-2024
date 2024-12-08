const readAndPreProcessFile = async (): Promise<string[][]> => {
  const puzzleInput = await Bun.file(`${__dirname}/input.txt`).text()

  return puzzleInput.split('\n').map((line) => line.split(''))
}

const getAntennaPositions = (
  map: string[][]
): Record<string, [number, number][]> => {
  const antennaPostions: Record<string, [number, number][]> = {}
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      const icon = map[i][j]
      if (icon !== '.') {
        if (!antennaPostions[icon]) {
          antennaPostions[icon] = [[i, j]]
        } else {
          antennaPostions[icon].push([i, j])
        }
      }
    }
  }
  return antennaPostions
}

const isValidPosition = (map: string[][], pos: [number, number]) =>
  pos[0] >= 0 && pos[1] >= 0 && pos[0] < map.length && pos[1] < map[0].length

const getAdditionalAntinodePositions = (
  map: string[][],
  initialPosition: [number, number],
  rowDiff: number,
  colDiff: number
) => {
  let currentPosition = initialPosition
  const additionalPositions = []
  while (isValidPosition(map, currentPosition)) {
    currentPosition = [
      currentPosition[0] + rowDiff,
      currentPosition[1] + colDiff
    ]
    additionalPositions.push(currentPosition)
  }
  return additionalPositions
}

const getUniqueAntinodePositions = (
  map: string[][],
  antennaPositions: Record<string, [number, number][]>,
  isPart2 = false
): Set<String> => {
  const antinodePositions = []
  for (const positions of Object.values(antennaPositions)) {
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const [row1, col1] = positions[i]
        const [row2, col2] = positions[j]

        if (row1 === row2 && col1 === col2) {
          continue
        }

        const rowDiff = row1 - row2
        const colDiff = col1 - col2
        const potentialPositions: [number, number][] = [
          [row1 + rowDiff, col1 + colDiff],
          [row2 - rowDiff, col2 - colDiff]
        ]

        if (isPart2) {
          potentialPositions.push(
            ...getAdditionalAntinodePositions(
              map,
              potentialPositions[0],
              rowDiff,
              colDiff
            )
          )
          potentialPositions.push(
            ...getAdditionalAntinodePositions(
              map,
              potentialPositions[1],
              -rowDiff,
              -colDiff
            )
          )

          potentialPositions.push([row1, col1])
          potentialPositions.push([row2, col2])
        }

        for (const pos of potentialPositions) {
          if (isValidPosition(map, pos)) {
            antinodePositions.push(pos)
          }
        }
      }
    }
  }

  return new Set(antinodePositions.map((pos) => JSON.stringify(pos)))
}

const solve_ex1 = async () => {
  const map = await readAndPreProcessFile()

  const antennaPostions = getAntennaPositions(map)
  const uniqueAntinodePositions = getUniqueAntinodePositions(
    map,
    antennaPostions
  )

  console.log('Ex 1: ' + uniqueAntinodePositions.size) // 278
}

const solve_ex2 = async () => {
  const map = await readAndPreProcessFile()

  const antennaPostions = getAntennaPositions(map)
  const uniqueAntinodePositions = getUniqueAntinodePositions(
    map,
    antennaPostions,
    true
  )

  console.log('Ex 2: ' + uniqueAntinodePositions.size) // 1067
}

solve_ex1()
solve_ex2()
