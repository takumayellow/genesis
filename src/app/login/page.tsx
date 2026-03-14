"use client";

import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { isDemoMode } from "@/lib/demo-mode";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const demoMode = isDemoMode();

  const handleGitHubLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new GithubAuthProvider();
      provider.addScope("read:user");
      provider.addScope("repo");

      const result = await signInWithPopup(auth, provider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const fbUser = result.user;

      const userRef = doc(db, "users", fbUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: fbUser.uid,
          githubUsername: fbUser.displayName ?? fbUser.email ?? "unknown",
          avatarUrl: fbUser.photoURL ?? "",
          role: "member",
          githubToken: credential?.accessToken ?? "",
          createdAt: new Date(),
        });
      }

      router.push("/");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "ログインに失敗しました";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-sm flex-col items-center gap-8 rounded border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold text-black">DevClub</h1>
          <p className="text-sm text-gray-400">
            サークルの学習プラットフォームにログイン
          </p>
        </div>

        {error && (
          <div className="w-full rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {demoMode ? (
          <div className="flex w-full flex-col gap-3">
            <button
              onClick={handleDemoLogin}
              className="flex w-full items-center justify-center gap-2 rounded bg-blue-500 px-4 py-3 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
            >
              デモモードで体験
            </button>
            <button
              disabled
              className="flex w-full items-center justify-center gap-2 rounded bg-gray-900 px-4 py-3 text-sm font-medium text-white opacity-50 cursor-not-allowed"
            >
              <svg
                className="size-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHubでログイン
            </button>
            <p className="text-center text-xs text-gray-400">
              Firebase未設定のため、GitHubログインは利用できません
            </p>
          </div>
        ) : (
          <button
            onClick={handleGitHubLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            <svg
              className="size-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            {loading ? "ログイン中..." : "GitHubでログイン"}
          </button>
        )}
      </div>
    </div>
  );
}
