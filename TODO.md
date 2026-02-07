# Project Task Management Rules

## 0. System Metadata
- **Current Max ID**: `Next ID No: 11` (※タスク追加時にインクリメント必須)
- **ID Source of Truth**: このファイルの `Next ID No` 行が、全プロジェクトにおける唯一のID発番元である。

## 1. Task Lifecycle (State Machine)
タスクは以下の順序で単方向に遷移する。逆行は原則禁止とする。

### Phase 0: Inbox (Human Write-only)
- **Location**: `# Inbox (Unsorted)` セクション
- **Description**: 人間がアイデアや依頼を書き殴る場所。フォーマット不問。ID未付与。
- **Exit Condition**: LLMが内容を解析し、IDを付与して `Backlog` へ構造化移動する。

### Phase 1: Backlog (Structured)
- **Location**: `# Backlog` セクション
- **Status**: タスクとして認識済みだが、着手準備未完了。
- **Entry Criteria**: 
  - IDが一意に採番されている。
  - 必須フィールド（Title, ID, Priority, Size, Area, Description）が埋まっている。
- **Exit Condition**: `Ready` の要件を満たす。

### Phase 2: Ready (Actionable)
- **Location**: `# Ready` セクション
- **Status**: いつでも着手可能な状態。
- **Entry Criteria**:
  - **Plan Requirement**:
    - `Size: M` 以上 (M, L, XL): `Plan` フィールドに有効な `_docs/plan/...` へのリンクが**必須**。
    - `Size: S` 以下 (XS, S): `Plan` は **None** でよい。
  - **Dependencies**: 解決済み（または明確化済み）である。
  - **Steps**: 具体的な実行手順（またはPlanへのポインタ）が記述されている。
- **Exit Condition**: 作業者がタスクに着手する。

### Phase 3: In Progress
- **Location**: `# In Progress` セクション
- **Status**: 現在実行中。
- **Entry Criteria**: 作業者がアサインされている（または自律的に着手）。

### Phase 4: Done
- **Location**: なし（行削除）
- **Exit Action**: `Goal` 達成を確認後、リストから物理削除する。

## 2. Schema & Validation
各タスクは以下の厳格なスキーマに従うこと。

| Field | Type | Constraint / Value Set |
| :--- | :--- | :--- |
| **Title** | `String` | `[Category] Title` 形式。Categoryは後述のEnum参照。 |
| **ID** | `String` | `{Area}-{Category}-{Number}` 形式。不変の一意キー。 |
| **Priority** | `Enum` | `P0` (Critical), `P1` (High), `P2` (Medium), `P3` (Low) |
| **Size** | `Enum` | `XS` (<0.5d), `S` (1d), `M` (2-3d), `L` (1w), `XL` (>2w) |
| **Area** | `Enum` | `_docs/plan/` 直下のディレクトリ名と一致する値。 |
| **Dependencies**| `List<ID>`| 依存タスクIDの配列 `[Core-Feat-1, UI-Bug-2]`。なしは `[]`。 |
| **Goal** | `String` | 完了条件（Definition of Done）。 |
| **Steps** | `Markdown` | 進行管理用のチェックリスト（詳細は後述）。 |
| **Description** | `String` | タスクの詳細。 |
| **Plan** | `Path` | `Size >= M` の場合必須。`_docs/plan/` へのパス。`Size < M` は `None` 可。 |

## 3. Field Usage Guidelines

### Area & Directory Mapping
- **Rule**: `Area` フィールドの値は、`_docs/plan/` 直下に実在するディレクトリ名（ドメイン）と一致させること。
- **New Area**: 新しい領域のタスクを作成する場合、まず `_docs/plan/` にディレクトリを作成してから、その名前を `Area` に指定する。
- **Example**: `Area: Core` -> implies existence of `_docs/plan/Core/`

### Steps vs Plan
タスクの規模に応じて `Steps` の記述方針を切り替えること。情報の二重管理を避ける。

- **Case A: Planあり (Size >= M)**
  - `Steps` は **「Planを実行するための進行管理チェックリスト」** として機能する。
  - 詳細な仕様やコードは Plan に記述し、Steps には複製しない。
  - 例: `1. [ ] Planの "DB Schema" セクションに従いマイグレーション作成`

- **Case B: Planなし (Size < M)**
  - `Steps` に **「具体的な作業手順」** を直接記述する。
  - 例: `1. [ ] src/utils/format.ts の dateFormat 関数を修正`

## 4. Defined Enums

### Categories (Title & ID)
ID生成およびタイトルのプレフィックスには以下のみを使用する。
- `Feat` (New Feature)
- `Enhance` (Improvement)
- `Bug` (Fix)
- `Refactor` (Code Structuring)
- `Perf` (Performance)
- `Doc` (Documentation)
- `Test` (Testing)
- `Chore` (Maintenance/Misc)

### Areas (Examples)
**※実際には `_docs/plan/` のディレクトリ構成に従う。**
- `Core`: 基盤ロジック
- `UI`: プレゼンテーション層
- `Docs`: ドキュメント整備自体
- `General`: 特定ドメインに属さない雑多なタスク
- `DevOps`: CI/CD, 環境構築

## 5. Operational Workflows (for LLM)

### [Action] Create Task from Inbox
1. `Next ID No` を読み取り、割り当て予定のIDを決定する。
2. `Next ID No` をインクリメントしてファイルを更新する。
3. Inboxの内容を解析し、最適な `Area` と `Category` を決定する。
4. IDを生成する（例: `Core-Feat-24`）。
5. タスクをフォーマットし、`Backlog` の末尾に追加する。
6. 元のInbox行を削除する。

### [Action] Promote to Ready
1. **Size check**:
   - `Size >= M` ならば、`Plan` フィールドが有効なリンクであることを検証する。リンク切れや未作成の場合は移動を拒否する。
   - `Size < M` ならば、`Plan` が `None` でも許容する。
2. **Steps check**: `Steps` が具体的か（あるいはPlanへのポインタとして機能しているか）確認する。
3. **Dependency check**: 依存タスクが完了済みか確認する。
4. 全てクリアした場合のみ `Ready` セクションへ移動する。

## 6. Task Definition Examples (Few-Shot)

以下の例を参考に、サイズ（Size）に応じた記述ルール（Planの有無、Stepsの粒度）を厳守すること。

### Case A: Feature Implementation (Size >= M)
**Rule**: `Plan` へのリンクが必須。`Steps` はPlanの参照ポインタとして記述する。

```markdown
- **Title**: [Feat] User Authentication Flow
- **ID**: Core-Feat-25
- **Priority**: P0
- **Size**: M
- **Area**: Core
- **Dependencies**: []
- **Goal**: ユーザーがEmail/Passwordでサインアップおよびログインできる状態にする。
- **Steps**:
  1. [ ] Planの "Schema Design" セクションに基づき、Userテーブルのマイグレーションを作成・適用
  2. [ ] Planの "API Specification" に従い、`/auth/login` エンドポイントを実装
  3. [ ] Planの "Security" に記載されたJWT発行ロジックを実装
  4. [ ] E2Eテストを実施し、ログインフローの疎通を確認
- **Description**: 新規サービスの基盤となる認証機能を実装する。
- **Plan**: `_docs/plan/Core/auth-feature.md`
````

### Case B: Small Fix / Maintenance (Size \< M)

**Rule**: `Plan` は `None` でよい。`Steps` に具体的なコード修正手順を記述する。

```markdown
- **Title**: [Bug] Fix typo in Submit button
- **ID**: UI-Bug-26
- **Priority**: P2
- **Size**: XS
- **Area**: UI
- **Dependencies**: []
- **Goal**: ログイン画面のボタンのラベルが "Subimt" から "Submit" に修正されている。
- **Steps**:
  1. [ ] `src/components/LoginForm.tsx` を開く
  2. [ ] Submitボタンのラベル文字列を修正する
  3. [ ] ブラウザで表示を確認し、レイアウト崩れがないか確認
- **Description**: ユーザーから報告された誤字の修正。
- **Plan**: None
```

### Case C: New Area / Doc Task (Size S)

**Rule**: 新しいAreaが必要な場合、ディレクトリ作成を含む。

```markdown
- **Title**: [Doc] Add Deployment Guide
- **ID**: DevOps-Doc-27
- **Priority**: P1
- **Size**: S
- **Area**: DevOps
- **Dependencies**: [Core-Feat-25]
- **Goal**: 新メンバー向けのデプロイ手順書が `_docs/guide/deployment.md` に作成されている。
- **Steps**:
  1. [ ] `_docs/plan/DevOps/` ディレクトリが存在しないため作成する (Area定義用)
  2. [ ] `_docs/guide/deployment.md` を作成し、ステージング環境へのデプロイ手順を記述
- **Description**: オンボーディングコスト削減のため、暗黙知になっているデプロイ手順をドキュメント化する。
- **Plan**: None
```

--- 

## Inbox
- 

---

## Backlog

- **Title**: [Chore] Customize Issue Templates Area sections
- **ID**: Docs-Chore-1
- **Priority**: P1
- **Size**: S
- **Area**: Docs
- **Dependencies**: []
- **Goal**: `.github/ISSUE_TEMPLATE/bug_report.yml` と `.github/ISSUE_TEMPLATE/feature_request.yml` の "Area" セクションがプロジェクトに適した内容に変更されている。
- **Steps**:
  1. [ ] `.github/ISSUE_TEMPLATE/bug_report.yml` を開き、"Area" セクションを確認
  2. [ ] プロジェクトに適した領域名に変更
  3. [ ] `.github/ISSUE_TEMPLATE/feature_request.yml` を開き、同様に変更
  4. [ ] 変更内容を検証
- **Description**: GitHub Issueテンプレートの"Area"セクションを、プロジェクト固有の内容にカスタマイズする。
- **Plan**: None

- **Title**: [Chore] Review and customize AGENTS.md
- **ID**: Docs-Chore-2
- **Priority**: P2
- **Size**: XS
- **Area**: Docs
- **Dependencies**: []
- **Goal**: `AGENTS.md` がプロジェクトのニーズに応じて必要に応じて編集されている。
- **Steps**:
  1. [ ] `AGENTS.md` を開き、既存の内容を確認
  2. [ ] 必要に応じて編集（特定コマンドの使用指示など）
  3. [ ] 変更を保存
- **Description**: AGENTS.mdをレビューし、プロジェクトの要件に応じてカスタマイズする。
- **Plan**: None

- **Title**: [Chore] Customize README.md for project
- **ID**: Docs-Chore-3
- **Priority**: P0
- **Size**: S
- **Area**: Docs
- **Dependencies**: []
- **Goal**: `README.md` がプロジェクトの概要、目的、使用方法に合わせて編集されている。
- **Steps**:
  1. [ ] 現在のREADME.mdを確認
  2. [ ] プロジェクト名、概要、説明をプロジェクトに合わせて書き換え
  3. [ ] 使用方法セクションを編集
  4. [ ] 不要なテンプレート固有の記述を削除または修正
  5. [ ] 変更を保存
- **Description**: README.mdをテンプレートからプロジェクト固有の内容に書き換える。
- **Plan**: None

- **Title**: [Chore] Update LICENSE.txt author attribution
- **ID**: Docs-Chore-4
- **Priority**: P2
- **Size**: XS
- **Area**: Docs
- **Dependencies**: []
- **Goal**: `LICENSE.txt` の著作者名が正しいものに編集されている。
- **Steps**:
  1. [ ] `LICENSE.txt` を開き、著作者名を確認
  2. [ ] 正しい著作者名に編集
  3. [ ] 変更を保存
- **Description**: LICENSEファイルの著作者表示をプロジェクトに合わせて更新する。
- **Plan**: None

---

## Ready

- **Title**: [Feat] Build dashboard foundation and design system
- **ID**: General-Feat-5
- **Priority**: P0
- **Size**: M
- **Area**: General
- **Dependencies**: []
- **Goal**: React + TypeScript + Tailwind を前提に、MVPの共通レイアウトとWidgetコンテナ基盤が実装されている。
- **Steps**:
  1. [x] Planの「Tasks > 1. 基盤準備」に従い、共通レイアウトとデザイントークンを整備
  2. [x] Widgetカードの共通UI（見た目・余白・状態表示の枠組み）を実装
  3. [x] 今後のウィジェット実装で再利用する最小コンポーネント群を作成
- **Description**: MVP実装の前提となるUI/構成の土台を作る。
- **Plan**: `_docs/plan/General/mvp-dashboard/plan.md`

- **Title**: [Feat] Implement draggable layout and persistence
- **ID**: General-Feat-6
- **Priority**: P0
- **Size**: M
- **Area**: General
- **Dependencies**: [General-Feat-5]
- **Goal**: ウィジェットのドラッグ&ドロップ配置とLocalStorageによる保存/復元が動作している。
- **Steps**:
  1. [x] Planの「Tasks > 2. レイアウト基盤の実装」に従い `react-grid-layout` を導入
  2. [x] 配置変更・リサイズ・初期レイアウト復元の挙動を実装
  3. [x] LocalStorageへの保存/読み込みを組み込み、再読み込み後の状態復元を確認
- **Description**: ダッシュボードの中核となる配置管理機能を実装する。
- **Plan**: `_docs/plan/General/mvp-dashboard/plan.md`

- **Title**: [Feat] Implement core widgets for MVP
- **ID**: General-Feat-7
- **Priority**: P0
- **Size**: M
- **Area**: General
- **Dependencies**: [General-Feat-6]
- **Goal**: 時計・検索・クイックランチャー（単体リンク/タブ）をMVP要件どおり利用できる。
- **Steps**:
  1. [ ] Planの「Tasks > 3. コアウィジェット実装」に従い、時計/検索/ランチャーを実装
  2. [ ] ランチャーの最小設定UI（リンク編集・タブ名変更）を実装
  3. [ ] レイアウト基盤と連携し、追加したウィジェットを実際に配置・利用できる状態にする
- **Description**: API依存のないコア機能を先に完成させ、MVPの利用価値を成立させる。
- **Plan**: `_docs/plan/General/mvp-dashboard/plan.md`

- **Title**: [Feat] Add weather and URL status Functions
- **ID**: General-Feat-8
- **Priority**: P1
- **Size**: M
- **Area**: General
- **Dependencies**: [General-Feat-7]
- **Goal**: 天気情報とURLステータス監視をCloudflare Pages Functions経由で取得・表示できる。
- **Steps**:
  1. [ ] Planの「Tasks > 4. Functions（非認証）実装」に従い、天気APIプロキシを実装
  2. [ ] URLステータス監視API（HEAD/GET、タイムアウト時の扱い含む）を実装
  3. [ ] フロントエンドの各ウィジェットとFunctionsを接続し、正常/異常表示を確認
- **Description**: 外部情報を安全に取得する非認証Functionsと対応ウィジェットを実装する。
- **Plan**: `_docs/plan/General/mvp-dashboard/plan.md`

- **Title**: [Feat] Implement Google OAuth and Tasks viewer
- **ID**: General-Feat-9
- **Priority**: P0
- **Size**: L
- **Area**: General
- **Dependencies**: [General-Feat-8]
- **Goal**: OAuthログインからGoogle Tasks未完了タスク表示までの一連のフローがHttpOnly Cookie運用で成立している。
- **Steps**:
  1. [ ] Planの「Tasks > 5. OAuth/Tasks連携実装」に従い `/api/auth/login` `/api/auth/callback` `/api/tasks` を実装
  2. [ ] AES-GCMによるCookie暗号化/復号化とトークン更新処理を実装
  3. [ ] フロントエンドからTasks表示を接続し、期限切れ時の再認証導線を整備
- **Description**: MVPの最難所である認証連携とTasks閲覧機能をセキュアに実装する。
- **Plan**: `_docs/plan/General/mvp-dashboard/plan.md`

- **Title**: [Test] Validate MVP quality and rollout readiness
- **ID**: General-Test-10
- **Priority**: P1
- **Size**: M
- **Area**: General
- **Dependencies**: [General-Feat-9]
- **Goal**: Test Planに沿った検証が完了し、デプロイ可能な品質であることを確認できている。
- **Steps**:
  1. [ ] Planの「Test Plan」に従い Unit/Integration/UI/Security 観点を検証
  2. [ ] Planの「Deployment / Rollout」に従い環境変数・手動スモークテスト手順を整備
  3. [ ] 発見した不具合の修正または既知課題化を行い、リリース判定を記録
- **Description**: MVPを安全に公開するため、品質確認とリリース前チェックを完了させる。
- **Plan**: `_docs/plan/General/mvp-dashboard/plan.md`

---

## In Progress
