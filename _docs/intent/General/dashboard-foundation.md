---
title: Dashboard Foundation Design Intent
status: active
draft_status: n/a
created_at: 2026-02-07
updated_at: 2026-02-07
references:
  - "_docs/plan/General/mvp-dashboard/plan.md"
  - "_docs/draft/requirements.md"
  - "_docs/draft/direction.md"
related_issues: []
related_prs: []
---

## Context
- MVP の後続タスク（General-Feat-6 以降）では、ドラッグ配置、外部 API 連携、OAuth 連携が段階的に追加される。
- 先に UI 基盤がない状態で各 Widget を個別実装すると、見た目と責務が分散し、後工程での統合作業コストが増える。
- 要件上、Appleライクなリッチさと Glassmorphism、かつモバイルでも基本操作が成立するレスポンシブ性が必要。

## Decision
- React + TypeScript + Tailwind の最小構成を先に確立し、以下を基盤コンポーネントとして先行実装する。
  - `DashboardShell`（共通外枠）
  - `WidgetGrid`（レスポンシブ配置）
  - `WidgetCard` / `WidgetState`（状態付きカードUI）
  - `TextInput` / `Button`（再利用プリミティブ）
- 色、背景、ガラス表現は CSS Variables と共通クラス（`glass-panel`）に集約し、後続実装での UI ドリフトを防ぐ。

## Alternatives
- Widget 実装を先行し、基盤UIは後から統合する。
  - 不採用理由: 状態表示や余白ルールが分岐し、General-Feat-6/7 実装時の差し戻しが増える。
- 初期段階から `react-grid-layout` を導入する。
  - 不採用理由: General-Feat-5 の責務は基盤UIの確立であり、D&D導入を同時に行うと検証観点が混在する。

## Rationale
- 依存の少ない基盤から実装することで、後続タスクの差分を「機能追加」に集中できる。
- 共通カードとプリミティブを先に固定することで、Widget 追加時の実装速度とデザイン整合性を両立できる。
- 状態表示を共通化しておくことで、API連携時のローディング/エラー表現を統一しやすい。

## Consequences / Impact
- `src/components/` 配下に責務別ディレクトリ（`layout`, `widget`, `foundation`）を導入し、再利用単位が明確になった。
- `src/styles/index.css` にデザイントークンを配置したため、テーマ変更はトークン更新中心で実施できる。
- General-Feat-6 では `WidgetGrid` の内部置換を行っても、`WidgetCard` と個別 Widget 実装はほぼそのまま流用できる。

## Rollback / Follow-ups
- ロールバック時は `src/components/` の基盤層を保持しつつ、`src/widgets/` のサンプル実装を最小化する。
- `react-grid-layout` 導入時の `WidgetGrid` API とモバイル挙動の再検証結果は `_docs/intent/General/dashboard-layout-persistence.md` に記録する。
