import { DiagnosticCategory } from 'typescript';
import { DancingLinks } from './dancinglinks';

describe('DancingLinks Node tests', () => {
  test('constructor', () => {
    let node = new DancingLinks.Node(1, 2)
    expect(node.x).toBe(1)
    expect(node.y).toBe(2)
    expect(Object.is(node.up, node)).toBe(true)
    expect(Object.is(node.down, node)).toBe(true)
    expect(Object.is(node.left, node)).toBe(true)
    expect(Object.is(node.right, node)).toBe(true)
  });

  test('insertUp', () => {
    let node0 = new DancingLinks.Node(0, 0)
    let node1 = new DancingLinks.Node(0, 1)
    let node2 = new DancingLinks.Node(0, 2)

    node0.up = node2
    node0.down = node2
    node2.up = node0
    node2.down = node0

    node0.insertUp(node1)
    expect(Object.is(node0.up, node1)).toBe(true)
    expect(Object.is(node0.down, node2)).toBe(true)
    expect(Object.is(node1.up, node2)).toBe(true)
    expect(Object.is(node1.down, node0)).toBe(true)
    expect(Object.is(node2.up, node0)).toBe(true)
    expect(Object.is(node2.down, node1)).toBe(true)
  })

  test('insertUp upper', () => {
    let node0 = new DancingLinks.Node(0, 0)
    let node1 = new DancingLinks.Node(0, 1)
    let node2 = new DancingLinks.Node(0, 2)

    node0.up = node1
    node0.down = node1
    node1.up = node0
    node1.down = node0

    node1.insertUp(node2)
    expect(Object.is(node0.up, node1)).toBe(true)
    expect(Object.is(node0.down, node2)).toBe(true)
    expect(Object.is(node1.up, node2)).toBe(true)
    expect(Object.is(node1.down, node0)).toBe(true)
    expect(Object.is(node2.up, node0)).toBe(true)
    expect(Object.is(node2.down, node1)).toBe(true)
  })

  test('insertUp one Node', () => {
    let node0 = new DancingLinks.Node(0, 0)
    let node1 = new DancingLinks.Node(0, 1)

    node0.insertUp(node1)
    expect(Object.is(node0.up, node1)).toBe(true)
    expect(Object.is(node0.down, node1)).toBe(true)
    expect(Object.is(node1.up, node0)).toBe(true)
    expect(Object.is(node1.down, node0)).toBe(true)
  })

  test('insertRight', () => {
    let node0 = new DancingLinks.Node(0, 0)
    let node1 = new DancingLinks.Node(1, 0)
    let node2 = new DancingLinks.Node(2, 0)

    node0.right = node2
    node0.left = node2
    node2.right = node0
    node2.left = node0

    node0.insertRight(node1)
    expect(Object.is(node0.right, node1)).toBe(true)
    expect(Object.is(node0.left, node2)).toBe(true)
    expect(Object.is(node1.right, node2)).toBe(true)
    expect(Object.is(node1.left, node0)).toBe(true)
    expect(Object.is(node2.right, node0)).toBe(true)
    expect(Object.is(node2.left, node1)).toBe(true)
  })

  test('insertRight one Node', () => {
    let node0 = new DancingLinks.Node(0, 0)
    let node1 = new DancingLinks.Node(1, 0)

    node0.insertRight(node1)
    expect(Object.is(node0.right, node1)).toBe(true)
    expect(Object.is(node0.left, node1)).toBe(true)
    expect(Object.is(node1.right, node0)).toBe(true)
    expect(Object.is(node1.left, node0)).toBe(true)
  })

  test('removeUpDown', () => {
    let node0 = new DancingLinks.Node(0, 0)
    let node1 = new DancingLinks.Node(0, 1)
    let node2 = new DancingLinks.Node(0, 2)

    node0.up = node1
    node1.up = node2
    node1.down = node0
    node2.down = node1

    node1.removeUpDown()
    expect(Object.is(node0.up, node2)).toBe(true)
    expect(Object.is(node1.up, node2)).toBe(true)
    expect(Object.is(node1.down, node0)).toBe(true)
    expect(Object.is(node2.down, node0)).toBe(true)
  });

  test('removeUpDown one Node', () => {
    let node = new DancingLinks.Node(0, 0)

    node.removeUpDown()
    expect(Object.is(node.up, node)).toBe(true)
    expect(Object.is(node.down, node)).toBe(true)
  });

  test('removeLeftRight', () => {
    let node0 = new DancingLinks.Node(0, 0)
    let node1 = new DancingLinks.Node(1, 0)
    let node2 = new DancingLinks.Node(2, 0)

    node0.right = node1
    node1.left = node0
    node1.right = node2
    node2.left = node1

    node1.removeLeftRight()
    expect(Object.is(node0.right, node2)).toBe(true)
    expect(Object.is(node1.left, node0)).toBe(true)
    expect(Object.is(node1.right, node2)).toBe(true)
    expect(Object.is(node2.left, node0)).toBe(true)
  });

  test('removeLeftRight one Node', () => {
    let node = new DancingLinks.Node(0, 0)

    node.removeLeftRight()
    expect(Object.is(node.left, node)).toBe(true)
    expect(Object.is(node.right, node)).toBe(true)
  });

  test('recoverUpDown', () => {
    let node0 = new DancingLinks.Node(0, 0)
    let node1 = new DancingLinks.Node(0, 1)
    let node2 = new DancingLinks.Node(0, 2)

    node0.up = node2
    node1.up = node2
    node1.down = node0
    node2.down = node0

    node1.recoverUpDown()
    expect(Object.is(node0.up, node1)).toBe(true)
    expect(Object.is(node1.up, node2)).toBe(true)
    expect(Object.is(node1.down, node0)).toBe(true)
    expect(Object.is(node2.down, node1)).toBe(true)
  });

  test('recoverUpDown one Node', () => {
    let node = new DancingLinks.Node(0, 0)

    node.recoverUpDown()
    expect(Object.is(node.up, node)).toBe(true)
    expect(Object.is(node.down, node)).toBe(true)
  });

  test('recoverLeftRight', () => {
    let node0 = new DancingLinks.Node(0, 0)
    let node1 = new DancingLinks.Node(1, 0)
    let node2 = new DancingLinks.Node(2, 0)

    node0.right = node2
    node1.left = node0
    node1.right = node2
    node2.left = node0

    node1.recoverLeftRight()
    expect(Object.is(node0.right, node1)).toBe(true)
    expect(Object.is(node1.left, node0)).toBe(true)
    expect(Object.is(node1.right, node2)).toBe(true)
    expect(Object.is(node2.left, node1)).toBe(true)
  });

  test('recoverLeftRight one Node', () => {
    let node = new DancingLinks.Node(0, 0)

    node.recoverLeftRight()
    expect(Object.is(node.left, node)).toBe(true)
    expect(Object.is(node.right, node)).toBe(true)
  });

  test('rowHeader', () => {
    let header = new DancingLinks.Header(-1, 0)
    let node0 = new DancingLinks.Node(0, 0)
    let node1 = new DancingLinks.Node(1, 0)

    header.right = node0
    header.left = node1
    node0.right = node1
    node0.left = header
    node1.right = header
    node1.left = node0

    expect(Object.is(node0.rowHeader(), header)).toBe(true)
    expect(Object.is(node1.rowHeader(), header)).toBe(true)
    expect(Object.is(header.rowHeader(), header)).toBe(true)
  });

  test('columnHeader', () => {
    let header = new DancingLinks.Header(0, -1)
    let node0 = new DancingLinks.Node(0, 0)
    let node1 = new DancingLinks.Node(0, 1)

    header.up = node1
    header.down = node0
    node0.up = header
    node0.down = node1
    node1.up = node0
    node1.down = header

    expect(Object.is(node0.columnHeader(), header)).toBe(true)
    expect(Object.is(node1.columnHeader(), header)).toBe(true)
    expect(Object.is(header.columnHeader(), header)).toBe(true)
  });
});

describe('DancingLinks Header tests', () =>{
  test('removeRow', () => {
    let header0 = new DancingLinks.Header(-1, 0)
    let node0 = new DancingLinks.Node(0, 0)
    let header1 = new DancingLinks.Header(-1, 1)
    let node1 = new DancingLinks.Node(0, 1)
    let header2 = new DancingLinks.Header(-1, 2)
    let node2 = new DancingLinks.Node(0, 2)

    header0.insertRight(node0)
    header0.insertUp(header1)
    node0.insertUp(node1)
    header1.insertRight(node1)
    header1.insertUp(header2)
    node1.insertUp(node2)
    header2.insertRight(node2)

    header1.removeRow()
    expect(Object.is(header0.up, header2)).toBe(true)
    expect(Object.is(node0.up, node2)).toBe(true)
    expect(Object.is(header1.up, header2)).toBe(true)
    expect(Object.is(node1.up, node2)).toBe(true)
    expect(Object.is(header2.down, header0)).toBe(true)
    expect(Object.is(node2.down, node0)).toBe(true)
  })

  test('removeColumn', () => {
    let header0 = new DancingLinks.Header(0, -1)
    let node0 = new DancingLinks.Node(0, 0)
    let header1 = new DancingLinks.Header(1, -1)
    let node1 = new DancingLinks.Node(1, 0)
    let header2 = new DancingLinks.Header(2, -1)
    let node2 = new DancingLinks.Node(2, 0)

    header0.insertRight(header1)
    header0.insertUp(node0)
    node0.insertRight(node1)
    header1.insertRight(header2)
    header1.insertUp(node1)
    node1.insertRight(node2)
    header2.insertUp(node2)
    node1.insertRight(node2)

    header1.removeColumn()
    expect(Object.is(header0.right, header2)).toBe(true)
    expect(Object.is(node0.right, node2)).toBe(true)
    expect(Object.is(header1.right, header2)).toBe(true)
    expect(Object.is(node1.right, node2)).toBe(true)
    expect(Object.is(header2.left, header0)).toBe(true)
    expect(Object.is(node2.left, node0)).toBe(true)
  })

  test('recoverRow', () => {
    let header0 = new DancingLinks.Header(-1, 0)
    let node0 = new DancingLinks.Node(0, 0)
    let header1 = new DancingLinks.Header(-1, 1)
    let node1 = new DancingLinks.Node(0, 1)
    let header2 = new DancingLinks.Header(-1, 2)
    let node2 = new DancingLinks.Node(0, 2)

    header0.insertRight(node0)
    header0.insertUp(header1)
    node0.insertUp(node1)
    header1.insertRight(node1)
    header1.insertUp(header2)
    node1.insertUp(node2)
    header2.insertRight(node2)

    header1.removeRow()
    header1.recoverRow()
    expect(Object.is(header0.up, header1)).toBe(true)
    expect(Object.is(node0.up, node1)).toBe(true)
    expect(Object.is(header1.up, header2)).toBe(true)
    expect(Object.is(node1.up, node2)).toBe(true)
    expect(Object.is(header2.down, header1)).toBe(true)
    expect(Object.is(node2.down, node1)).toBe(true)
  })

  test('recoverColumn', () => {
    let header0 = new DancingLinks.Header(0, -1)
    let node0 = new DancingLinks.Node(0, 0)
    let header1 = new DancingLinks.Header(1, -1)
    let node1 = new DancingLinks.Node(1, 0)
    let header2 = new DancingLinks.Header(2, -1)
    let node2 = new DancingLinks.Node(2, 0)

    header0.insertRight(header1)
    header0.insertUp(node0)
    node0.insertRight(node1)
    header1.insertRight(header2)
    header1.insertUp(node1)
    node1.insertRight(node2)
    header2.insertUp(node2)
    node1.insertRight(node2)

    header1.removeColumn()
    header1.recoverColumn()
    expect(Object.is(header0.right, header1)).toBe(true)
    expect(Object.is(node0.right, node1)).toBe(true)
    expect(Object.is(header1.right, header2)).toBe(true)
    expect(Object.is(node1.right, node2)).toBe(true)
    expect(Object.is(header2.left, header1)).toBe(true)
    expect(Object.is(node2.left, node1)).toBe(true)
  })

  test('rowCount', () => {
    let header = new DancingLinks.Header(-1, 0)
    let node0 = new DancingLinks.Node(0, 0)
    let node1 = new DancingLinks.Node(1, 0)

    header.left = node1
    header.right = node0
    node0.left = header
    node0.right = node1
    node1.left = node0
    node1.right = header

    expect(header.rowCount()).toBe(2)
  });

  test('rowCount only Header', () => {
    let header = new DancingLinks.Header(-1, 0)
    expect(header.rowCount()).toBe(0)
  });

  test('rowCount only Headers', () => {
    let header0 = new DancingLinks.Header(-1, -1)
    let header1 = new DancingLinks.Header(0, -1)
    let header2 = new DancingLinks.Header(1, -1)
    header0.insertRight(header1)
    header1.insertRight(header2)
    expect(header0.rowCount()).toBe(2)
  });

  test('columnCount', () => {
    let header = new DancingLinks.Header(0, -1)
    let node0 = new DancingLinks.Node(0, 0)
    let node1 = new DancingLinks.Node(0, -1)

    header.up = node0
    header.down = node1
    node0.up = node1
    node0.down = header
    node1.up = header
    node1.down = node0

    expect(header.columnCount()).toBe(2)
  });

  test('columnCount only Header', () => {
    let header = new DancingLinks.Header(0, -1)
    expect(header.columnCount()).toBe(0)
  });
});

describe('DancingLinks Solver tests', () => {
  test('constructor', ()=> {
    let solver = new DancingLinks.Solver(2)

    expect(solver.head.x).toBe(-1)
    expect(solver.head.y).toBe(-1)
    expect(solver.head.right.x).toBe(0)
    expect(solver.head.right.y).toBe(-1)
    expect(solver.head.right.right.x).toBe(1)
    expect(solver.head.right.right.y).toBe(-1)
    expect(solver.head.right.right.right.x).toBe(-1)
    expect(solver.head.right.right.right.y).toBe(-1)
    expect(solver.head.left.x).toBe(1)
    expect(solver.head.left.y).toBe(-1)
    expect(solver.head.left.left.x).toBe(0)
    expect(solver.head.left.left.y).toBe(-1)
  });

  test('findNode', () => {
    let solver = new DancingLinks.Solver(2)
    let actual = solver.findNode(0, -1)
    expect(Object.is(actual, solver.head.right)).toBe(true)
  })

  test('findSmallerColumnNode', () => {
    let solver = new DancingLinks.Solver(2)
    let node0 = new DancingLinks.Node(1, 1)
    let node1 = new DancingLinks.Node(1, 3)

    solver.head.right.right.up = node0
    node0.up = node1
    node1.up = solver.head.right.right

    let actual = solver.findSmallerColumnNode(1, 2)
    expect(Object.is(actual, node0)).toBe(true)
  })

  test('findSmallerColumnNode upper', () => {
    let solver = new DancingLinks.Solver(2)
    let node0 = new DancingLinks.Node(1, 1)
    let node1 = new DancingLinks.Node(1, 2)

    solver.head.right.right.up = node0
    node0.up = node1
    node1.up = solver.head.right.right

    let actual = solver.findSmallerColumnNode(1, 3)
    expect(Object.is(actual, node1)).toBe(true)
  })

  test('findSmallerColumnNode only Header', () => {
    let solver = new DancingLinks.Solver(1)
    let actual = solver.findSmallerColumnNode(0, 1)
    expect(Object.is(actual, solver.head.right)).toBe(true)
  })

  test('isEmpty should true', () => {
    let solver = new DancingLinks.Solver(0)
    expect(solver.isEmpty()).toBe(true)
  })

  test('isEmpty should false', () => {
    let solver = new DancingLinks.Solver(1)
    let header = new DancingLinks.Header(-1, 0)
    let node = new DancingLinks.Node(0, 0)
    solver.head.up = header
    solver.head.down = header
    header.right = node
    header.left = node
    header.up = solver.head
    header.down = solver.head
    node.right = header
    node.left = header
    expect(solver.isEmpty()).toBe(false)
  })

  test('addHeaders', () => {
    let solver = new DancingLinks.Solver(2)

    let header0 = new DancingLinks.Header(-1, 0)
    let node0_0 = new DancingLinks.Node(0, 0)
    let node0_1 = new DancingLinks.Node(1, 0)
    header0.right = node0_0
    header0.left = node0_1
    node0_0.right = node0_1
    node0_0.left = header0
    node0_1.right = header0
    node0_1.left = node0_0

    let header1 = new DancingLinks.Header(-1, 1)
    let node1_0 = new DancingLinks.Node(0, 1)
    header1.right = node1_0
    header1.left = node1_0
    node1_0.right = header1
    node1_0.left = header1

    solver.addHeaders(header0, header1)
    expect(Object.is(solver.head.up, header0)).toBe(true)
    expect(Object.is(solver.head.up.up, header1)).toBe(true)
    expect(Object.is(solver.head.down.down, header0)).toBe(true)
    expect(Object.is(solver.head.down, header1)).toBe(true)
    expect(Object.is(solver.head.right.up, node0_0)).toBe(true)
    expect(Object.is(solver.head.right.down.down, node0_0)).toBe(true)
    expect(Object.is(solver.head.right.up.up, node1_0)).toBe(true)
    expect(Object.is(solver.head.right.down, node1_0)).toBe(true)
    expect(Object.is(solver.head.right.right.up, node0_1)).toBe(true)
    expect(Object.is(solver.head.right.right.down, node0_1)).toBe(true)
  })

  test('addHeaders one Header', () => {
    let solver = new DancingLinks.Solver(2)

    let header = new DancingLinks.Header(-1, 0)
    let node = new DancingLinks.Header(1, 0)
    header.right = node
    header.left = node
    node.right = header
    node.left = header

    solver.addHeaders(header)
    expect(Object.is(solver.head.up, header)).toBe(true)
    expect(Object.is(solver.head.down, header)).toBe(true)
    expect(Object.is(solver.head.right.right.up, node)).toBe(true)
    expect(Object.is(solver.head.right.right.down, node)).toBe(true)
    expect(Object.is(header.up, solver.head)).toBe(true)
    expect(Object.is(header.down, solver.head)).toBe(true)
    expect(Object.is(node.up, solver.head.right.right)).toBe(true)
    expect(Object.is(node.down, solver.head.right.right)).toBe(true)
  })

  test('selectColumnHeader', () => {
    let solver = new DancingLinks.Solver(2)
    
    let header0 = new DancingLinks.Header(-1, 0)
    let node0 = new DancingLinks.Node(0, 0)
    let node1 = new DancingLinks.Node(1, 0)
    header0.insertRight(node0)
    node0.insertRight(node1)

    let header1 = new DancingLinks.Header(-1, 1)
    let node2 = new DancingLinks.Node(0, 1)
    header1.insertRight(node2)

    solver.addHeaders(header0, header1)
    let actual = solver.selectColumnHeader()
    expect(Object.is(actual, solver.findNode(1, -1))).toBe(true)
  });

  test('getRemoveRowHeaders', () => {
    let solver = new DancingLinks.Solver(4)
    
    let header0 = new DancingLinks.Header(-1, 0)
    let node0_0 = new DancingLinks.Node(0, 0)
    let node0_1 = new DancingLinks.Node(1, 0)
    header0.insertRight(node0_0)
    node0_0.insertRight(node0_1)

    let header1 = new DancingLinks.Header(-1, 1)
    let node1_0 = new DancingLinks.Node(1, 1)
    let node1_1 = new DancingLinks.Node(2, 1)
    header1.insertRight(node1_0)
    node1_0.insertRight(node1_1)

    let header2 = new DancingLinks.Header(-1, 2)
    let node2_0 = new DancingLinks.Node(3, 2)
    header2.insertRight(node2_0)

    let header3 = new DancingLinks.Header(-1, 3)
    let node3_0 = new DancingLinks.Node(0, 3)
    let node3_1 = new DancingLinks.Node(3, 3)
    header3.insertRight(node3_0)
    node3_0.insertRight(node3_1)

    solver.addHeaders(header0, header1, header2, header3)

    let actual = solver.getRemoveRowHeaders(header0)
    expect(actual.has(header0)).toBe(true)
    expect(actual.has(header1)).toBe(true)
    expect(actual.has(header2)).toBe(false)
    expect(actual.has(header3)).toBe(true)
  });

  test('getRemoveColumnHeaders', () => {
    let solver = new DancingLinks.Solver(2)
    
    let header0 = new DancingLinks.Header(-1, 0)
    let node0 = new DancingLinks.Node(0, 0)
    let node1 = new DancingLinks.Node(1, 0)
    header0.insertRight(node0)
    node0.insertRight(node1)

    solver.addHeaders(header0)
    let actual = solver.getRemoveColumnHeaders(header0)
    expect(Object.is(actual[0], solver.findNode(0, -1))).toBe(true)
    expect(Object.is(actual[1], solver.findNode(1, -1))).toBe(true)
  });

  test('solve empty', () => {
    let solver = new DancingLinks.Solver(0)

    let answers = new Array<Array<DancingLinks.Header>>()
    let answer = new Array<DancingLinks.Header>()
    solver.solve(answers, answer)
    expect(answers.length).toBe(0)
  });

  test('solve one row, column', () => {
    let solver = new DancingLinks.Solver(1)
    let header = new DancingLinks.Header(-1, 0)
    let node = new DancingLinks.Node(0, 0)
    header.insertRight(node)
    solver.addHeaders(header)

    let answers = new Array<Array<DancingLinks.Header>>()
    solver.solve(answers, [])
    expect(Object.is(answers[0][0], header)).toBe(true)
  });

  test('solve two rows, columns', () => {
    let solver = new DancingLinks.Solver(4)

    let header0 = new DancingLinks.Header(-1, 0)
    let node0_0 = new DancingLinks.Node(0, 0)
    let node0_1 = new DancingLinks.Node(1, 0)
    header0.insertRight(node0_0)
    node0_0.insertRight(node0_1)

    let header1 = new DancingLinks.Header(-1, 1)
    let node1_0 = new DancingLinks.Node(1, 1)
    let node1_1 = new DancingLinks.Node(2, 1)
    header1.insertRight(node1_0)
    node1_0.insertRight(node1_1)

    let header2 = new DancingLinks.Header(-1, 2)
    let node2_0 = new DancingLinks.Node(3, 2)
    header2.insertRight(node2_0)

    let header3 = new DancingLinks.Header(-1, 3)
    let node3_0 = new DancingLinks.Node(0, 3)
    let node3_1 = new DancingLinks.Node(3, 3)
    header3.insertRight(node3_0)
    node3_0.insertRight(node3_1)

    solver.addHeaders(header0, header1, header2, header3)

    let answers = new Array<Array<DancingLinks.Header>>()

    solver.solve(answers, [])

    expect(Object.is(answers[0][0], header1)).toBe(true)
    expect(Object.is(answers[0][1], header3)).toBe(true)
  });
});