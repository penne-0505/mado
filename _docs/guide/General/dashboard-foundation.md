---
title: Dashboard Foundation Guide
status: active
draft_status: n/a
created_at: 2026-02-07
updated_at: 2026-02-07
references:
  - "_docs/plan/General/mvp-dashboard/plan.md"
  - "_docs/reference/General/dashboard-foundation.md"
related_issues: []
related_prs: []
---

## Overview
- 本ガイドは General-Feat-5/6 で導入したダッシュボード基盤（共通カード、ドラッグ可能レイアウト、最小再利用部品）の使い方を示す。
- 対象は「新しい Widget を追加したい実装者」。見た目や状態表示の統一を維持することを目的とする。

## Prerequisites
- Node.js 18 以上
- npm 9 以上

## Setup / Usage
- 依存関係インストール:

```bash
npm install
```

- 開発サーバ起動:

```bash
npm run dev
```

- 新しい Widget を追加する基本手順:
  1. `src/widgets/` にウィジェット本体を追加する。
  2. `src/App.tsx` の `widgetItems` に `id` と `WidgetCard` を追加する。
  3. `src/App.tsx` の `defaultWidgetLayouts`（`xl`/`md`/`sm`）に同じ `id` の初期座標とサイズを定義する。
  4. `status` を `ready` / `loading` / `error` のいずれかに設定し、必要なら `actions` に `Button` を渡す。
  5. 画面上でドラッグ/リサイズ後に再読み込みし、LocalStorage復元が効くことを確認する。

## Best Practices
- レイアウト責務（列数・余白）は `WidgetGrid` と `WidgetCard` に集約し、各 Widget では内容表示に専念する。
- 入力とボタンは `TextInput` / `Button` を優先し、視覚的一貫性を保つ。
- 配色やガラス表現の変更は `src/styles/index.css` のデザイントークンを更新して行う。
- `react-grid-layout` の挙動を安定させるため、Widget 側で絶対配置スタイルや固定ピクセル高さを持たせない。

## Troubleshooting
- 文字が読みにくい場合:
  - `src/styles/index.css` の `--color-ink` と背景グラデーションのコントラストを調整する。
- カードの横幅が期待と異なる場合:
  - `src/App.tsx` の `defaultWidgetLayouts` にある該当 `id` の `w`（幅）と `x`（列開始位置）を確認する。
- レイアウトが崩れて戻せない場合:
  - ブラウザコンソールで `localStorage.removeItem("mado.dashboard.layouts.v1")` を実行して保存済みレイアウトを初期化する。
- ビルド時に型エラーが出る場合:
  - `npm run lint` で型エラー箇所を先に解消してから `npm run build` を実行する。

## References
- 実装計画: `_docs/plan/General/mvp-dashboard/plan.md`
- コンポーネント仕様: `_docs/reference/General/dashboard-foundation.md`
- 実装意図: `_docs/intent/General/dashboard-foundation.md`
- レイアウト永続化意図: `_docs/intent/General/dashboard-layout-persistence.md`
