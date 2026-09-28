export type BingoTasksCollection = BingoTask[]
export type BingoTask = {
  name: string
  id: number
}

export type BingoCheckMarksCollection = BingoCheckMark[]
type BingoCheckMark = {
  cellIndex: number,
  xPos: number,
  yPos: number
}


export type BingoPositionMappingObj = {
  xPositions: positionsOccurences,
  yPositions: positionsOccurences 
}

type NumericalString = `${number}` | number
export type positionsOccurences = {
  [key: NumericalString]: number
}