# mado

mado は、ブラウザのホームページ（スタートページ）向けに設計した、軽量でカスタマイズ可能なダッシュボードアプリです。

## Current Status

- General-Feat-5 として、React + TypeScript + Tailwind によるダッシュボード基盤を実装済み
- 共通レイアウト、デザイントークン、Widget カード共通UI、最小再利用コンポーネント群を提供
- 次段（General-Feat-6）でドラッグ&ドロップレイアウトと永続化を追加予定

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS

## Getting Started

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Main Structure

- `src/components/layout/`: ダッシュボード全体のレイアウト
- `src/components/widget/`: Widgetカードの共通UI
- `src/components/foundation/`: 入力・ボタンなどの最小再利用部品
- `src/widgets/`: 実際のWidget実装（現時点は基盤デモを兼ねる）
- `_docs/plan/General/mvp-dashboard/plan.md`: MVP全体計画

## Documentation

- 要件: `_docs/draft/requirements.md`
- 方向性メモ: `_docs/draft/direction.md`
- 実装計画: `_docs/plan/General/mvp-dashboard/plan.md`
- 基盤ガイド: `_docs/guide/General/dashboard-foundation.md`
- 基盤リファレンス: `_docs/reference/General/dashboard-foundation.md`
