# mado

mado は、ブラウザのホームページ（スタートページ）向けに設計した、軽量でカスタマイズ可能なダッシュボードアプリです。

## Current Status

- General-Feat-5/6 を実装済み（基盤UI + ドラッグ&ドロップレイアウト + LocalStorage永続化）
- `react-grid-layout` ベースで、配置変更・リサイズ・再読み込み時のレイアウト復元が可能
- 次段（General-Feat-7）としてコアウィジェット機能の拡張（設定UI含む）を予定

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
- レイアウト永続化の実装意図: `_docs/intent/General/dashboard-layout-persistence.md`
