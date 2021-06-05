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

  export class Solver {
    /*
      actualBoardSize + pieces.length
    */
    collectionSize!: number
    board!: Piece
    pieces!: Array<Piece>
    headers!: Array<DancingLinks.Header>

    constructor(board: Piece, pieces: Array<Piece>) {
      this.collectionSize = board.actualSize() + pieces.length
      this.board = board
      this.pieces = pieces

      this.headers = new Array<DancingLinks.Header>()

      let count = 0
      this.pieces.forEach((p, i) => {
        for (let x = 0; x + p.width <= board.width; x++) {
          for (let y = 0; y + p.height <= board.height; y++) {
            if(board.contains(x, y, p)) {
              let subsetMaps = board.getPieceMaps(x, y, p)
              subsetMaps = subsetMaps.filter(m => {return m !== -1})
              subsetMaps.push(board.actualSize()+i)
              this.headers.push(ToHeader(count++, subsetMaps))
            }
          }
        }
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

}