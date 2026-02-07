---
title: Dashboard Foundation Reference
status: active
draft_status: n/a
created_at: 2026-02-07
updated_at: 2026-02-07
references:
  - "_docs/plan/General/mvp-dashboard/plan.md"
  - "_docs/intent/General/dashboard-foundation.md"
related_issues: []
related_prs: []
---

## Overview
- General-Feat-5 で実装したダッシュボード基盤の UI コンポーネント仕様をまとめる。
- 本ドキュメントは、General-Feat-6 以降で追加されるドラッグ配置や API 連携の土台となる共通UIのみを対象とする。

## API
### `DashboardShell`
- **Summary**: ダッシュボード全体の外枠。ヘッダー（タイトル・日付）とメイン領域を提供。
- **Parameters**: `children` (`ReactNode`) - メイン領域に描画する内容。
- **Returns**: `JSX.Element`
- **Errors**: なし
- **Examples**: `src/App.tsx` で `WidgetGrid` をラップして使用。

### `WidgetGrid`
- **Summary**: ウィジェット用レスポンシブグリッド。`1 -> 2 -> 3`カラムへ段階的に拡張。
- **Parameters**: `children` (`ReactNode`) - カード要素。
- **Returns**: `JSX.Element`
- **Errors**: なし
- **Examples**: `src/App.tsx` の各 `WidgetCard` を配置。

### `WidgetCard`
- **Summary**: Widget の共通カード外観を提供する中核コンポーネント。
- **Parameters**:
  - `title` (`string`) - カードタイトル。
  - `description` (`string`) - 補足説明。
  - `status` (`"ready" | "loading" | "error"`, optional) - 状態表示トーン。
  - `actions` (`ReactNode`, optional) - フッター操作群。
  - `children` (`ReactNode`) - 本文。
  - `className` (`string`, optional) - 追加スタイル。
  - `style` (`CSSProperties`, optional) - インラインスタイル（アニメーション遅延など）。
- **Returns**: `JSX.Element`
- **Errors**: なし
- **Examples**: `src/App.tsx` で 4 種のサンプルウィジェットに適用。

### `WidgetState`
- **Summary**: `READY` / `LOADING` / `ERROR` の状態バッジを表示。
- **Parameters**: `tone` (`"ready" | "loading" | "error"`) - 表示トーン。
- **Returns**: `JSX.Element`
- **Errors**: なし
- **Examples**: `WidgetCard` ヘッダー内で自動利用。

### `TextInput`
- **Summary**: ガラス背景前提の共通入力フィールド。
- **Parameters**: `InputHTMLAttributes<HTMLInputElement>` を透過。
- **Returns**: `JSX.Element`
- **Errors**: なし
- **Examples**: `src/widgets/SearchWidget.tsx`。

### `Button`
- **Summary**: 共通ボタン。`primary` / `ghost` のトーン切替を提供。
- **Parameters**:
  - `tone` (`"primary" | "ghost"`, optional) - ボタン種別。
  - `ButtonHTMLAttributes<HTMLButtonElement>` - 標準属性。
- **Returns**: `JSX.Element`
- **Errors**: なし
- **Examples**: `src/widgets/SearchWidget.tsx`, `src/App.tsx`。

## Notes
- デザイントークンは `src/styles/index.css` の CSS Variables（`--color-*`）で一元管理する。
- 背景グラデーションとグレイン表現は `body` と `body::before` で提供し、個別 Widget 側では重ねない。
- General-Feat-6 では `WidgetGrid` の内部実装を `react-grid-layout` へ置き換える想定だが、`WidgetCard` API は維持する。
