import { DancingLinks } from "./dancinglinks"

export namespace Polyomino {
  export class Piece {
    width!: number
    height!: number
    /*
      example: width 3, height 2
      [
        0, 1, 2,
        3, -1, 4,
      ]
    */
    maps!: Array<number>

    constructor(width: number, height: number, maps: Array<boolean>) {
      if(width * height != maps.length) {
        throw new Error(`width*height=${width*height} but maps.length=${maps.length}`)
      }

      this.width = width
      this.height = height
      this.maps = new Array<number>(this.width*this.height)
      let cursor = 0
      maps.forEach((m, i) => {
        this.maps[i] = m ? cursor++ : -1;
      })
    }

    // only not -1 size
    actualSize() : number {
      return this.maps.filter(m => m != -1).length
    }

    clone() : Piece {
      return new Piece(this.width, this.height, this.maps.map(x => x >= 0))
    } 

    contains(x: number, y: number, piece: Piece) : boolean {
      if(x < 0 || y < 0 || x >= this.width || y >= this.height ) {
        throw new Error(`invalid x=${x}, y=${y}`)
      }

      let subsetMaps = this.getSubsetMaps(x, y, piece.width, piece.height)
      for (let i = 0; i < subsetMaps.length; i++) {
        if(subsetMaps[i] < 0 && piece.maps[i] >= 0) {
            return false
        }
      }
      return true
    }

    equal(piece: Piece) : boolean {
      if(this.width != piece.width) return false
      if(this.height != piece.height) return false

      for (let i = 0; i < this.maps.length; i++) {
        if(this.maps[i] != piece.maps[i]) return false
      }
      return true
    }

    getReversePieces() : Array<Piece> {
      let reversePieces = new Array<Piece>()

      let xMaps = new Array<number>(this.width*this.height)
      let yMaps = new Array<number>(this.width*this.height)
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          xMaps[y * this.width + (this.width - x - 1)] = this.getNumber(x, y)
          yMaps[(this.height - y - 1) * this.width + x] = this.getNumber(x, y)
        }
      }
      let xPieceMaps = xMaps.map(m => m >= 0)
      let yPieceMaps = yMaps.map(m => m >= 0)

      reversePieces.push(new Polyomino.Piece(this.width, this.height, xPieceMaps))
      reversePieces.push(new Polyomino.Piece(this.width, this.height, yPieceMaps))
      return reversePieces
    }

    getRotatePieces() : Array<Piece> {
      let rotatePieces = new Array<Piece>()

      let rotate90Maps = new Array<number>(this.height*this.width)
      let rotate180Maps = new Array<number>(this.width*this.height)
      let rotate270Maps = new Array<number>(this.height*this.width)
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          rotate90Maps[x * this.height + (this.height - y - 1)] = this.getNumber(x, y)
          rotate180Maps[(this.height - y - 1) * this.width + (this.width - x - 1)] = this.getNumber(x, y)
          rotate270Maps[(this.width - x - 1) * this.height + y] = this.getNumber(x, y)
        }
      }
      let rotate90PieceMaps = rotate90Maps.map(m => m >= 0)
      let rotate180PieceMaps = rotate180Maps.map(m => m >= 0)
      let rotate270PieceMaps = rotate270Maps.map(m => m >= 0)

      rotatePieces.push(new Polyomino.Piece(this.height, this.width, rotate90PieceMaps))
      rotatePieces.push(new Polyomino.Piece(this.width, this.height, rotate180PieceMaps))
      rotatePieces.push(new Polyomino.Piece(this.height, this.width, rotate270PieceMaps))
      return rotatePieces
    }

    getNumber(x: number, y: number) : number {
      if(x < 0 || y < 0 || x >= this.width || y >= this.height ) {
        throw new Error(`invalid x=${x}, y=${y}`)
      }
      return this.maps[y*this.width + x];
    }

    getOverflowMaps() : Array<number> {
      let maps = this.maps.map(x => x)
      if(this.width === this.height) {
        return maps
      } else if (this.width > this.height) {
        let rows = this.width - this.height
        let tempMaps = new Array<number>(rows * this.width).fill(-1)
        maps.splice(0, 0, ...tempMaps)
        return maps
      } else {
        let columns = this.height - this.width
        let tempMaps = new Array<number>(columns).fill(-1)
        for (let i = 0; i < this.height; i++) {
          maps.splice((this.width + columns) * i + this.width ,0 , ...tempMaps)
        }
        return maps
      }
    }

    getPieceMaps(x: number, y: number, p: Piece) : Array<number> {
      if(x < 0 || y < 0 || x >= this.width || y >= this.height ) {
        throw new Error(`invalid x=${x}, y=${y}`)
      }

      if(x + p.width > this.width || y + p.height > this.height ) {
        throw new Error(`invalid x=${x}, y=${y}`)
      }
      let subsetMaps = this.getSubsetMaps(x, y, p.width, p.height)
      let pieceMaps = new Array<number>()
      p.maps.forEach((m, i) => {
        if(m !== -1) {
          pieceMaps.push(subsetMaps[i])
        }
      })
      return pieceMaps
    }

    getSubsetMaps(x: number, y: number, width: number, height: number) : Array<number> {
      if(x < 0 || y < 0 || x >= this.width || y >= this.height ) {
        throw new Error(`invalid x=${x}, y=${y}`)
      }

      if(width <= 0 || height <= 0 || x + width > this.width || y + height > this.height ) {
        throw new Error(`invalid x=${x}, y=${y}`)
      }

      let subsetMaps = new Array<number>(width*height)
      for (let i = 0; i < subsetMaps.length; i++) {
        subsetMaps[i] = this.getNumber(x + i%width, Math.floor(y + i/width))
      }
      return subsetMaps
    }
  }

  export interface SolverOptions {
    allowReverse?: boolean,
    allowRotate?: boolean,
  }

  export class Solver {
    /*
      actualBoardSize + pieces.length
    */
    collectionSize!: number
    board!: Piece
    headers!: Array<DancingLinks.Header>
    private boardCellCount: number
    private boardIndexes: Int32Array
    private placementCells: Array<Array<number>>

    constructor(board: Piece, pieces: Array<Piece>, options?: SolverOptions ) {
      this.boardCellCount = board.actualSize()
      this.collectionSize = this.boardCellCount + pieces.length
      this.board = board.clone()
      this.headers = new Array<DancingLinks.Header>()
      this.boardIndexes = new Int32Array(this.boardCellCount)
      board.maps.forEach((cell, index) => {
        if(cell >= 0) this.boardIndexes[cell] = index
      })
      this.placementCells = new Array<Array<number>>()
      let count = 0

      pieces.map(p => p.clone()).forEach((p, i) => {
        let optionPieces = new Array<Piece>()
        optionPieces.push(p)

        if(options?.allowReverse) {
          let tempOptionPiecesList = new Array<Array<Piece>>()
          optionPieces.forEach(op => {
            tempOptionPiecesList.push(op.getReversePieces())
          })

          tempOptionPiecesList.forEach(op => {
            op.forEach(p => {
              optionPieces.push(p)
            })
          })
          GetUniquePieces(optionPieces)
        }

        if(options?.allowRotate) {
          let tempOptionPiecesList = new Array<Array<Piece>>()
          optionPieces.forEach(op => {
            tempOptionPiecesList.push(op.getRotatePieces())
          })

          tempOptionPiecesList.forEach(op => {
            op.forEach(p => {
              optionPieces.push(p)
            })
          })
          GetUniquePieces(optionPieces)
        }


        optionPieces.forEach(op => {
          for (let x = 0; x + op.width <= board.width; x++) {
            for (let y = 0; y + op.height <= board.height; y++) {
              if(board.contains(x, y, op)) {
                let subsetMaps = board.getPieceMaps(x, y, op)
                subsetMaps = subsetMaps.filter(m => m >= 0)
                this.placementCells.push(subsetMaps.slice())
                subsetMaps.push(this.boardCellCount+i)
                this.headers.push(ToHeader(count++, subsetMaps))
              }
            }
          }
        })
      })
    }

    private getSymmetryOptimization() : {
      headers: Array<DancingLinks.Header>,
      placementTransforms: Array<Int32Array>,
    } | undefined {
      if(this.boardCellCount < 20 || this.headers.length == 0) return undefined

      // Only use board symmetries that map every legal placement back to a
      // legal placement of the same labelled piece. This proves that the
      // transformation maps complete solutions to complete solutions.
      const width = this.board.width
      const height = this.board.height
      const coordinateTransforms = [
        (x: number, y: number) => [x, y],
        (x: number, y: number) => [width - 1 - x, y],
        (x: number, y: number) => [x, height - 1 - y],
        (x: number, y: number) => [width - 1 - x, height - 1 - y],
      ]
      if(width == height) {
        coordinateTransforms.push(
          (x: number, y: number) => [height - 1 - y, x],
          (x: number, y: number) => [y, width - 1 - x],
          (x: number, y: number) => [y, x],
          (x: number, y: number) => [width - 1 - y, height - 1 - x],
        )
      }

      const pieceIndexes = this.headers.map(header => header.left.x - this.boardCellCount)
      const placementLookup = new Map<string, number>()
      this.placementCells.forEach((cells, placement) => {
        placementLookup.set(`${pieceIndexes[placement]}:${cells.slice().sort((a, b) => a - b).join(',')}`, placement)
      })

      const placementTransforms = new Array<Int32Array>()
      coordinateTransforms.forEach(transform => {
        const cellTransform = new Int32Array(this.boardCellCount)
        let valid = true
        for(let y = 0; y < height && valid; y++) {
          for(let x = 0; x < width; x++) {
            const cell = this.board.maps[y * width + x]
            if(cell < 0) continue
            const [transformedX, transformedY] = transform(x, y)
            const transformedCell = this.board.maps[transformedY * width + transformedX]
            if(transformedCell < 0) {
              valid = false
              break
            }
            cellTransform[cell] = transformedCell
          }
        }
        if(!valid) return

        const transformedPlacements = new Int32Array(this.headers.length)
        for(let placement = 0; placement < this.headers.length; placement++) {
          const cells = this.placementCells[placement]
            .map(cell => cellTransform[cell])
            .sort((a, b) => a - b)
          const transformedPlacement = placementLookup.get(`${pieceIndexes[placement]}:${cells.join(',')}`)
          if(transformedPlacement === undefined) {
            valid = false
            break
          }
          transformedPlacements[placement] = transformedPlacement
        }
        if(valid) placementTransforms.push(transformedPlacements)
      })

      if(placementTransforms.length <= 1) return undefined

      // Searching one canonical placement of a pivot piece visits every
      // solution orbit. solve() restores the complete orbit and removes the
      // duplicates produced by solutions that are themselves symmetric.
      let pivotPiece = 0
      let pivotPlacements = pieceIndexes.filter(piece => piece == pivotPiece).length
      const pieceCount = this.collectionSize - this.boardCellCount
      for(let piece = 1; piece < pieceCount; piece++) {
        const count = pieceIndexes.filter(index => index == piece).length
        if(count < pivotPlacements) {
          pivotPiece = piece
          pivotPlacements = count
        }
      }

      const headers = this.headers.filter((_, placement) => {
        if(pieceIndexes[placement] != pivotPiece) return true
        let canonicalPlacement = placement
        placementTransforms.forEach(transform => {
          canonicalPlacement = Math.min(canonicalPlacement, transform[placement])
        })
        return placement == canonicalPlacement
      })
      return { headers, placementTransforms }
    }

    /*
      example:
        board:
          **
          ***
          ***
        pieces[0]:
          **
          **
        pieces[1]:
          **
        pieces[2]:
          *
          *
        collectionSize: 8 + 3
      return: 
        [
          [
            0, 0, -1,
            0, 0, 2,
            1, 1, 2,
          ],
          [
            1, 1, -1,
            0, 0, 2,
            0, 0, 2,
          ],
          [
            1, 1, -1,
            2, 0, 0,
            2, 0, 0
          ],
        ]
    */
    private solveHeaders() : Array<Array<DancingLinks.Header>> {
      const symmetry = this.getSymmetryOptimization()
      let solver = new DancingLinks.Solver(this.collectionSize)
      solver.addHeaders(...(symmetry?.headers ?? this.headers))

      let answers = new Array<Array<DancingLinks.Header>>()
      solver.solve(answers, [])
      if(symmetry !== undefined) {
        const expandedAnswers = new Array<Array<DancingLinks.Header>>()
        const seen = new Set<string>()
        answers.forEach(answer => {
          symmetry.placementTransforms.forEach(transform => {
            const transformedAnswer = answer.map(header => this.headers[transform[header.y]])
            const key = transformedAnswer.map(header => header.y).sort((a, b) => a - b).join(',')
            if(!seen.has(key)) {
              seen.add(key)
              expandedAnswers.push(transformedAnswer)
            }
          })
        })
        answers = expandedAnswers
      }
      return answers
    }

    private answerToNumber(answer: Array<DancingLinks.Header>) : Array<number> {
      const number = this.board.maps.slice()
      answer.forEach(header => {
        const pieceIndex = header.left.x - this.boardCellCount
        let cursor = header.right as DancingLinks.Node
        while(cursor !== header && cursor !== header.left) {
          number[this.boardIndexes[cursor.x]] = pieceIndex
          cursor = cursor.right
        }
      })
      return number
    }

    solve() : Array<Array<number>>{
      const answers = this.solveHeaders()
      let numbers = Array<Array<number>>()

      answers.forEach(a => {
        numbers.push(this.answerToNumber(a))
      })
      return numbers 
    }

    solveAsync(numberAnswers: Array<Array<number>>) : Promise<void>{
      return new Promise((resolve, reject) => {
        const answers = this.solveHeaders()

        answers.forEach(a => {
          numberAnswers.push(this.answerToNumber(a))
        })
        resolve()
      })
    }
  }

  export function ToHeader(y: number, maps: Array<number>) : DancingLinks.Header{
    let header = new DancingLinks.Header(-1, y)
    let cursor = header as DancingLinks.Node
    maps.forEach(m => {
      let node = new DancingLinks.Node(m, y)
      cursor.insertRight(node)
      cursor = cursor.right
    })
    return header
  }

  export function ToNumber(answer: Array<DancingLinks.Header>, board: Piece) : Array<number>{
    let number = board.maps.map(x => x)
    const boardSize = board.actualSize()
    const boardIndexes = new Int32Array(boardSize)
    const assigned = new Uint8Array(boardSize)
    board.maps.forEach((cell, index) => {
      if(cell >= 0) boardIndexes[cell] = index
    })
    answer.forEach(a => {
      let index = a.left.x
      let cursor = a.right as DancingLinks.Node

      while(!Object.is(cursor, a) && !Object.is(cursor,a.left)) {
        const boardIndex = cursor.x >= 0 && cursor.x < boardSize && assigned[cursor.x] == 0
          ? boardIndexes[cursor.x]
          : number.indexOf(cursor.x)
        number[boardIndex] = index
        if(cursor.x >= 0 && cursor.x < boardSize) assigned[cursor.x] = 1
        cursor = cursor.right
      }
    })

    number.forEach((n, i) => {
      if(n == -1) {
        return
      }
      number[i] -= boardSize
    })
    return number
  }

  export function GetUniquePieces(pieces: Array<Piece>) {
    for (let i = pieces.length - 1; i > 0; i--) {
      for (let j = i - 1; j >= 0; j--) {
        if (pieces[i].equal(pieces[j])) {
          pieces.splice(j, 1)
          i--
        }
      }
    }
  }
}
