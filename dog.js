'use stict';
const dateInput = document.getElementById('birthday');
const userNameInput = document.getElementById('user-name');
const assessmentButton = document.getElementById('assessment');
const resultDivided = document.getElementById('result-area');
const tweetDivided = document.getElementById('tweet-area');

/**
 * 指定した要素の子どもを全て除去する
 * @param {HTMLElement} element HTMLの要素
 */
function removeAllChildren(element) {
  while (element.firstChild) {
    // 子どもの要素があるかぎり除去
    element.removeChild(element.firstChild);
  }
}

assessmentButton.onclick = () => {
  const date = dateInput.value;
  const userName = userNameInput.value;
  if (date.length === 0 && userName.length === 0) {
    // 名前が空の時は処理を終了する
    return;
  }

  // 診断結果表示エリアの作成
  removeAllChildren(resultDivided);
  const header = document.createElement('h3');
  header.innerText = '診断結果';
  resultDivided.appendChild(header);

  const paragraph = document.createElement('p');
  const result = assessment(date,userName);
  paragraph.innerText = result;
  resultDivided.appendChild(paragraph);

  // ツイートエリアの作成
  removeAllChildren(tweetDivided);
  const anchor = document.createElement('a');
  const hrefValue =
    'https://twitter.com/intent/tweet?button_hashtag=' +
    encodeURIComponent('あなたを犬種に例えてみた') +
    '&ref_src=twsrc%5Etfw';
  anchor.setAttribute('href', hrefValue);
  anchor.setAttribute('class', 'twitter-hashtag-button');
  anchor.setAttribute('data-text', result);
  anchor.innerText = 'Tweet #あなたを犬種に例えてみた';
  tweetDivided.appendChild(anchor);

  // widgets.js の設定
  const script = document.createElement('script');
  script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
  tweetDivided.appendChild(script);
};

const answers = [
  `{userName}はポメラニアンです。元気いっぱいで好奇心旺盛。気が強いです。`,
  `{userName}はトイプードルです。温厚で明るく、活発で社交性が高いです。`,
  `{userName}はコギーです。明るく元気で遊び好きで、社交的です。運動が得意です。`,
  `{userName}はシェットランドシープドックです。穏やかで優しい性格の持ち主。人を喜ばせることが大好きです。`,
  `{userName}は人面犬です。都市伝説の存在です。どんな性格をしているのか気になります。`,
  `{userName}はゾンビ犬です。ゾンビ化した犬です。とても攻撃的な性格をしていると思います。`,
  `{userName}はボルゾイです。物静かで穏やかな性格をしています。争い事などは、その場を避けることで回避するタイプです。`,
  `{userName}はチワワです。好奇心旺盛で活発で深い愛情を持っています。`,
  `{userName}はサモエドです。温和で遊び好きで、とてもフレンドリー。頑固な一面もあります。`,
  `{userName}はケルベロスです。冥王ハーデスの犬。愛嬌があったそうです。甘いものが大好きです。`,
  `{userName}はペキニーズです。勇敢で大胆、頑固で気まぐれ、マイペース。プライドが高く独立心も強いです。`,
  `{userName}はダックスです。友好的で情熱的でもあり辛抱強いです。`,
  `{userName}はビション・フリーゼです。陽気で明るく、フレンドリーで素直です。しかしわがままな一面もあります。`,
  `{userName}は日本スピッツです。活発で遊び好き、好奇心が強いのに警戒心も強いです。`,
  `{userName}はシーズーです。明るく穏やかで親しみやすい性格の持ち主です。遊ぶ時もとても活発です。`,
  `{userName}はヨークシャーテリアです。用心深いところもありますが、聡明で、活発です。自信に溢れ、独立心が強く、ときに勇敢な面もあります。`,
  `{userName}はシベリアンハスキーです。優れた判断力があり、社会性が高く賢いです。慎重で控えめな一面も見られます。`,
  `{userName}はパグです。陽気で人懐っこく、遊ぶのが大好きです。愛情深く優しい性格ですが、寂しがりやです。`,
  `{userName}はパピヨンです。明るく活発で、友好的な性格。とても賢く状況判断が得意です。`,
  `{userName}はマルチーズです。人なつっこく、外交的な性格の持ち主です。その明るさで人々を癒しています。`,
  `{userName}はドーベルマンです。非常に優しく、穏やかで甘え上手です。動くこと、走ることを好みます。`,
  `{userName}はシェパードです。活発で、大胆不敵な性格です。また洞察力と忍耐力があリます。`,
  `{userName}はダルメシアンです。明るく陽気です。しかしその反面、警戒心が強く、飼い主以外の人や犬には、気を許さないところもあります。`,
  `{userName}はボーダーコリーです。頭のよさも全犬種のなかでトップクラスといわれています。性格はとても思慮深いです。`,
  `{userName}はボクサーです。性格は穏やかで安定しています。非常に聡明でやさしく、落ち着いた振る舞いをしています。`,
  `{userName}はビーグルです。明朗快活で、遊ぶことが大好き。協調性・社会性が高く、見知らぬ人やほかの犬とも仲よくできます。`,
  `{userName}は柴犬です。勇敢でとても愛情深いですが、警戒心が強いです。`,
  `{userName}はラブラドールレトリバーです。集中力と理解力にすぐれていて、感受性が豊か。フレンドリーでとても賢いです。`,
  `{userName}はゴールデンレトリバーです。おおらかで優しい性格ですが、寂しがりやです。`,
  `{userName}は秋田犬です。知的で温和な性格ですが、警戒心と自立心が強いです。また、とても我慢強いです。`,
];

/**
 * 名前の文字列を渡すと診断結果を返す関数
 * @param {string} date ユーザーの生年月日
 * @return {string} 診断結果
 */
function assessment(date,userName) {
  // 全文字のコード番号を取得してそれを足し合わせる
  let sumOfcharCode = 0;
  for (let i = 0; i < date.length; i++) {
    sumOfcharCode = sumOfcharCode + date.charCodeAt(i);
  }

  // 文字のコード番号の合計を回答の数で割って添字の数値を求める
  const index = sumOfcharCode % answers.length;
  let result = answers[index];

  result = result.replaceAll('{userName}',userName ); 
  return result;
}