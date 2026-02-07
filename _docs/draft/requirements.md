# プロジェクト要件定義書: mado

## 1. プロジェクト概要
**プロジェクト名:** mado (仮)
**コンセプト:** 自分専用の、美しく、カスタマイズ可能なダッシュボード。
**ゴール:** 既存のスタートページ拡張機能やサービスに依存せず、自身の美的感覚（グラスモーフィズム、Appleライクな質感）を満たすUIと、真に必要な情報のみを集約したMVP（実用最小限の製品）を構築する。

## 2. アーキテクチャ構成
**フロントエンド:**
- **フレームワーク:** React
- **言語:** TypeScript
- **ビルドツール:** Vite
- **スタイリング:** Tailwind CSS
- **グリッドライブラリ:** `react-grid-layout` (要検証)
- **UIコンポーネント:** **shadcn/ui (Radix UI)**
    - **選定理由:** アクセシビリティと機能性（Headless）を担保しつつ、スタイルをフルカスタマイズ（Glassmorphism化）できるため。
    - **使用箇所:** Tabs (ランチャー), Command (検索/ショートカット), Dialog (設定), Slider (調整など)。

**バックエンド / ホスティング:**
- **プラットフォーム:** Cloudflare Pages
- **サーバーレス機能:** Cloudflare Pages Functions
    - APIプロキシとして動作。
    - **認証ハンドラー:** OAuthのコールバック処理、トークンの暗号化/復号化を担当。
- **データ永続化:**
    - **クライアント側:** `LocalStorage` (レイアウト設定、各ウィジェットの設定)。
    - **サーバー側 (ステートレス):** **暗号化されたHTTP Cookie** (OAuthトークン)。

## 3. 実装上の制約・方針 (実装メモ)
- **Google API連携:**
    - **公式ライブラリ (`googleapis` 等) は使用しない。**
    - 理由: ライブラリのバンドルサイズが巨大であること、およびNode.js固有のモジュール依存によるCloudflare Workers環境での動作不良を避けるため。
    - 実装: OAuth 2.0のトークン交換フローおよびGoogle Tasks APIへのリクエストは、すべて標準の `fetch` APIを用いて手動で実装する。

## 4. 機能要件 (MVP)

### A. コア・ウィジェット (クライアント完結)
1.  **時計ウィジェット** (JST/日付表示)
2.  **検索ウィジェット** (Google検索クエリへのリダイレクト)
3.  **クイックランチャー / タブ付きランチャー** (静的なリンク集)

### B. 高度なウィジェット (Functions + 認証必須)
4.  **天気予報ウィジェット**
    - API: Open-Meteo (キー不要) または OpenWeather。Functions経由で取得し、CORS（クロスオリジン制約）を回避。
5.  **サーバー監視 / URLステータス**
    - Functions経由で指定URLへHEAD/GETリクエストを送信し、ステータスコード（200 OK等）のみを視覚的に返す。

6.  **Google Tasks ビューワー (読み取り専用)**
    - **表示内容:** 指定したタスクリストの未完了タスク一覧。
    - **認証フロー:**
        1. ユーザーがウィジェット上の「Googleでログイン」をクリック。
        2. `/api/auth/login` (Function) へリダイレクト。
        3. Google OAuth 同意画面へ遷移。
        4. `/api/auth/callback` (Function) へコールバック。
        5. Functionが認証コードを `Access Token` & `Refresh Token` と交換。
        6. Functionがサーバー側の秘密鍵 (`SESSION_SECRET`) を使ってトークンを暗号化。
        7. Functionが暗号化されたペイロードを含む `HttpOnly`, `Secure`, `SameSite=Strict` 属性付きCookieをセットする。
    - **データ取得フロー:**
        1. ウィジェットが `/api/tasks` をリクエスト。
        2. ブラウザが自動的にCookieを送信。
        3. FunctionがCookieを復号化し、Access Tokenを取り出す。
        4. 有効期限切れの場合、FunctionはRefresh Tokenを使って新しいAccess Tokenを取得（同時にCookieも更新）。
        5. FunctionがGoogle Tasks APIを叩き、JSONをフロントエンドに返す。

## 5. セキュリティ要件
- **トークン保存:**
    - OAuthトークン（Refresh/Access）は**絶対にフロントエンド（LocalStorage/SessionStorage）に保存しない**。
    - 必ず `HttpOnly`, `Secure` 属性付きのCookieに、暗号化された状態で保存する。
- **暗号化:**
    - 暗号化キー (`SESSION_SECRET`) はCloudflare Pagesの環境変数のみで管理し、リポジトリにはコミットしない。
    - 暗号化アルゴリズムは `AES-GCM` 等、Cloudflare Workersランタイム (`Web Crypto API`) で動作するものを選定。
- **CSRF対策:**
    - `SameSite=Strict` 属性をCookieに付与することで、CSRF（クロスサイトリクエストフォージェリ）攻撃を緩和する。

## 6. 開発フェーズ (マイルストーン)
- **フェーズ 1:** プロジェクトセットアップ & UIプロトタイプ作成（グラスモーフィズムの実装）。
- **フェーズ 2:** グリッドシステム (`react-grid-layout`) の導入と挙動検証。
- **フェーズ 3:** コア・ウィジェット & 天気/ステータス監視の実装（Functionsあり/なし混在）。
- **フェーズ 4:** **OAuth実装** (Cookie暗号化ロジック、Google Cloud Project設定)。
    - *Note:* 公式ライブラリを使わず `fetch` で実装。
- **フェーズ 5:** Google Tasks 連携の実装。