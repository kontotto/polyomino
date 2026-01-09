# @kontotto/polyomino

ポリオミノパズルを解くためのTypeScript/JavaScriptライブラリ。Dancing Linksアルゴリズムを使用して、指定されたボードに複数のピースを配置する全ての解を効率的に見つけます。

## インストール

```bash
npm install @kontotto/polyomino
```

## 使い方

### 基本的な使用例

```typescript
import { Polyomino } from '@kontotto/polyomino';

// 3x3のボード（右上が空白）
//   ■ ■ □
//   ■ ■ ■
//   ■ ■ ■
const board = new Polyomino.Piece(3, 3, [
  true, true, false,
  true, true, true,
  true, true, true,
]);

// 3つのピース
const pieces = [
  // ピース0: 2x2の正方形
  //   ■ ■
  //   ■ ■
  new Polyomino.Piece(2, 2, [true, true, true, true]),

  // ピース1: 横長の2マス
  //   ■ ■
  new Polyomino.Piece(2, 1, [true, true]),

  // ピース2: 縦長の2マス
  //   ■
  //   ■
  new Polyomino.Piece(1, 2, [true, true]),
];

// ソルバーを作成して解を求める
const solver = new Polyomino.Solver(board, pieces);
const solutions = solver.solve();

console.log(`${solutions.length}個の解が見つかりました`);

// 解を表示
solutions.forEach((solution, index) => {
  console.log(`解 ${index + 1}:`, solution);
  // 例: [0, 0, -1, 0, 0, 2, 1, 1, 2]
  //   0  0  -1     ピース0が左上に配置
  //   0  0   2     ピース2が右側に配置
  //   1  1   2     ピース1が左下に配置
});
```

### オプション：回転と反転を許可

```typescript
// ピースの回転と反転を許可して、より多くの解を見つける
const solver = new Polyomino.Solver(board, pieces, {
  allowRotate: true,   // ピースの回転を許可（90°, 180°, 270°）
  allowReverse: true,  // ピースの反転（鏡像）を許可
});

const solutions = solver.solve();
console.log(`${solutions.length}個の解が見つかりました`);
```

### 非同期での解の取得

```typescript
// 長時間かかる計算を非同期で実行
const solutions: number[][] = [];
await solver.solveAsync(solutions);

console.log(`${solutions.length}個の解が見つかりました`);
```

## API

### `Polyomino.Piece`

ポリオミノのピースまたはボードを表すクラス。

#### コンストラクタ

```typescript
new Polyomino.Piece(width: number, height: number, maps: boolean[])
```

- `width`: ピースの幅
- `height`: ピースの高さ
- `maps`: ピースの形状を表すboolean配列（行優先の1次元配列）
  - `true`: マスが存在する
  - `false`: 空白

**例:**

```typescript
// L字型のピース (3x2)
//   ■ □ □
//   ■ ■ ■
const lPiece = new Polyomino.Piece(3, 2, [
  true, false, false,  // 1行目
  true, true, true,    // 2行目
]);
```

#### メソッド

- `actualSize(): number` - ピースの実際のマス数を返す
- `clone(): Piece` - ピースの複製を作成
- `contains(x: number, y: number, piece: Piece): boolean` - 指定位置にピースが配置可能かチェック
- `equal(piece: Piece): boolean` - 2つのピースが同じ形状かチェック
- `getRotatePieces(): Piece[]` - 90°, 180°, 270°回転したピースを返す
- `getReversePieces(): Piece[]` - X軸・Y軸で反転したピースを返す

### `Polyomino.Solver`

パズルを解くソルバークラス。

#### コンストラクタ

```typescript
new Polyomino.Solver(
  board: Piece,
  pieces: Piece[],
  options?: SolverOptions
)
```

- `board`: パズルのボード
- `pieces`: 配置するピースの配列
- `options`: オプション設定

#### SolverOptions

```typescript
interface SolverOptions {
  allowRotate?: boolean;   // ピースの回転を許可（デフォルト: false）
  allowReverse?: boolean;  // ピースの反転を許可（デフォルト: false）
}
```

#### メソッド

- `solve(): number[][]` - 全ての解を同期的に取得
- `solveAsync(solutions: number[][]): Promise<void>` - 全ての解を非同期的に取得

### `DancingLinks`

Dancing Linksアルゴリズムの実装。直接使用することもできますが、通常は`Polyomino.Solver`を使用することを推奨します。

## 解の形式

`solve()`や`solveAsync()`が返す解は、ボードの各マスにどのピース（インデックス）が配置されているかを示す数値の1次元配列です。

```typescript
// 例：3x3のボードの解
[
  0, 0, -1,  // 1行目：ピース0が2マス、空白が1マス
  0, 0,  2,  // 2行目：ピース0が2マス、ピース2が1マス
  1, 1,  2,  // 3行目：ピース1が2マス、ピース2が1マス
]
```

- `-1`: 空白のマス（ボードで`false`として定義された部分）
- `0以上の整数`: ピースのインデックス（`pieces`配列の順序）

## ライセンス

MIT

## 作者

Shuta Kondo

## リポジトリ

https://github.com/kontotto/polyomino

## バグ報告

https://github.com/kontotto/polyomino/issues
