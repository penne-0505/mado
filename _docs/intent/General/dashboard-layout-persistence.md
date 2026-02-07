---
title: Dashboard Layout Persistence Intent
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

## Context
- General-Feat-6 では、Widget の配置変更・リサイズ・再読み込み後の復元を MVP の必須要件としている。
- General-Feat-5 時点の `WidgetGrid` は Tailwind の固定グリッドで、配置の入れ替えや永続化を扱えない。
- 後続タスク（General-Feat-7 以降）では Widget 数や種類が増えるため、破綻しにくい保存フォーマットと breakpoint 運用が必要。

## Decision
- `WidgetGrid` を `react-grid-layout` ベースへ置換し、`items` と `defaultLayouts` を受け取る API に変更する。
- breakpoint は `xl` / `md` / `sm`（3 / 2 / 1 列）で統一し、全 Widget に `id` を付与してレイアウトキーに使う。
- 保存先は LocalStorage（キー: `mado.dashboard.layouts.v1`）とし、読み込み時に `defaultLayouts` 基準で正規化してから反映する。

## Alternatives
- 自前 D&D 実装（Pointer Events + CSS Grid）で構築する。
  - 不採用理由: 実装/検証コストが高く、MVP の範囲を超える。
- `WidgetCard` 側で個別に位置情報を管理し、`WidgetGrid` は単純コンテナのまま維持する。
  - 不採用理由: レイアウト責務が分散し、Widget 増加時に状態同期が破綻しやすい。

## Rationale
- `react-grid-layout` は drag/resize と breakpoint レイアウト管理を一体で扱えるため、MVP の実装速度と安定性を両立できる。
- 保存データをそのまま信頼せずに正規化することで、将来の Widget 追加・削除や不正データ混入時の壊れ方を限定できる。
- `WidgetCard` API を維持し、見た目と内容の責務を既存実装から継承できる。

## Consequences / Impact
- `src/components/layout/WidgetGrid.tsx` にレイアウト正規化と LocalStorage 永続化ロジックが集約される。
- `src/App.tsx` で `widgetItems` と `defaultWidgetLayouts` を定義する構造になり、Widget 追加手順が明確化される。
- UI 側はカードヘッダーをドラッグハンドルとして扱うため、操作ルールが統一される。

## Rollback / Follow-ups
- ロールバック時は `WidgetGrid` を旧実装（固定 CSS Grid）へ戻し、`widgetItems/defaultWidgetLayouts` を直接描画に戻す。
- Follow-up として General-Feat-7 で Widget 追加時の `defaultWidgetLayouts` 更新ルールをガイドへ追記し、運用コストを下げる。
