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

    constructor(board: Piece, pieces: Array<Piece>, options?: SolverOptions ) {
      this.collectionSize = board.actualSize() + pieces.length
      this.board = board.clone()
      this.headers = new Array<DancingLinks.Header>()
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
                subsetMaps.push(board.actualSize()+i)
                this.headers.push(ToHeader(count++, subsetMaps))
              }
            }
          }
        })
      })
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
    solve() : Array<Array<number>>{
      let solver = new DancingLinks.Solver(this.collectionSize)
      solver.addHeaders(...this.headers)

      let answers = new Array<Array<DancingLinks.Header>>()
      solver.solve(answers, [])

      let numbers = Array<Array<number>>()

      answers.forEach(a => {
        numbers.push(Polyomino.ToNumber(a, this.board))
      })
      return numbers 
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
    answer.forEach(a => {
      let index = a.left.x
      let cursor = a.right as DancingLinks.Node

      while(!Object.is(cursor, a) && !Object.is(cursor,a.left)) {
        number[number.indexOf(cursor.x)] = index
        cursor = cursor.right
      }
    })

    number.forEach((n, i) => {
      if(n == -1) {
        return
      }
      number[i] -= board.actualSize()
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