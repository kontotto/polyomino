import { DancingLinks } from './dancinglinks';
import { Polyomino } from './polyomino';

describe('Polyomino Piece tests', () => {
  test('constructor', () => {
    let board = new Polyomino.Piece(2, 2, [true, false, true, false])

    expect(board.width).toBe(2)
    expect(board.height).toBe(2)
    expect(board.maps[0]).toBe(0)
    expect(board.maps[1]).toBe(-1)
    expect(board.maps[2]).toBe(1)
    expect(board.maps[3]).toBe(-1)
  })

  test('constructor should false', () => {
    expect(() => new Polyomino.Piece(3, 2, [true,false,false,false,true])).toThrow(Error)
    expect(() => new Polyomino.Piece(2, 2, [true,false,false,false,true])).toThrow(Error)
  })

  test('actualSize', () => {
    let piece = new Polyomino.Piece(2, 2, [true,false,true,true])
    expect(piece.actualSize()).toBe(3)
  })

  test('getReversePieces', () => {
    let pieceMap = [
      true, false, false,
      true, true, true,
    ]
    let piece = new Polyomino.Piece(3, 2, pieceMap)

    let reversePieceMap0 = [
      false, false, true,
      true, true, true,
    ]
    let reversePiece0 = new Polyomino.Piece(3, 2, reversePieceMap0)

    let reversePieceMap1 = [
      true, true, true,
      true, false, false,
    ]
    let reversePiece1 = new Polyomino.Piece(3, 2, reversePieceMap1)
    let reversePieces = piece.getReversePieces()

    expect(reversePieces.length).toEqual(2)
    expect(reversePieces[0].maps).toEqual(reversePiece0.maps)
    expect(reversePieces[1].maps).toEqual(reversePiece1.maps)
  })

  test('equal', () => {
    let piece0_0 = new Polyomino.Piece(1, 1, [true])
    let piece0_1 = new Polyomino.Piece(1, 1, [true])
    expect(piece0_0.equal(piece0_1)).toEqual(true)

    let piece1_0 = new Polyomino.Piece(2, 1, [true, true])
    let piece1_1 = new Polyomino.Piece(2, 1, [true, false])
    expect(piece1_0.equal(piece1_1)).toEqual(false)
  })

  test('getRotatePieces', () => {
    let pieceMap = [
      true, false, false,
      true, true, true,
    ]
    let piece = new Polyomino.Piece(3, 2, pieceMap)

    let rotatePieceMap0 = [
      true, true,
      true, false,
      true, false,
    ]
    let rotatePiece0 = new Polyomino.Piece(2, 3, rotatePieceMap0)

    let rotatePieceMap1 = [
      true, true, true,
      false, false, true,
    ]
    let rotatePiece1 = new Polyomino.Piece(3, 2, rotatePieceMap1)

    let rotatePieceMap2 = [
      false, true,
      false, true,
      true, true,
    ]
    let rotatePiece2 = new Polyomino.Piece(2, 3, rotatePieceMap2)

    let rotatePieces = piece.getRotatePieces()
    expect(rotatePieces.length).toEqual(3)
    expect(rotatePieces[0].maps).toEqual(rotatePiece0.maps)
    expect(rotatePieces[1].maps).toEqual(rotatePiece1.maps)
    expect(rotatePieces[2].maps).toEqual(rotatePiece2.maps)
  })

  test('getNumber', () => {
    let board_maps = 
    [
      true, true, true,
      true, false, true,
    ]
    let board = new Polyomino.Piece(3, 2, board_maps)

    expect(board.getNumber(0, 0)).toBe(0)
    expect(board.getNumber(1, 0)).toBe(1)
    expect(board.getNumber(2, 0)).toBe(2)
    expect(board.getNumber(0, 1)).toBe(3)
    expect(board.getNumber(1, 1)).toBe(-1)
    expect(board.getNumber(2, 1)).toBe(4)
  })

  test('getNumber shouled error', () => {
    let board = new Polyomino.Piece(1, 1, [true])
    expect(() => board.getNumber(1, 0)).toThrow(Error)
    expect(() => board.getNumber(0, 1)).toThrow(Error)
    expect(() => board.getNumber(-1, 0)).toThrow(Error)
    expect(() => board.getNumber(0, -1)).toThrow(Error)
  })

  test('getOverflowMaps', () => {
    let pieceMaps0 = [
      true, true,
      true, true,
    ]
    let piece0 = new Polyomino.Piece(2, 2, pieceMaps0)
    
    let pieceMaps1 = [
      true, true,
    ]
    let piece1 = new Polyomino.Piece(2, 1, pieceMaps1)

    let pieceMaps2 = [
      true,
      true,
      true,
    ]
    let piece2 = new Polyomino.Piece(1, 3, pieceMaps2)

    expect(piece0.getOverflowMaps()).toEqual([
      0, 1,
      2, 3,
    ])

    expect(piece1.getOverflowMaps()).toEqual([
      -1, -1,
      0, 1,
    ])

    expect(piece2.getOverflowMaps()).toEqual([
      0, -1, -1,
      1, -1, -1,
      2, -1, -1,
    ])
  })

  test('getPieceMaps', () => {
    let boardMaps = 
    [
      true, true,
      true, true,
    ]
    let board = new Polyomino.Piece(2, 2, boardMaps)

    let piece = new Polyomino.Piece(2, 2, [true, true, true, false])

    let pieceMaps = board.getPieceMaps(0, 0, piece)
    expect(pieceMaps).toEqual([0, 1, 2])
  })

  test('getSubsetMaps', () => {
    let board_maps = 
    [
      true, true, true,
      true, false, true,
      true, true, true,
      true, true, true,
    ]
    let board = new Polyomino.Piece(3, 4, board_maps)

    let subset_maps = board.getSubsetMaps(1, 1, 2, 3)
    expect(subset_maps).toEqual([-1, 4, 6, 7, 9, 10])
  })

  test('getSubsetMaps shouled error', () => {
    let board = new Polyomino.Piece(1, 1, [true])
    expect(() => board.getSubsetMaps(1, 0, 1, 1)).toThrow(Error)
    expect(() => board.getSubsetMaps(0, 1, 1, 1)).toThrow(Error)
    expect(() => board.getSubsetMaps(-1, 0, 1, 1)).toThrow(Error)
    expect(() => board.getSubsetMaps(0, -1, 1, 1)).toThrow(Error)

    expect(() => board.getSubsetMaps(0, 0, 0, 1)).toThrow(Error)
    expect(() => board.getSubsetMaps(0, 0, 1, 0)).toThrow(Error)

    expect(() => board.getSubsetMaps(0, 0, 2, 1)).toThrow(Error)
    expect(() => board.getSubsetMaps(0, 0, 1, 2)).toThrow(Error)
  })

  test('clone', () => {
    let piece = new Polyomino.Piece(2, 1, [true, false])
    let clone = piece.clone()

    expect(Object.is(piece, clone)).toEqual(false)
    expect(piece.equal(clone)).toEqual(true)
  })

  test('contains', () => {
    let board_maps = 
    [
      true, true, true,
      true, false, true,
      true, true, true,
    ]
    let board = new Polyomino.Piece(3, 3, board_maps)
    let piece0 = new Polyomino.Piece(1, 1, [true])

    let piece1_maps = 
    [
      false, true,
      true, true,
    ]
    let piece1 = new Polyomino.Piece(2, 2, piece1_maps)

    expect(board.contains(0, 0, piece0)).toBe(true)
    expect(board.contains(1, 1, piece1)).toBe(true)
  })

  test('contains complex', () => {
    let boardMaps = [
      true, true, true, true, false,
      true, true, true, true, true,
      true, true, true, true, true,
      true, true, true, true, true,
      false, true, true, true, true,
    ]
    let board = new Polyomino.Piece(5, 5, boardMaps)

    let piece0Maps = [
      true, true,
      true, false,
      true, true,
      false, true,
    ]
    let piece1Maps = [
      false, true, false,
      true, true, true,
      false, true, false,
    ]
    let piece2Maps = [
      false, false, true,
      false, true, true,
      true, true, false,
    ]
    let piece3Maps = [
      false, false, false, true,
      true, true, true, true,
    ]

    let piece0 = new Polyomino.Piece(2, 4, piece0Maps)
    let piece1 = new Polyomino.Piece(3, 3, piece1Maps)
    let piece2 = new Polyomino.Piece(3, 3, piece2Maps)
    let piece3 = new Polyomino.Piece(4, 2, piece3Maps)
    expect(board.contains(0, 0, piece0)).toBe(true)
    expect(board.contains(0, 0, piece1)).toBe(true)
    expect(board.contains(0, 0, piece2)).toBe(true)
    expect(board.contains(0, 0, piece3)).toBe(true)
  })

  test('contains should false', () => {
    let boardMaps = 
    [
      true, true, true,
      true, false, true,
      true, true, true,
    ]
    let board = new Polyomino.Piece(3, 3, boardMaps)
    let piece0 = new Polyomino.Piece(1, 1, [true])

    let piece1Maps = 
    [
      false, true,
      true, true,
    ]
    let piece1 = new Polyomino.Piece(2, 2, piece1Maps)

    expect(board.contains(1, 1, piece0)).toBe(false)
    expect(board.contains(0, 1, piece1)).toBe(false)
  })

  test('contains shouled error', () => {
    let board = new Polyomino.Piece(1, 1, [true])
    let piece = new Polyomino.Piece(1, 1, [true])
    expect(() => board.contains(1, 0, piece)).toThrow(Error)
    expect(() => board.contains(0, 1, piece)).toThrow(Error)
    expect(() => board.contains(-1, 0, piece)).toThrow(Error)
    expect(() => board.contains(0, -1, piece)).toThrow(Error)
  })
})

describe('Polyomino Solver tests', () => {
  test('constructor', () => {
    let board = new Polyomino.Piece(2, 2, [true, false, true, true])
    let pieces = [new Polyomino.Piece(1, 1, [true])]

    let solver = new Polyomino.Solver(board, pieces)
    expect(solver.collectionSize).toBe(4)
    expect(solver.board.equal(board)).toBe(true)
    expect(solver.headers.length).toBe(3)
  })

  test('constructor options', () => {
    let board = new Polyomino.Piece(2, 2, [true, false, true, true])
    let pieces = [
      new Polyomino.Piece(1, 1, [true]),
      new Polyomino.Piece(2, 1, [true, true]),
    ]

    let options: Polyomino.SolverOptions = {
      allowReverse: true,
      allowRotate: true,
    }
    let solver = new Polyomino.Solver(board, pieces, options)
    expect(solver.collectionSize).toBe(5)
    expect(solver.board.equal(board)).toBe(true)
    expect(solver.headers.length).toBe(5)
  })

  test('constructor options complex', () => {
    let board = new Polyomino.Piece(3, 2, [true, true, true, true, true, true])
    let pieces = [
      new Polyomino.Piece(2, 2, [true, false, true, true]),
      new Polyomino.Piece(2, 2, [true, true, false, true]),
    ]

    let options: Polyomino.SolverOptions = {
      allowReverse: true,
      allowRotate: true,
    }
    let solver = new Polyomino.Solver(board, pieces, options)
    expect(solver.collectionSize).toBe(8)
    expect(solver.board.equal(board)).toBe(true)
    expect(solver.headers.length).toBe(16)
  })

  test('constructor complex', () => {
    let boardMaps = [
      true, true, true, true, false,
      true, true, true, true, true,
      true, true, true, true, true,
      false, true, true, true, true,
      false, true, true, true, true,
    ]
    let board = new Polyomino.Piece(5, 5, boardMaps)

    let piece0Maps = [
      true, true,
      true, false,
      true, true,
      false, true,
    ]
    let piece1Maps = [
      false, true, true,
      true, true, true,
      false, true, false,
    ]
    let piece2Maps = [
      false, false, true,
      false, true, true,
      true, true, false,
    ]
    let piece3Maps = [
      false, false, false, true,
      true, true, true, true,
    ]

    let pieces = [
      new Polyomino.Piece(2, 4, piece0Maps),
      new Polyomino.Piece(3, 3, piece1Maps),
      new Polyomino.Piece(3, 3, piece2Maps),
      new Polyomino.Piece(4, 2, piece3Maps),
    ]

    let solver = new Polyomino.Solver(board, pieces)
    expect(solver.collectionSize).toBe(26)
    expect(solver.board.equal(board)).toBe(true)
    expect(solver.headers.filter(h => h.left.x == 22).length).toBe(6)
    expect(solver.headers.filter(h => h.left.x == 23).length).toBe(7)
    expect(solver.headers.filter(h => h.left.x == 24).length).toBe(6)
    expect(solver.headers.filter(h => h.left.x == 25).length).toBe(5)
  })

  test('solve', () => {
    let board = new Polyomino.Piece(2, 2, [true, false, true, true])
    let pieces = [
      new Polyomino.Piece(1, 2, [true, true]),
      new Polyomino.Piece(1, 1, [true]),
    ]

    let solver = new Polyomino.Solver(board, pieces)
  })

  test('solve pattern2', () => {
    let boardMaps = [
      true, true, false,
      true, true, true,
      true, true, true,
    ]
    let board = new Polyomino.Piece(3, 3, boardMaps)

    let pieces = [
      new Polyomino.Piece(2, 2, [true, true, true, true]),
      new Polyomino.Piece(2, 1, [true, true]),
      new Polyomino.Piece(1, 2, [true, true]),
    ]

    let solver = new Polyomino.Solver(board, pieces)
    let answers = solver.solve()

    let expect0 = [
      0, 0, -1,
      0, 0, 2,
      1, 1, 2,
    ]
    let expect1 = [
      1, 1, -1,
      0, 0, 2,
      0, 0, 2,
    ]
    let expect2 = [
      1, 1, -1,
      2, 0, 0,
      2, 0, 0,
    ]
    expect(answers.length).toEqual(3)
    expect(answers[0]).toEqual(expect0)
    expect(answers[1]).toEqual(expect1)
    expect(answers[2]).toEqual(expect2)
  })

  test('solve complex problems', () => {
    let boardMaps = [
      true, true, true, true, false,
      true, true, true, true, true,
      true, true, true, true, true,
      false, true, true, true, true,
      false, true, true, true, true,
    ]
    let board = new Polyomino.Piece(5, 5, boardMaps)

    let piece0Maps = [
      true, true,
      true, false,
      true, true,
      false, true,
    ]
    let piece1Maps = [
      false, true, true,
      true, true, true,
      false, true, false,
    ]
    let piece2Maps = [
      false, false, true,
      false, true, true,
      true, true, false,
    ]
    let piece3Maps = [
      false, false, false, true,
      true, true, true, true,
    ]

    let pieces = [
      new Polyomino.Piece(2, 4, piece0Maps),
      new Polyomino.Piece(3, 3, piece1Maps),
      new Polyomino.Piece(3, 3, piece2Maps),
      new Polyomino.Piece(4, 2, piece3Maps),
    ]

    let solver = new Polyomino.Solver(board, pieces)
    let answers = solver.solve()

    let expect0 = [
      0, 0, 1, 1, -1,
      0, 1, 1, 1, 2,
      0, 0, 1, 2, 2,
      -1, 0, 2, 2, 3,
      -1, 3, 3, 3, 3,
    ]
    expect(answers[0]).toEqual(expect0)
  })
})

describe('Polyomino ToHeader tests', () => {
  test('toHeader', () => {
    let maps = [0, 1, 5]

    let header = Polyomino.ToHeader(1, maps)
    expect(header.x).toBe(-1)
    expect(header.right.x).toBe(0)
    expect(header.right.right.x).toBe(1)
    expect(header.right.right.right.x).toBe(5)
  })
})

describe('Polyomino ToNumber tests', () => {
  test('ToNumber', () => {
    let maps0 = [0, 1, 3]
    let maps1 = [2, 4]

    let headers = [
      Polyomino.ToHeader(0, maps0),
      Polyomino.ToHeader(1, maps1)
    ]

    let board = new Polyomino.Piece(2, 2, [true, false, true, true])

    let answerMaps = Polyomino.ToNumber(headers, board)
    expect(answerMaps).toEqual([0, -1, 0, 1])
  })
})

describe('Polyomino GetUniquePieces tests', () => {
  test('GetUniquePieces', () => {
    let piece0_0 = new Polyomino.Piece(1, 1, [true])
    let piece0_1 = new Polyomino.Piece(2, 1, [true, true])
    let piece0_2 = new Polyomino.Piece(1, 1, [true])
    let piece0_3 = new Polyomino.Piece(2, 1, [true, true])
    let piece0_4 = new Polyomino.Piece(2, 1, [true, true])
    let piece0_5 = new Polyomino.Piece(2, 1, [true, true])
    let piece0_6 = new Polyomino.Piece(2, 1, [true, true])

    let pieces = new Array<Polyomino.Piece>()
    pieces.push(piece0_0)
    pieces.push(piece0_1)
    pieces.push(piece0_2)
    pieces.push(piece0_3)
    pieces.push(piece0_4)
    pieces.push(piece0_5)
    pieces.push(piece0_6)

    Polyomino.GetUniquePieces(pieces)
    expect(pieces.length).toEqual(2)
    expect(pieces[0].equal(piece0_0)).toEqual(true)
    expect(pieces[1].equal(piece0_1)).toEqual(true)
  })
})