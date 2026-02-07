---
title: MVP Implementation Plan for mado
status: proposed
draft_status: n/a
created_at: 2026-02-07
updated_at: 2026-02-07
references:
  - "_docs/draft/requirements.md"
  - "_docs/draft/direction.md"
  - "_docs/standards/documentation_guidelines.md"
related_issues: []
related_prs: []
---

## Overview
- 本計画は、`_docs/draft/requirements.md` と `_docs/draft/direction.md` に定義された要件を満たすためのMVP実装手順を定義する。
- 目標は「美しいUI」と「必要最小限の情報集約」を両立した、Cloudflare Pages上で動作する実用ダッシュボードの完成である。
- 実装は「コア機能を先に成立させる」方針で、依存度の低い領域から段階的に進める。

## Scope
- フロントエンド基盤（React + TypeScript + Vite + Tailwind CSS）と、グラスモーフィズムを中心としたUIシステムの構築。
- ウィジェット基盤（カード、配置、再配置、設定保存）と `react-grid-layout` の導入。
- MVP対象ウィジェットの実装:
  - 時計（JST/日付）
  - Google検索
  - クイックランチャー（単体リンク/タブ付きリンク集）
  - 天気予報（Functions経由）
  - URLステータス監視（Functions経由）
  - Google Tasks閲覧（OAuth + Cookie暗号化 + Functions）
- Cloudflare Pages FunctionsによるAPIプロキシ層の実装（天気、監視、認証、Tasks取得）。
- LocalStorageでのレイアウト/設定保存、およびOAuthトークンのHttpOnly Cookie運用。

## Non-Goals
- Google Tasksへの書き込みや、外部サービスへの双方向操作。
- 位置情報ベースの自動切替・高度なパーソナライゼーション。
- Vimライクなキー操作を前提としたUI。
- MVP段階での過度な技術的挑戦（新規フレームワーク導入、大規模な独自基盤開発）。

## Requirements
- **Functional**:
  - ダッシュボード初期表示時に、コアウィジェット（時計、検索、ランチャー）が利用可能であること。
  - ユーザーがウィジェットをドラッグ&ドロップで再配置し、設定を永続化できること。
  - 天気情報とURLステータスをFunctions経由で取得し、UIに反映できること。
  - Google OAuthログイン後、指定タスクリストの未完了タスクを読み取り専用で表示できること。
  - Access Token期限切れ時にRefresh Tokenで更新し、継続してデータ取得できること。
- **Non-Functional**:
  - OAuthトークンはフロントエンドへ保存せず、暗号化済みHttpOnly Cookieのみで管理すること。
  - Cookieは `HttpOnly`, `Secure`, `SameSite=Strict` を満たすこと。
  - `SESSION_SECRET` を環境変数で管理し、リポジトリに含めないこと。
  - 主要ブラウザのデスクトップ表示で破綻しないこと、モバイルでも基本操作が成立すること。
  - 初期表示の体感速度を重視し、不要な依存を追加しないこと（Google公式SDKは不採用）。

## Tasks
1. **基盤準備**
   - プロジェクト構成・デザイントークン・共通レイアウトを整備する。
   - Widgetコンテナと共通UI（ヘッダー、検索入力、カード）を実装する。
2. **レイアウト基盤の実装**
   - `react-grid-layout` を導入し、ドラッグ/リサイズ/配置保存の最小機能を実装する。
   - LocalStorageにレイアウトとウィジェット設定を保存・復元する。
3. **コアウィジェット実装**
   - 時計、検索、ランチャー（単体リンク・タブ）を実装する。
   - 最小限の設定UI（リンク編集、タブ名変更）を用意する。
4. **Functions（非認証）実装**
   - 天気取得API（Open-Meteo想定）を実装し、CORS問題を回避する。
   - URLステータス監視APIを実装し、タイムアウト/失敗時の扱いを定義する。
5. **OAuth/Tasks連携実装**
   - `/api/auth/login`, `/api/auth/callback`, `/api/tasks` を実装する。
   - Cookie暗号化/復号化（Web Crypto API + AES-GCM）を実装する。
   - トークン更新処理とエラーハンドリング（再ログイン誘導）を実装する。
6. **品質仕上げ**
   - 例外時UI（ローディング、エラー、空状態）を全ウィジェットに適用する。
   - アクセシビリティ（キーボード操作、ラベル、コントラスト）を最低限確認する。
   - READMEおよび関連ドキュメントを更新し、導入手順と制約を明記する。

## Test Plan
- **Unit Test**:
  - 日付/時刻フォーマット、設定保存ロジック、トークン暗号化ユーティリティを検証する。
- **Integration Test**:
  - Functionsエンドポイント（天気、監視、認証、Tasks）の正常系/異常系を検証する。
  - トークン期限切れ時のリフレッシュ動作を検証する。
- **UI Test (Manual + E2E最小)**:
  - 初期表示、ウィジェット移動、設定保存復元、検索遷移を確認する。
  - OAuthログインからTasks表示までの一連の導線を確認する。
- **Security Check**:
  - Cookie属性（HttpOnly/Secure/SameSite）と秘密情報の露出がないことを確認する。
  - フロントエンドにトークンが保存されていないことを確認する。

## Deployment / Rollout
- **環境準備**:
  - Cloudflare Pagesに必要な環境変数（`SESSION_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` など）を設定する。
  - Google Cloud Console側でOAuth同意画面とリダイレクトURIを設定する。
- **リリース手順**:
  - mainブランチへのマージ後、Pagesデプロイを実行する。
  - デプロイ後に手動スモークテスト（コアウィジェット、天気、監視、OAuth）を行う。
- **監視と運用**:
  - Functionsログで認証失敗率、外部API失敗率、レイテンシを確認する。
  - エラー増加時は一時的に該当ウィジェットをフェイルセーフ表示へ切り替える。
- **Rollback方針**:
  - 重大障害時は直前の安定デプロイへロールバックする。
  - OAuth関連障害時はTasks機能のみ無効化し、他ウィジェットは継続提供する。
