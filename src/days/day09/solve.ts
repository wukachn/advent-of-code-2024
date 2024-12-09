const readAndPreProcessFile = async (): Promise<number[]> => {
  const puzzleInput = await Bun.file(`${__dirname}/input.txt`).text()

  return puzzleInput.split('').map(Number)
}

const getInitialDiskSpace = (disk: number[]): (number | '.')[] => {
  const space: (number | '.')[] = []
  let isFile = true
  let fileNumber = 0
  for (let diskValue of disk) {
    if (isFile) {
      space.push(...Array(diskValue).fill(fileNumber))
      fileNumber++
    } else {
      space.push(...Array(diskValue).fill('.'))
    }
    isFile = !isFile
  }
  return space
}

const isCompacted = (space: (number | '.')[]): boolean => {
  const idx = space.findIndex((value) => value === '.')
  return space.slice(idx).every((value) => value === '.')
}

const basicCompact = (disk: (number | '.')[]): (number | '.')[] => {
  while (!isCompacted(disk)) {
    const emptyIdx = disk.findIndex((value) => value === '.')
    const fileIdx = disk.findLastIndex((value) => value !== '.')

    disk[emptyIdx] = disk[fileIdx]
    disk[fileIdx] = '.'
  }
  return disk
}

const calculateChecksum = (space: (number | '.')[]): number => {
  let total = 0
  for (let i = 0; i < space.length; i++) {
    const value = space[i]
    if (value === '.') {
      continue
    }
    total += value * i
  }
  return total
}

const improveEncoding = (encoding: number[]): [number | '.', number][] => {
  let newEncoding: [number | '.', number][] = []
  let isFile = true
  let fileNumber = 0
  for (let blocks of encoding) {
    if (isFile) {
      newEncoding.push([fileNumber, blocks])
      fileNumber++
    } else {
      newEncoding.push(['.', blocks])
    }
    isFile = !isFile
  }
  return newEncoding
}

const improvedEncodingToDisk = (
  improvedEncoding: [number | '.', number][]
): (number | '.')[] => {
  const disk: (number | '.')[] = []
  for (let [value, blocks] of improvedEncoding) {
    disk.push(...Array(blocks).fill(value))
  }
  return disk
}

const solve_ex1 = async () => {
  const encodedDisk = await readAndPreProcessFile()

  const disk = getInitialDiskSpace(encodedDisk)
  const compactedDisk = basicCompact(disk)
  const checksum = calculateChecksum(compactedDisk)

  console.log('Ex 1: ' + checksum) // 6307275788409
}

const solve_ex2 = async () => {
  const encoding = await readAndPreProcessFile()

  const improvedEncoding = improveEncoding(encoding)

  // This is a lazy solution. I should come back and clean this up later.
  for (let i = improvedEncoding.length - 1; i >= 0; i--) {
    const [currentValue, currentBlocks] = improvedEncoding[i]
    if (currentValue === '.') {
      continue
    }

    const idx = improvedEncoding.findIndex(
      ([value, blocks]) => value === '.' && blocks >= currentBlocks
    )
    if (idx === -1 || idx >= i) {
      continue
    }

    improvedEncoding[i] = ['.', currentBlocks]

    const availableBlocks = improvedEncoding[idx][1]
    if (availableBlocks !== currentBlocks) {
      let d = 0
      for (let j = idx + 1; j < improvedEncoding.length; j++) {
        if (improvedEncoding[j][0] === '.') {
          d += improvedEncoding[j][1]
        } else {
          break
        }
      }
      improvedEncoding.splice(idx + 1, d, [
        '.',
        availableBlocks - currentBlocks + d
      ])
      i++
    }
    improvedEncoding[idx] = [currentValue, currentBlocks]
  }

  const disk = improvedEncodingToDisk(improvedEncoding)
  const checksum = calculateChecksum(disk)

  console.log('Ex 2: ' + checksum) // 6327174563252
}

solve_ex1()
solve_ex2()
