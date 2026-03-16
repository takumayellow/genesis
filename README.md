# DevClub - Genesis

**Web開発サークルの新入生が「貢献できた」と実感できるオンボーディングSaaS。AIがGitHub IssueをマイクロステップへAI分解し、成長実感・貢献実感・没頭感を提供します。**

---

## 主要機能

- **AI タスク分解**: GitHub Issue を Gemini API が極小ステップに自動分解し、初心者でも詰まらない粒度のタスクを生成
- **インタラクティブなタスク実行**: ステップごとのチェックボックス・コードレビュー・ターミナルガイドで「できた」体験を積み重ねる
- **進捗の可視化**: アクティビティタイムライン・実績トースト・コンフェッティアニメーションで成長を祝う
- **コマンドパレット**: キーボードショートカット（`Cmd+K`）でプロジェクト・タスク間をすばやく移動
- **管理者ダッシュボード**: メンバーの進捗管理・プロジェクト作成・GitHub Issue 連携を一元管理
- **学習モジュール**: プロジェクトに合わせた学習コンテンツをマークダウンエディタで配信
- **GitHub OAuth ログイン**: Firebase Authentication による安全なソーシャルログイン

---

## スクリーンショット

> **Note**: スクリーンショットは近日追加予定です。

| ダッシュボード | タスク実行 | 管理者画面 |
|:-:|:-:|:-:|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Task](docs/screenshots/task.png) | ![Admin](docs/screenshots/admin.png) |

---

## セットアップ手順

### 必要環境

- Node.js 20 以上
- npm 10 以上
- Firebase プロジェクト（Authentication + Firestore を有効化）
- Google AI Studio の Gemini API キー
- GitHub Personal Access Token

### インストール

```bash
git clone https://github.com/takumayellow/genesis.git
cd genesis
npm install
```

### 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local` を開き、以下の値を設定してください：

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# GitHub
GITHUB_TOKEN=your_github_personal_access_token
```

#### Firebase のセットアップ

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクトを作成
2. Authentication > Sign-in method で **GitHub** を有効化
3. Firestore Database を作成（本番モードを推奨）
4. プロジェクト設定からウェブアプリの認証情報を取得

### 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開いてください。

### ビルド

```bash
npm run build
npm run start
```

---

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript 5 |
| スタイリング | Tailwind CSS 4 |
| 認証・DB | Firebase Authentication + Firestore |
| AI | Google Gemini API (`@google/generative-ai`) |
| 外部連携 | GitHub REST API |
| アニメーション | framer-motion |
| マークダウン | react-markdown + remark-gfm, @uiw/react-md-editor |
| アイコン | lucide-react |
| デプロイ | Vercel (東京リージョン `hnd1`) |

---

## ルート構成

```
/login                          # GitHub ログイン
/                               # ダッシュボード（プロジェクト一覧・アクティビティ）
/admin/new                      # プロジェクト作成
/[project]                      # プロジェクトダッシュボード
/[project]/onboarding           # 環境構築ガイド
/[project]/tasks/[taskId]       # タスク実行画面（コア機能）
/[project]/admin                # メンバー進捗管理
/[project]/admin/new            # GitHub Issue からタスク生成
/[project]/admin/onboarding     # オンボーディング設定
/[project]/learn                # 学習モジュール一覧
/[project]/learn/[moduleId]     # 学習モジュール詳細
```

---

## コントリビュート方法

1. このリポジトリをフォーク
2. フィーチャーブランチを作成: `git checkout -b feat/your-feature`
3. 変更をコミット: `git commit -m "feat: add your feature"`
4. ブランチをプッシュ: `git push origin feat/your-feature`
5. Pull Request を作成

### 開発ルール

- コミットメッセージは [Conventional Commits](https://www.conventionalcommits.org/) に準拠
- PR 作成前に `npm run lint` と `npx tsc --noEmit` がパスすることを確認
- CI（GitHub Actions）が全てグリーンであることを確認してからマージ

### ブランチ命名規則

| プレフィックス | 用途 |
|---|---|
| `feat/` | 新機能 |
| `fix/` | バグ修正 |
| `docs/` | ドキュメント |
| `refactor/` | リファクタリング |
| `chore/` | その他のメンテナンス |

---

## ライセンス

このプロジェクトはハッカソン用のプロトタイプです。
