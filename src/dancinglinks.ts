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
      while ( cursor !== this ) {
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
      while ( cursor !== this ) {
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
      } while ( cursor !== this ) 
    }

    removeColumn() {
      let cursor = this as Node
      do {
        cursor.removeLeftRight()
        cursor = cursor.up
      } while ( cursor !== this ) 
    }

    recoverRow() {
      let cursor = this as Node
      do {
        cursor.recoverUpDown()
        cursor = cursor.right
      } while ( cursor !== this ) 
    }

    recoverColumn() {
      let cursor = this as Node
      do {
        cursor.recoverLeftRight()
        cursor = cursor.up
      } while ( cursor !== this ) 
    }

    rowCount(): number {
      let count = 0
      let cursor = this.right
      while ( cursor !== this ) {
        count++
        cursor = cursor.right
      }
      return count 
    }

    columnCount(): number {
      let count = 0
      let cursor = this.up
      while ( cursor !== this ) {
        count++
        cursor = cursor.up
      }
      return count 
    }

    toStringRow(): string {
      let str = `y: ${this.y}, [`
      let cursor = this as Node
      do {
        str += `${cursor.x}, `
        cursor = cursor.right
      }
      while ( cursor !== this ) 
      str += `]`
      return str
    }
  }

  export class Solver {
    head!: Header
    private columnHeaders: Array<Header>

    constructor(collectionSize: number) {
      // head ↔ 0 ↔ 1 ↔ ... ↔ head
      this.head = new Header(-1, -1)
      this.columnHeaders = new Array<Header>(collectionSize)
      let cursor = this.head as Node
      for( let i = 0; i < collectionSize; i++ ) {
        let columnHeader = new Header(i, -1)
        cursor.insertRight(columnHeader)
        cursor = cursor.right
        this.columnHeaders[i] = columnHeader
      }
    }

    addHeaders(...headers: Header[]) {
      headers.forEach(h => {
        let cursor = h as Node
        do {
          this.findSmallerColumnNode(cursor.x, cursor.y).insertUp(cursor)
          cursor = cursor.right
        } while ( cursor !== h as Node )
      })
    }

    selectColumnHeader() : Header {
      if(this.head.rowCount() == 0) {
        throw new Error("not found row")
      }

      let cursor = this.head.right as Header
      let selectedColumn = this.head.right as Header
      while( cursor !== this.head ) {
        if(cursor.columnCount() <= 0) {
          throw new Error(`this problem cant solve: column(${cursor.x})`)
        } else if (selectedColumn.columnCount() > cursor.columnCount()) {
          selectedColumn = cursor
        }
        cursor = cursor.right as Header
      }
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
      } while ( cursor !== columnHeader )
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
          } while ( columnCursor !== rowCursor )
          break
        }
        rowCursor = rowCursor.right
      } while( rowCursor !== this.head )
      throw new Error(`not found x: ${x}, y: ${y}`)
    }

    getRemoveRowHeaders(rowHeader: Header) : Set<Header> {
      let rowHeaders = new Set<Header>()
      rowHeaders.add(rowHeader)

      let cursor = rowHeader.right
      let columnHeaders = Array<Header>()
      while(cursor !== rowHeader) {
        columnHeaders.push(cursor.columnHeader())
        cursor = cursor.right
      }

      columnHeaders.forEach(h => {
        let cursor = h.up
        while(cursor !== h) {
          rowHeaders.add(cursor.rowHeader())
          cursor = cursor.up
        }
      })

      return rowHeaders
    }

    getRemoveColumnHeaders(rowHeader: Header) : Array<Header> {
      let cursor = rowHeader.right
      let columnHeaders = Array<Header>()
      while(cursor !== rowHeader) {
        columnHeaders.push(cursor.columnHeader())
        cursor = cursor.right
      }
      return columnHeaders
    }

    solve(answers : Array<Array<Header>>, answer : Array<Header>) {
      const root = 0
      const columnCount = this.columnHeaders.length
      const left = new Array<number>(columnCount + 1)
      const right = new Array<number>(columnCount + 1)
      const up = new Array<number>(columnCount + 1)
      const down = new Array<number>(columnCount + 1)
      const columns = new Array<number>(columnCount + 1)
      const sizes = new Array<number>(columnCount + 1).fill(0)
      const rowHeaders = new Array<Header | undefined>(columnCount + 1)
      const nodeIndices = new Map<Node, number>()
      const rowNodes = new Array<Array<number>>()

      left[root] = columnCount
      right[root] = columnCount == 0 ? root : 1
      for(let column = 1; column <= columnCount; column++) {
        left[column] = column - 1
        right[column] = column == columnCount ? root : column + 1
        up[column] = column
        down[column] = column
        columns[column] = column
      }

      let rowHeaderCursor = this.head.up as Header
      while(rowHeaderCursor !== this.head) {
        const nodes = new Array<number>()
        let nodeCursor = rowHeaderCursor.right
        while(nodeCursor !== rowHeaderCursor) {
          const index = left.length
          nodeIndices.set(nodeCursor, index)
          nodes.push(index)
          left.push(index)
          right.push(index)
          up.push(index)
          down.push(index)
          columns.push(nodeCursor.x + 1)
          sizes[nodeCursor.x + 1]++
          rowHeaders.push(rowHeaderCursor)
          nodeCursor = nodeCursor.right
        }
        rowNodes.push(nodes)
        rowHeaderCursor = rowHeaderCursor.up as Header
      }

      rowNodes.forEach(nodes => {
        nodes.forEach((node, index) => {
          left[node] = nodes[(index + nodes.length - 1) % nodes.length]
          right[node] = nodes[(index + 1) % nodes.length]
        })
      })

      const verticalIndex = (node: Node) : number => {
        if(node.y == -1 && node.x >= 0 && this.columnHeaders[node.x] === node) {
          return node.x + 1
        }
        const index = nodeIndices.get(node)
        if(index === undefined) {
          throw new Error(`node is not registered: x=${node.x}, y=${node.y}`)
        }
        return index
      }

      for(let column = 0; column < columnCount; column++) {
        const header = this.columnHeaders[column]
        up[column + 1] = verticalIndex(header.up)
        down[column + 1] = verticalIndex(header.down)
      }
      nodeIndices.forEach((index, node) => {
        up[index] = verticalIndex(node.up)
        down[index] = verticalIndex(node.down)
      })
      const linkedLeft = Int32Array.from(left)
      const linkedRight = Int32Array.from(right)
      const linkedUp = Int32Array.from(up)
      const linkedDown = Int32Array.from(down)
      const linkedColumns = Int32Array.from(columns)
      const linkedSizes = Int32Array.from(sizes)

      const coverColumn = (column: number) => {
        linkedRight[linkedLeft[column]] = linkedRight[column]
        linkedLeft[linkedRight[column]] = linkedLeft[column]
        for(let row = linkedUp[column]; row !== column; row = linkedUp[row]) {
          for(let node = linkedRight[row]; node !== row; node = linkedRight[node]) {
            linkedDown[linkedUp[node]] = linkedDown[node]
            linkedUp[linkedDown[node]] = linkedUp[node]
            linkedSizes[linkedColumns[node]]--
          }
        }
      }

      const uncoverColumn = (column: number) => {
        for(let row = linkedDown[column]; row !== column; row = linkedDown[row]) {
          for(let node = linkedLeft[row]; node !== row; node = linkedLeft[node]) {
            linkedSizes[linkedColumns[node]]++
            linkedDown[linkedUp[node]] = node
            linkedUp[linkedDown[node]] = node
          }
        }
        linkedRight[linkedLeft[column]] = column
        linkedLeft[linkedRight[column]] = column
      }

      const search = () => {
        if(linkedRight[root] === root) {
          if(answer.length != 0) {
            answers.push(answer.slice())
          }
          return
        }

        let selectedColumn = linkedRight[root]
        for(let column = linkedRight[selectedColumn]; column !== root; column = linkedRight[column]) {
          if(linkedSizes[column] < linkedSizes[selectedColumn]) {
            selectedColumn = column
          }
        }
        if(linkedSizes[selectedColumn] == 0) {
          return
        }

        coverColumn(selectedColumn)
        for(let row = linkedUp[selectedColumn]; row !== selectedColumn; row = linkedUp[row]) {
          answer.push(rowHeaders[row]!)
          for(let node = linkedRight[row]; node !== row; node = linkedRight[node]) {
            coverColumn(linkedColumns[node])
          }

          search()

          for(let node = linkedLeft[row]; node !== row; node = linkedLeft[node]) {
            uncoverColumn(linkedColumns[node])
          }
          answer.pop()
        }
        uncoverColumn(selectedColumn)
      }

      search()
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
