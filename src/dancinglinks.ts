export namespace DancingLinks {
  export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
  }

  export class Node {
    x!: number
    y!: number

    up!: Node
    down!: Node
    left!: Node
    right!: Node

    constructor(x: number, y: number) {
      this.x = x
      this.y = y

      this.up = this
      this.down = this
      this.left = this
      this.right = this
    }

    insertUp(node: Node) {
      node.up = this.up
      node.down = this
      this.up.down = node
      this.up = node
    }

    insertRight(node: Node) {
      node.right = this.right
      node.left = this
      this.right.left = node
      this.right = node
    }

    removeUpDown() {
      this.up.down = this.down
      this.down.up = this.up
    }

    removeLeftRight() {
      this.left.right = this.right
      this.right.left = this.left
    }

    recoverUpDown() {
      this.up.down = this
      this.down.up = this
    }

    recoverLeftRight() {
      this.left.right = this
      this.right.left = this
    }

    rowHeader(): Header {
      if ( this instanceof Header ) {
        return this as Header
      }

      let cursor = this.right
      while ( !Object.is(cursor, this) ) {
        if ( cursor instanceof Header ) {
          return cursor as Header
        }
        cursor = cursor.right
      }
      throw new Error("header is not found.")
    }

    columnHeader(): Header {
      if ( this instanceof Header ) {
        return this as Header
      }

      let cursor = this.down
      while ( !Object.is(cursor, this) ) {
        if ( cursor instanceof Header ) {
          return cursor as Header
        }
        cursor = cursor.down
      }
      throw new Error("header is not found.")
    }
  }

  export class Header extends Node {
    removeRow() {
      let cursor = this as Node
      do {
        cursor.removeUpDown()
        cursor = cursor.right
      } while (!Object.is(cursor, this)) 
    }

    removeColumn() {
      let cursor = this as Node
      do {
        cursor.removeLeftRight()
        cursor = cursor.up
      } while (!Object.is(cursor, this)) 
    }

    recoverRow() {
      let cursor = this as Node
      do {
        cursor.recoverUpDown()
        cursor = cursor.right
      } while (!Object.is(cursor, this)) 
    }

    recoverColumn() {
      let cursor = this as Node
      do {
        cursor.recoverLeftRight()
        cursor = cursor.up
      } while (!Object.is(cursor, this)) 
    }

    rowCount(): number {
      let count = 0
      let cursor = this.right
      while ( !Object.is(cursor, this) ) {
        count++
        cursor = cursor.right
      }
      return count 
    }

    columnCount(): number {
      let count = 0
      let cursor = this.up
      while ( !Object.is(cursor, this) ) {
        count++
        cursor = cursor.up
      }
      return count 
    }
  }

  export class Solver {
    head!: Header

    constructor(collectionSize: number) {
      // head ↔ 0 ↔ 1 ↔ ... ↔ head
      this.head = new Header(-1, -1)
      let cursor = this.head as Node
      for( let i = 0; i < collectionSize; i++ ) {
        cursor.insertRight(new Header(i, -1))
        cursor = cursor.right
      }
    }

    addHeaders(...headers: Header[]) {
      headers.forEach(h => {
        let cursor = h as Node
        do {
          this.findSmallerColumnNode(cursor.x, cursor.y).insertUp(cursor)
          cursor = cursor.right
        } while (!Object.is(cursor, h as Node))
      })
    }

    selectColumnHeader() : Header {
      // console.error(`rowCount y: ${this.head.y}(${this.head.rowCount()})`)
      if(this.head.rowCount() == 0) {
        throw new Error("not found row")
      }

      let cursor = this.head.right as Header
      let selectedColumn = this.head.right as Header
      while( !Object.is(cursor, this.head) ) {
        // console.error(`columnCount x: ${cursor.x}(${cursor.columnCount()})`)
        if(cursor.columnCount() <= 0) {
          throw new Error(`this problem cant solve: column(${cursor.x})`)
        } else if (selectedColumn.columnCount() > cursor.columnCount()) {
          selectedColumn = cursor
        }
        cursor = cursor.right as Header
      }
      // console.error(`selectedColumn x: ${selectedColumn.x}`)
      return selectedColumn as Header
    }

    isEmpty() : boolean {
      return this.head.rowCount() == 0
    }

    // input [3, 2]
    // return Node[3, 1]
    // [3, -1] ↔ [3, 1] ↔ [3, 3] ↔ [3, -1]
    findSmallerColumnNode(x: number, y: number) : Node {
      let columnHeader = this.findNode(x, -1)
      let cursor = columnHeader
      do {
        if(cursor.y < y && y < cursor.up.y || cursor.y > cursor.up.y) {
          return cursor
        }
        cursor = cursor.up
      } while ( !Object.is(cursor, columnHeader) )
      return columnHeader
    }

    // if not founded, throw error
    findNode(x: number, y: number) : Node {
      let rowCursor = this.head as Node

      // find x matched node
      do {
        if( rowCursor.x == x ) {
          let columnCursor = rowCursor
          do {
            if(columnCursor.x == x && columnCursor.y == y){
              return columnCursor
            }
          } while ( !Object.is(columnCursor, rowCursor) )
          break
        }
        rowCursor = rowCursor.right
      } while( !Object.is(rowCursor, this.head) )
      throw new Error(`not found x: ${x}, y: ${y}`)
    }

    getRemoveRowHeaders(rowHeader: Header) : Set<Header> {
      let rowHeaders = new Set<Header>()
      rowHeaders.add(rowHeader)

      let cursor = rowHeader.right
      let columnHeaders = Array<Header>()
      while(!Object.is(cursor,rowHeader)) {
        columnHeaders.push(cursor.columnHeader())
        cursor = cursor.right
      }

      columnHeaders.forEach(h => {
        let cursor = h.up
        while(!Object.is(cursor,h)) {
          rowHeaders.add(cursor.rowHeader())
          cursor = cursor.up
        }
      })

      return rowHeaders
    }

    getRemoveColumnHeaders(rowHeader: Header) : Array<Header> {
      let cursor = rowHeader.right
      let columnHeaders = Array<Header>()
      while(!Object.is(cursor,rowHeader)) {
        columnHeaders.push(cursor.columnHeader())
        cursor = cursor.right
      }
      return columnHeaders
    }

    solve(answers : Array<Array<Header>>, answer : Array<Header>) {
      if(this.isEmpty()) {
        if(answer.length != 0) {
          let tempAnswer = answer.map(x => x)
          answers.push(tempAnswer)
        }
        return
      }

      let columnHeader
      try {
        columnHeader = this.selectColumnHeader()
      } catch (error) {
        console.debug(error)
        // console.error(answer)
        return
      }
      let rowCursor = columnHeader.up
      while(!Object.is(rowCursor, columnHeader)) {
        let rowHeader = rowCursor.rowHeader()

        answer.push(rowHeader)

        let rowHeaders = this.getRemoveRowHeaders(rowHeader)
        rowHeaders.forEach(h => {
          h.removeRow()
        });
        let columnHeaders = this.getRemoveColumnHeaders(rowHeader)
        columnHeaders.forEach(h => {
          h.removeColumn()
        });

        this.solve(answers, answer)

        columnHeaders.forEach(h => {
          h.recoverColumn()
        })
        rowHeaders.forEach(h => {
          h.recoverRow()
        })

        answer.pop()

        rowCursor = rowCursor.up
      }
    }

    //_solve(answers Array<Array<Header>>, answer Array<Header>) {
      // 行列が空だったらanswersにanswerを追加して終了

      // 最もNode数が少ないColumnHeaderを選ぶ

      // 全ての候補RowHeaderに対して

      // answerにRowHeaderを追加する
      // RowHeaderが持つNodeそれぞれのColumnHeaderを削除する
      // RowHeaderを削除する
      // solveを呼ぶ
      // ColumnHeaderを元に戻す
      // RowHeaderを元に戻す
    //}
  }
}