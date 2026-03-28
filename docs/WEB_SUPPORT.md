# ECHO LIFE — Web 対応メモ

## 対応内容
- Expo Router v3 の web 出力を有効化
- ストレージ: モバイル=MMKV / web=localStorage（lib/storage.web.tsで自動切替）
- Haptics: lib/platform.ts でweb時はno-op
- フォント: webはGoogle Fonts（+html.tsx）、モバイルはExpo Font

## 開発
- web起動: npm run web
- webビルド: npm run build:web（出力先: dist/）

## 注意点
- MMKV を直接 import する箇所は lib/storage の zustandStorage を使うこと
- expo-haptics を直接 import する箇所は lib/platform.ts のラッパーを使うこと
- new MMKV() を直接呼ぶ箇所を追加しないこと
