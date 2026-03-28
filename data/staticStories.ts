import type { EventType, EmotionTag, AudioTheme, Choice } from '../types/events'
import type { StatusDelta } from '../types/index'

export interface StaticStory {
  type: EventType
  title: string
  body: string
  emotionTag: EmotionTag
  audioTheme: AudioTheme
  statusDelta: StatusDelta
  choices: Choice[] | null
}

export const STATIC_STORIES: StaticStory[] = [
  // ────────────────────────────
  // joy (6本)
  // ────────────────────────────
  {
    // #1 joy / daily
    type: 'daily',
    title: '朝の匂い',
    body: '窓を開けると、洗いたてのシーツのような風が入ってきた。隣の家の庭で、おばあさんが水を撒いている。こちらに気づくと、小さく手を振った。コーヒーを淹れようとキッチンに立つと、豆を挽く音が部屋いっぱいに広がって、今日がまだ何色にも染まっていないことに気づく。トーストにバターを塗りながら、何となく鼻歌が出た。',
    emotionTag: 'joy',
    audioTheme: 'morning',
    statusDelta: { happiness: 3, health: 1 },
    choices: null,
  },
  {
    // #2 joy / daily
    type: 'daily',
    title: '自転車と坂道',
    body: '久しぶりに自転車を引っ張り出した。タイヤに空気を入れ、チェーンに油を差す。近所の坂道を一気に下ると、風が耳元で唸った。信号待ちで止まった瞬間、心臓がどくどくと鳴っているのが分かる。汗ばんだ手でハンドルを握り直し、青に変わった信号を見て、また強くペダルを踏んだ。',
    emotionTag: 'joy',
    audioTheme: 'afternoon',
    statusDelta: { health: 3, happiness: 2 },
    choices: null,
  },
  {
    // #3 joy / choice
    type: 'choice',
    title: '友人からの誘い',
    body: '昼休み、スマートフォンが震えた。「今夜、屋上でバーベキューやるんだけど来ない？」久しぶりの名前だった。最後に会ったのはいつだろう。返事を打とうとして、指が止まる。明日は朝が早い。でも、画面に映る短い文面の奥に、あの頃と変わらない声が聞こえた気がした。',
    emotionTag: 'joy',
    audioTheme: 'afternoon',
    statusDelta: { happiness: 2 },
    choices: [
      { id: 'c3a', text: '行く、と即答する', hint: '懐かしい再会の温かさ', delta: { happiness: 4, love: 2, health: -1 } },
      { id: 'c3b', text: '今回は遠慮する', hint: '静かな夜の充実感', delta: { health: 2, happiness: 1 } },
    ],
  },
  {
    // #4 joy / emotional
    type: 'emotional',
    title: '雨上がりの虹',
    body: '午後の豪雨が嘘のように止んだ。コンビニの軒先で雨宿りしていた人たちが、一斉に空を見上げる。ビルとビルの間に、薄い虹がかかっていた。隣にいた見知らぬ子どもが「あ」と声を上げて、母親の袖を引いた。誰も写真を撮ろうとしなかった。ただ全員が、同じ方向を見ていた。',
    emotionTag: 'joy',
    audioTheme: 'afternoon',
    statusDelta: { happiness: 4 },
    choices: null,
  },
  {
    // #5 joy / anniversary
    type: 'anniversary',
    title: '一年目の朝',
    body: 'カレンダーに小さく丸がついている。一年前の今日、この街に引っ越してきた。あの日は段ボールに囲まれて、コンビニのおにぎりを食べた。今はちゃんとした食器がある。棚には本が並んでいる。冷蔵庫には作り置きのスープがある。窓の外の景色は同じなのに、見え方がまるで違った。',
    emotionTag: 'joy',
    audioTheme: 'morning',
    statusDelta: { happiness: 4, reputation: 1 },
    choices: null,
  },
  {
    // #6 joy / emotional
    type: 'emotional',
    title: '拍手の余韻',
    body: '発表が終わった。最後のスライドが消え、一瞬の沈黙があった。それから、拍手が起きた。まばらだったそれは次第に厚みを増し、会場を満たした。壇上から客席を見ると、後ろの方で麻衣が両手を高く掲げて叩いているのが見えた。マイクを置いて、深く頭を下げた。指先がまだ震えていた。',
    emotionTag: 'joy',
    audioTheme: 'celebration',
    statusDelta: { happiness: 5, reputation: 4, wealth: 1 },
    choices: null,
  },

  // ────────────────────────────
  // hope (6本)
  // ────────────────────────────
  {
    // #7 hope / daily
    type: 'daily',
    title: '新しい名刺',
    body: '印刷所から届いた箱を開ける。真っ白な名刺の束。肩書きが変わっている。指先で一枚を取り出し、蛍光灯に透かしてみた。インクの匂いがする。まだ誰にも渡していない、まっさらな自分がそこにいた。名刺入れに十枚だけ移し、残りを引き出しにしまう。明日、最初の一枚を誰に渡すだろう。',
    emotionTag: 'hope',
    audioTheme: 'morning',
    statusDelta: { reputation: 3, happiness: 2 },
    choices: null,
  },
  {
    // #8 hope / turning_point
    type: 'turning_point',
    title: '辞表と決意',
    body: '引き出しの奥にしまっていた封筒を取り出す。中には白紙の辞表用紙。三ヶ月前に買ったものだ。ペンを持つ手は震えない。日付を書き、名前を書き、理由の欄で少し迷って「一身上の都合」と記した。封をして、机の上に置く。窓の外では、朝日がビルの谷間を縫うように差し込んでいた。',
    emotionTag: 'hope',
    audioTheme: 'morning',
    statusDelta: { happiness: 3, wealth: -3, reputation: -1 },
    choices: null,
  },
  {
    // #9 hope / choice
    type: 'choice',
    title: '二つの道',
    body: '教授から連絡があった。「海外の研究室からオファーが来ている。推薦状を書いてもいい」。電話を切ったあと、机の上に広げたままの企画書を見つめた。ここで積み上げてきたもの。向こうで始められるもの。窓ガラスに映る自分の顔は、どちらを選んでも後悔しそうな表情をしていた。',
    emotionTag: 'hope',
    audioTheme: 'evening',
    statusDelta: { happiness: 1 },
    choices: [
      { id: 'c9a', text: '海外行きを受ける', hint: '未知への船出', delta: { reputation: 3, happiness: 2, love: -2, wealth: -1 } },
      { id: 'c9b', text: 'ここに残る', hint: '積み上げた信頼の上に立つ', delta: { reputation: 1, love: 2, wealth: 2 } },
    ],
  },
  {
    // #10 hope / emotional
    type: 'emotional',
    title: '種を蒔く',
    body: 'ホームセンターで買ったプランターに土を入れる。指の間から黒い土がこぼれた。種の袋を破り、小さな粒を一列に並べていく。水をやると、土が黒々と湿った。芽が出るまで二週間かかると書いてある。ベランダの日当たりの良い場所に置いて、毎朝ここを覗くことを、自分と約束した。',
    emotionTag: 'hope',
    audioTheme: 'morning',
    statusDelta: { happiness: 2, health: 1 },
    choices: null,
  },
  {
    // #11 hope / npc_message
    type: 'npc_message',
    title: '教授のメール',
    body: '受信箱に山本教授の名前があった。件名は「近況報告のお願い」。本文は短かった。「最近どうしていますか。先日、君の書いた論文を後輩に紹介しました。読み返してみて、やはり良い着眼点だと思いました。もし迷っていることがあるなら、一度話しませんか」。返信ボタンを押す指に、力がこもった。',
    emotionTag: 'hope',
    audioTheme: 'afternoon',
    statusDelta: { happiness: 2, reputation: 2 },
    choices: null,
  },
  {
    // #12 hope / daily
    type: 'daily',
    title: '朝の走り出し',
    body: 'まだ薄暗い道を走り始める。呼吸が白い。最初の一キロは体が重い。二キロを過ぎたあたりで、足が勝手に回り出す。三キロ地点の交差点を曲がると、正面に朝焼けが広がった。道の先が光っている。ペースを上げた。胸の奥で、何かが組み変わっていく気配がした。今日は五キロ走れる気がした。',
    emotionTag: 'hope',
    audioTheme: 'morning',
    statusDelta: { health: 3, happiness: 2 },
    choices: null,
  },

  // ────────────────────────────
  // nostalgia (8本)
  // ────────────────────────────
  {
    // #13 nostalgia / flashback
    type: 'flashback',
    title: '通学路の記憶',
    body: '出張先で乗り換えた駅に、見覚えがあった。改札を出ると、坂道が続いている。高校の通学路だ。パン屋はまだあった。角のポストも同じ場所にある。ただ、文房具屋がコインランドリーに変わっていた。坂の途中で足を止め、校舎があったはずの方角を見た。フェンスの向こうにマンションが建っていた。',
    emotionTag: 'nostalgia',
    audioTheme: 'afternoon',
    statusDelta: { happiness: 1, love: 1 },
    choices: null,
  },
  {
    // #14 nostalgia / flashback
    type: 'flashback',
    title: '父の背中',
    body: '押し入れの整理をしていたら、古いアルバムが出てきた。日に焼けた表紙を開くと、海辺の写真があった。父の肩車に乗っている幼い自分。父はまだ三十代で、背中が今より広い。写真の端に、母の影が映り込んでいる。シャッターを押したのは母だろう。裏に「九十九里」と、母の字で書いてあった。',
    emotionTag: 'nostalgia',
    audioTheme: 'afternoon',
    statusDelta: { love: 3, happiness: 1 },
    choices: null,
  },
  {
    // #15 nostalgia / emotional
    type: 'emotional',
    title: '旧友の結婚式',
    body: '招待状に名前を見つけたとき、一瞬誰だか分からなかった。旧姓で書いてあったからだ。式場に着くと、大学時代の顔ぶれが揃っていた。皆、少しだけ大人びている。ブーケトスのとき、誰かが「次はお前だな」と肩を叩いた。笑って受け流しながら、この距離がいつの間にか生まれたことに気づいていた。',
    emotionTag: 'nostalgia',
    audioTheme: 'celebration',
    statusDelta: { love: 2, happiness: 1 },
    choices: null,
  },
  {
    // #16 nostalgia / daily
    type: 'daily',
    title: '夏の匂い',
    body: '仕事帰りにプールの横を通った。塩素の匂いが鼻をくすぐる。フェンス越しに水面が見える。子どもたちの歓声が、夕方の空気に溶けていく。あの頃は日が暮れるまで泳いだ。唇を紫色にして、ガタガタ震えながら更衣室に駆け込んだ。自販機のぶどうジュースの味を、舌が覚えている。',
    emotionTag: 'nostalgia',
    audioTheme: 'evening',
    statusDelta: { happiness: 2 },
    choices: null,
  },
  {
    // #17 nostalgia / flashback
    type: 'flashback',
    title: '手紙の束',
    body: '引越しの荷造り中、紙袋の奥から輪ゴムで束ねた手紙が出てきた。便箋の柄が一枚ずつ違う。開いてみると、高校時代に交換していた手紙だった。授業中にこっそり回していたもの。くだらない落書きと、テスト範囲のメモと、好きな人のイニシャル。紙が少し黄ばんでいて、あの教室の空気が立ち上がった。',
    emotionTag: 'nostalgia',
    audioTheme: 'afternoon',
    statusDelta: { happiness: 2, love: 1 },
    choices: null,
  },
  {
    // #18 nostalgia / choice
    type: 'choice',
    title: '地元の祭り',
    body: '母から写真が送られてきた。地元の夏祭りの様子だ。提灯の列が商店街を彩っている。焼きそばの煙が画面の向こうから匂ってくるようだった。「今年は盆踊りの曲が変わったのよ」とメッセージが添えてある。カレンダーを確認する。週末、一泊なら帰れなくもない。',
    emotionTag: 'nostalgia',
    audioTheme: 'evening',
    statusDelta: { love: 1 },
    choices: [
      { id: 'c18a', text: '帰省する', hint: '故郷の灯りに包まれる', delta: { love: 4, happiness: 3, wealth: -2 } },
      { id: 'c18b', text: '写真で楽しむ', hint: '遠くから思いを馳せる', delta: { happiness: 1 } },
    ],
  },
  {
    // #19 nostalgia / emotional
    type: 'emotional',
    title: 'カセットテープ',
    body: '実家の物置で見つけたカセットテープ。ラベルには「MIX Vol.3」と書いてある。再生する機械がないことに気づき、ネットで中古のラジカセを注文した。三日後に届いたそれにテープを入れると、ノイズの向こうからギターのイントロが流れ出した。十五歳の自分が選んだ曲。歌詞を全部覚えていることに驚いた。',
    emotionTag: 'nostalgia',
    audioTheme: 'night',
    statusDelta: { happiness: 2, love: 1 },
    choices: null,
  },
  {
    // #20 nostalgia / daily
    type: 'daily',
    title: '同じベンチ',
    body: '公園を横切ろうとして、足が止まった。あのベンチだ。大学三年のとき、ここで進路について朝まで話した。缶コーヒーを両手で温めながら、未来のことを語った。隣には誰がいただろう。名前は覚えている。連絡先はもう分からない。ベンチの木は少し色褪せていたが、同じ場所に、同じ角度で置いてあった。',
    emotionTag: 'nostalgia',
    audioTheme: 'evening',
    statusDelta: { happiness: 1, love: 2 },
    choices: null,
  },

  // ────────────────────────────
  // sadness (8本)
  // ────────────────────────────
  {
    // #21 sadness / emotional
    type: 'emotional',
    title: '空いた席',
    body: '定食屋に入ると、いつもの席が空いていた。ここに座っていたおじいさんを最近見ない。店主に聞くと「先月、入院されたみたいで」と言った。注文したのはいつもと同じ焼き魚定食。向かいの席に、醤油差しがぽつんと置いてある。おじいさんはいつも卵焼きを追加していた。その分だけ、テーブルが広く見えた。',
    emotionTag: 'sadness',
    audioTheme: 'evening',
    statusDelta: { happiness: -3, love: -1 },
    choices: null,
  },
  {
    // #22 sadness / daily
    type: 'daily',
    title: '既読のまま',
    body: '三日前に送ったメッセージに既読がついている。返事はない。もう一度画面を開いて、自分の文面を読み返す。おかしなことは書いていない。たぶん忙しいだけだ。そう思いながらスマートフォンを裏返しに置いた。テレビをつけたが、何も入ってこない。冷蔵庫を開けて、何も取らずに閉めた。',
    emotionTag: 'sadness',
    audioTheme: 'night',
    statusDelta: { happiness: -2, love: -2 },
    choices: null,
  },
  {
    // #23 sadness / emotional
    type: 'emotional',
    title: '雨の引越し',
    body: '段ボールを運び出す手が濡れている。最後の箱をトラックに積んだあと、空っぽの部屋に戻った。フローリングに四角い日焼けの跡が残っている。本棚があった場所だ。窓枠に手をかけて、外を見る。隣の公園のブランコが、誰も乗っていないのに風で揺れていた。鍵を大家に返して、振り返らずに歩いた。',
    emotionTag: 'sadness',
    audioTheme: 'rain',
    statusDelta: { happiness: -3, love: -2 },
    choices: null,
  },
  {
    // #24 sadness / npc_message
    type: 'npc_message',
    title: '母からの電話',
    body: '夕方、母から電話があった。「元気にしてる？」という声が、いつもより少し高い。何かを隠しているときの声だ。しばらく天気の話をしたあと、「お父さんね、検査で引っかかったの」と言った。「大したことないって言ってるけど」。窓の外が暗くなっていく。通話を切ったあと、しばらくスマートフォンを握ったまま動けなかった。',
    emotionTag: 'sadness',
    audioTheme: 'evening',
    statusDelta: { happiness: -4, love: -1, health: -1 },
    choices: null,
  },
  {
    // #25 sadness / daily
    type: 'daily',
    title: '忘れ物',
    body: '部屋の掃除をしていたら、ソファの隙間からヘアピンが出てきた。自分のものではない。誰のものか、分かっている。捨てようとして、手が止まった。洗面台の棚に置いた。翌日も、その翌日も、そこにあった。三日目の夜、引き出しの奥にしまった。それ以上のことは、できなかった。',
    emotionTag: 'sadness',
    audioTheme: 'night',
    statusDelta: { happiness: -3, love: -3 },
    choices: null,
  },
  {
    // #26 sadness / choice
    type: 'choice',
    title: '最後の見舞い',
    body: '病室のドアの前で深呼吸をした。花束を持つ手が少し震えている。ドアを開けると、ベッドの上の祖母が目を開けた。「来てくれたの」と唇が動いたが、声はほとんど出ていなかった。窓際の椅子に座り、何を話せばいいのか分からないまま、皺だらけの手を握った。骨の形がはっきりと分かる、軽い手だった。',
    emotionTag: 'sadness',
    audioTheme: 'rain',
    statusDelta: { happiness: -2, love: 1 },
    choices: [
      { id: 'c26a', text: '昔の話をする', hint: '穏やかな記憶を辿る', delta: { love: 3, happiness: -1 } },
      { id: 'c26b', text: '手を握って黙っている', hint: '言葉を超えた温もり', delta: { love: 2, happiness: -2 } },
    ],
  },
  {
    // #27 sadness / daily
    type: 'daily',
    title: '帰りの電車',
    body: '帰りの電車で、イヤホンをつけたまま音楽を流さなかった。窓ガラスに映る自分の顔を見つめる。隣の乗客がページをめくる音が、やけに大きく聞こえる。駅名が表示されるたび、降りる場所に近づいていく。だが、降りた先に待っている部屋の暗さを思うと、このまま終点まで乗っていたくなった。',
    emotionTag: 'sadness',
    audioTheme: 'night',
    statusDelta: { happiness: -3 },
    choices: null,
  },
  {
    // #28 sadness / emotional
    type: 'emotional',
    title: '消えた番号',
    body: '電話帳を整理していた。一つの名前の前で指が止まる。もう繋がらない番号だ。最後に電話したのは二年前の冬。留守電にメッセージを残した。折り返しはなかった。削除ボタンの上に親指を置く。長い間そうしていた。結局、削除はしなかった。もう繋がらないと知りながら、番号だけはそこに残した。',
    emotionTag: 'sadness',
    audioTheme: 'night',
    statusDelta: { happiness: -2, love: -2 },
    choices: null,
  },

  // ────────────────────────────
  // melancholy (5本)
  // ────────────────────────────
  {
    // #29 melancholy / daily
    type: 'daily',
    title: '日曜の午後',
    body: '昼過ぎに目が覚めた。カーテンの隙間から差し込む光が、埃を照らしている。起き上がる理由が見つからない。冷蔵庫に牛乳と卵がある。それだけ確認して、布団に戻った。スマートフォンを開くと、SNSのタイムラインが流れていく。誰かの旅行、誰かの料理、誰かの子ども。画面を閉じて、天井を見上げた。',
    emotionTag: 'melancholy',
    audioTheme: 'rain',
    statusDelta: { happiness: -2, health: -1 },
    choices: null,
  },
  {
    // #30 melancholy / emotional
    type: 'emotional',
    title: '冬の交差点',
    body: '信号待ちをしている。マフラーに顔を埋めて、白い息を吐いた。横断歩道の向こう側に、知っている人がいるような気がした。目を凝らす。知らない人だった。信号が変わり、すれ違う。大勢の人が行き交う交差点で、一人だけ少し立ち止まった。コートのポケットに手を突っ込み、どちらに歩くか迷った。',
    emotionTag: 'melancholy',
    audioTheme: 'evening',
    statusDelta: { happiness: -2 },
    choices: null,
  },
  {
    // #31 melancholy / daily
    type: 'daily',
    title: '閉店のシャッター',
    body: '帰り道、よく通る角の本屋にシャッターが下りていた。張り紙がしてある。「長らくのご愛顧ありがとうございました」。日付は先週だ。気づかなかった。最後に入ったのはいつだろう。レジ横の文庫本コーナーが好きだった。店主の眼鏡と、レシートを渡すときの「ありがとうございます」が脳裏をよぎった。',
    emotionTag: 'melancholy',
    audioTheme: 'evening',
    statusDelta: { happiness: -2, love: -1 },
    choices: null,
  },
  {
    // #32 melancholy / emotional
    type: 'emotional',
    title: '誰もいない公園',
    body: '深夜の公園に、街灯だけが立っている。ブランコの鎖が風で微かに鳴った。ベンチに座り、缶ビールを開ける。プルタブの音が妙に響いた。昼間は子どもたちの声で溢れる場所が、今は静かに呼吸している。月が雲の隙間から顔を出し、砂場に白い影を落とした。一口飲んで、何を考えるでもなく空を見上げた。',
    emotionTag: 'melancholy',
    audioTheme: 'night',
    statusDelta: { happiness: -1, health: -1 },
    choices: null,
  },
  {
    // #33 melancholy / daily
    type: 'daily',
    title: '使わない傘',
    body: '玄関の傘立てに傘が三本ある。自分のと、壊れかけのビニール傘と、もう一本。柄に小さなリボンが巻いてある。持ち主はもう取りに来ない。捨てる理由も、取っておく理由も見つからないまま、三ヶ月が過ぎた。今朝も雨だった。自分の傘を取り、残りの二本はそのまま立っていた。',
    emotionTag: 'melancholy',
    audioTheme: 'rain',
    statusDelta: { happiness: -2, love: -1 },
    choices: null,
  },

  // ────────────────────────────
  // surprise (7本)
  // ────────────────────────────
  {
    // #34 surprise / daily
    type: 'daily',
    title: '見知らぬ差出人',
    body: '郵便受けに、手書きの封筒が入っていた。差出人の名前に覚えがない。切手は外国のもの。恐る恐る封を切ると、一枚の写真と短い手紙が入っていた。写真には、見知らぬ街の夕暮れ。手紙には「あなたが去年落とした傘、大切に使っています」と書いてあった。去年、海外で傘を忘れたことを思い出した。',
    emotionTag: 'surprise',
    audioTheme: 'afternoon',
    statusDelta: { happiness: 3, love: 1 },
    choices: null,
  },
  {
    // #35 surprise / turning_point
    type: 'turning_point',
    title: '突然の異動',
    body: '上司に呼ばれた。会議室のドアを閉めると、「来月から大阪に行ってほしい」と言われた。パイプ椅子に座ったまま、数秒間、何も言えなかった。窓の外のビル群が、急に見知らぬ景色に変わった。手帳を開くと、来月の予定がぎっしり書いてある。全部白紙に戻さなければならない。帰りの電車で、路線図を眺め続けた。',
    emotionTag: 'surprise',
    audioTheme: 'tense',
    statusDelta: { happiness: -1, reputation: 2, wealth: 1 },
    choices: null,
  },
  {
    // #36 surprise / choice
    type: 'choice',
    title: '落し物の財布',
    body: '駅の階段で、革の財布が落ちていた。拾い上げると、ずしりと重い。中を確認すると、免許証と数万円の現金、そして一枚の写真。家族の写真だ。幼い子どもが笑っている。交番はここから五分。持ち主に届けるのが当然だと頭では分かっている。だが、今月は家賃の支払いが厳しい。財布を握る手に力が入った。',
    emotionTag: 'surprise',
    audioTheme: 'afternoon',
    statusDelta: {},
    choices: [
      { id: 'c36a', text: '交番に届ける', hint: '正しさが胸を温める', delta: { reputation: 4, happiness: 2 } },
      { id: 'c36b', text: '現金だけ抜く', hint: '罪悪感が影のように付きまとう', delta: { wealth: 3, happiness: -3, reputation: -2 } },
    ],
  },
  {
    // #37 surprise / npc_message
    type: 'npc_message',
    title: '彩からの告白',
    body: '居酒屋の帰り道、彩が急に立ち止まった。「ずっと言おうと思ってたんだけど」。街灯の下で、彼女の影が長く伸びている。「私、来月から北海道の病院に異動になった」。そういう話かと思った。だが、彩は続けた。「だから、今のうちに言っておきたいことがあって」。風が吹いて、彼女の髪が揺れた。',
    emotionTag: 'surprise',
    audioTheme: 'night',
    statusDelta: { love: 3, happiness: 1 },
    choices: null,
  },
  {
    // #38 surprise / daily
    type: 'daily',
    title: '身に覚えのない荷物',
    body: '宅配便が届いた。注文した覚えがない。伝票を見ると、送り主は母だった。段ボールを開けると、みかんが山のように入っている。その隙間に、手編みのマフラーが押し込んであった。こんなもの頼んでいない。電話をかけると「寒いでしょ。あとみかん安かったから」。文句を言おうとして、言葉が出なかった。',
    emotionTag: 'surprise',
    audioTheme: 'afternoon',
    statusDelta: { happiness: 3, love: 2, health: 1 },
    choices: null,
  },
  {
    // #39 surprise / emotional
    type: 'emotional',
    title: '再会',
    body: '渋谷のスクランブル交差点。人波に流されながら歩いていると、向こうから歩いてくる人と目が合った。お互い同時に足を止めた。十年会っていなかった。変わっていた。でも、目だけは同じだった。「嘘だろ」と相手が言い、「嘘みたいだ」と返した。スクランブル交差点の真ん中で、信号が変わるまで立ち尽くした。',
    emotionTag: 'surprise',
    audioTheme: 'afternoon',
    statusDelta: { happiness: 3, love: 2 },
    choices: null,
  },
  {
    // #40 surprise / daily
    type: 'daily',
    title: '懸賞の当選',
    body: '朝、知らない番号から電話があった。出ると「おめでとうございます、抽選に当選されました」。詐欺だと思って切ろうとしたが、よく聞くと先月応募した旅行のキャンペーンだった。沖縄三泊四日のペアチケット。机の上のカレンダーを見る。有給はまだ残っている。問題は、誰を誘うかだった。',
    emotionTag: 'surprise',
    audioTheme: 'morning',
    statusDelta: { happiness: 4, wealth: 2 },
    choices: null,
  },

  // ────────────────────────────
  // anger (2本)
  // ────────────────────────────
  {
    // #41 anger / emotional
    type: 'emotional',
    title: '理不尽な叱責',
    body: '会議室を出た瞬間、奥歯を噛み締めた。こめかみの血管が脈打つのが分かる。自分のミスではない。それは全員が知っている。だが、誰も口を開かなかった。廊下の自販機の前に立ち、ボタンを押す指に力が入りすぎて、缶が勢いよく落ちてきた。冷たい缶を額に当て、目を閉じた。深呼吸を三回した。まだ足りなかった。',
    emotionTag: 'anger',
    audioTheme: 'tense',
    statusDelta: { happiness: -4, reputation: -2, health: -1 },
    choices: null,
  },
  {
    // #42 anger / choice
    type: 'choice',
    title: '裏切りの噂',
    body: '加藤先輩に呼び止められた。「お前の企画、佐藤が自分の手柄にしてるって知ってた？」。廊下の蛍光灯がちらついている。「部長に直接プレゼンしたらしいぞ」。握りしめた書類の角が掌に食い込んだ。エレベーターの階数表示が点滅している。佐藤のいるフロアは三階。部長室は五階。ボタンに手を伸ばした。',
    emotionTag: 'anger',
    audioTheme: 'tense',
    statusDelta: { happiness: -3, reputation: -1 },
    choices: [
      { id: 'c42a', text: '佐藤に直接問いただす', hint: '対峙する勇気', delta: { reputation: 2, happiness: -1 } },
      { id: 'c42b', text: '部長に事実を報告する', hint: '冷静な判断', delta: { reputation: 3, happiness: 1 } },
    ],
  },

  // ────────────────────────────
  // fear (2本)
  // ────────────────────────────
  {
    // #43 fear / emotional
    type: 'emotional',
    title: '深夜の揺れ',
    body: '午前三時、ベッドが揺れて目が覚めた。最初は夢かと思った。だが、本棚の上の小物がカタカタと鳴っている。地震だ。布団を掴んだまま体を起こす。揺れは長く、ゆっくりとしていた。スマートフォンの画面が光り、緊急地震速報の音が鳴った。揺れが収まったあとも、心臓だけがまだ揺れ続けていた。',
    emotionTag: 'fear',
    audioTheme: 'tense',
    statusDelta: { happiness: -3, health: -2 },
    choices: null,
  },
  {
    // #44 fear / choice
    type: 'choice',
    title: '検査結果',
    body: '病院の待合室で名前を呼ばれた。立ち上がると、膝が一瞬笑った。診察室のドアを開けると、医師がモニターに向かっている。「座ってください」。椅子に腰を下ろすと、医師がゆっくりとこちらを向いた。「結果が出ました」。封筒がデスクの上に置かれる。医師の表情からは何も読み取れなかった。',
    emotionTag: 'fear',
    audioTheme: 'tense',
    statusDelta: { happiness: -2, health: -1 },
    choices: [
      { id: 'c44a', text: '封筒を自分で開ける', hint: '震える手で現実を受け止める', delta: { health: -1, happiness: -2 } },
      { id: 'c44b', text: '医師に説明を求める', hint: '専門家の声に身を委ねる', delta: { health: 1, happiness: -1 } },
    ],
  },

  // ────────────────────────────
  // contentment (6本)
  // ────────────────────────────
  {
    // #45 contentment / daily
    type: 'daily',
    title: '銭湯の帰り道',
    body: '番台で靴を受け取り、引き戸を開けると夜風が頬を撫でた。湯上がりの体から湯気が立つ。髪はまだ少し湿っている。自販機で買った瓶の牛乳を一気に飲み干し、星を見上げた。ネオンに負けて数個しか見えないが、それで十分だった。下駄の音がカランと鳴って、足元から夜が始まった。',
    emotionTag: 'contentment',
    audioTheme: 'night',
    statusDelta: { happiness: 3, health: 2 },
    choices: null,
  },
  {
    // #46 contentment / daily
    type: 'daily',
    title: '手作りの弁当',
    body: '会社の屋上でベンチに座り、弁当箱を開ける。卵焼きが少し焦げている。ウインナーにはタコの切れ込みが入っている。米粒のひとつひとつが、朝の台所の湯気を思い出させた。全部食べ終えて蓋を閉めると、底に小さな付箋が貼ってあった。「今日もがんばれ」。丁寧な字だった。',
    emotionTag: 'contentment',
    audioTheme: 'afternoon',
    statusDelta: { happiness: 3, love: 2, health: 1 },
    choices: null,
  },
  {
    // #47 contentment / npc_message
    type: 'npc_message',
    title: '深夜の着信',
    body: '夜中の二時、スマートフォンの画面が光った。翔からだった。「今、路上ライブの帰り。めちゃくちゃ良い曲ができた。聴いてほしい」。添付されたボイスメモを再生すると、ギターの弾き語りが流れてきた。雑踏の音が混じっている。けれど、メロディは透き通っていた。聴き終えて「最高」とだけ返した。',
    emotionTag: 'contentment',
    audioTheme: 'night',
    statusDelta: { happiness: 3, love: 1 },
    choices: null,
  },
  {
    // #48 contentment / daily
    type: 'daily',
    title: '猫のいる路地',
    body: '会社帰り、いつもと違う道を選んだ。細い路地を曲がると、塀の上に三毛猫が座っていた。目が合う。逃げない。しゃがんで手を伸ばすと、猫は鼻先をくんくんと寄せてきた。温かい毛並みに指を滑らせると、小さなゴロゴロという振動が伝わった。帰りが五分遅くなったが、足取りは軽かった。',
    emotionTag: 'contentment',
    audioTheme: 'evening',
    statusDelta: { happiness: 3, health: 1 },
    choices: null,
  },
  {
    // #49 contentment / daily
    type: 'daily',
    title: '夕焼けの屋上',
    body: '残業を終えてビルの屋上に出た。オレンジ色の光が街を横から照らしている。遠くの山並みが紫色に滲み、手すりの金属が温かい。隣のビルの窓にも、同じ色が映っていた。深く息を吸うと、排気ガスの匂いの向こうに、かすかに金木犀の香りが混じっている。なんとなく、もう少しここにいようと思った。',
    emotionTag: 'contentment',
    audioTheme: 'evening',
    statusDelta: { happiness: 3 },
    choices: null,
  },
  {
    // #50 contentment / choice
    type: 'choice',
    title: '日曜の過ごし方',
    body: '朝から煮込み料理を作ることにした。玉ねぎを刻むと、目がじわりと滲む。鍋に油を引き、にんにくを炒めると、部屋中に匂いが広がった。蓋をして弱火にし、ソファに座る。窓の外は快晴だ。このまま家で本を読むのも悪くない。でも、さくらのカフェが新メニューを出したと言っていたのを思い出した。',
    emotionTag: 'contentment',
    audioTheme: 'afternoon',
    statusDelta: { happiness: 2 },
    choices: [
      { id: 'c50a', text: '家で読書する', hint: '鍋の音と本の世界に浸る', delta: { happiness: 3, health: 2 } },
      { id: 'c50b', text: 'カフェに出かける', hint: 'ささやかな外出の喜び', delta: { happiness: 3, love: 1 } },
    ],
  },
]
