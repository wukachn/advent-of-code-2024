export const transpose = (matrix: any[][]) => {
  return matrix[0].map((col, i) => matrix.map((row) => row[i]))
}

export const padMatrix = <T>(
  matrix: T[][],
  paddingValue: T,
  layers: number
): T[][] => {
  const rows = matrix.length
  const cols = matrix[0]?.length || 0
  const newRows = rows + 2 * layers
  const newCols = cols + 2 * layers

  const wrappedMatrix = Array.from({ length: newRows }, () =>
    Array(newCols).fill(paddingValue)
  )

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      wrappedMatrix[i + layers][j + layers] = matrix[i][j]
    }
  }

  return wrappedMatrix
}
