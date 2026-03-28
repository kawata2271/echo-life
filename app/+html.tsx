import { ScrollViewStyleReset } from 'expo-router/html'

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="AIが毎日生成する、もう一つの人生" />

        {/* Google Fonts (web only — mobile uses Expo Font) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,300&family=DM+Sans:wght@300;400&family=DM+Mono&family=Noto+Sans+JP:wght@300;400&display=swap"
          rel="stylesheet"
        />

        <style>{`
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: #0f0d0b; }
          ::-webkit-scrollbar-thumb { background: #2a2018; border-radius: 2px; }
          body { background: #0f0d0b; margin: 0; }
          #root { max-width: 480px; margin: 0 auto; min-height: 100vh; }
        `}</style>

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  )
}
