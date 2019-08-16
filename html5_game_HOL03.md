# 演習 3 : 基本的なアニメーションの実装
HTML5 でサポートされた **requestAnimationFrame** メソッドを使用して処理全体をループさせ、アニメーションを実装します。

このループ中に行われる処理全体をフレームと呼び、フレーム内でオブジェクトのプロパティの値を増分あるいは減分することによりアニメーションを実現します。

## タスク 1 : ループ処理の実装
1. **getCenterPostion** 関数を定義している箇所の下の行コメント「**/* ここに演習 3 タスク 1 で renderFrame関数を記述します。*/**」を、ループ処理を行うための以下の **renderFrame** 関数に書き換えます。
```
function renderFrame() { 
    //sprite.snow の y 値(縦位置) が canvas からはみ出たら先頭に戻す 
    if (sprite.snow.y > canvas.clientHeight) { sprite.snow.y = 0 }; 
    //canvas をクリア 
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    //sprite.snow の y 値を増分 
    sprite.snow.y += 2; 
　　/*ここに演習 4 タスク 1 手順 6 のコードを追記します。*/
    //Spriteを描画 
    sprite.snow.draw();
    sprite.snow_man.draw();
    /*ここに演習 5 isHit関数を呼び出すコードを追加します*/
　　/*ここに演習 7 のタスク 1 手順 7 で処理数のカウントを追加します*/
    //ループを開始 
    requestId =window.requestAnimationFrame(renderFrame); 
}
```
コードを張り付けてインデントが崩れたら **[Alt] + [Shift] + [F]** キーを押下して体裁を整えます。

2. Canvas のクリックをきっかけにフレームが開始されるされるように **loadAssets** 関数の最初の処理 canvas = document.getElementById('bg'); の下にあるコメント「**/* ここに演習 3 タスク 1 で Click イベントハンドラ処理を追加します*/**」を以下のコードに置き換えます。
```
    //アニメーションの開始
    canvas.addEventListener('click', ()=>{
    /*演習 6 のタスク 3 で loadCheck 関数を呼び出すように変更されます*/
        if(!requestId){renderFrame();}
    });
```
3. [Ctrl] + [S] キーを押下して作業内容を保存します。
4. Visual Studio Code のターミナル画面から http-server を起動し、以下の URL にアクセスします。
    <p style="text-indent:2em">
    <a href="http://127.0.0.1:8080/default.html">http://127.0.0.1:8080/default.html</a></p>
5. Canvas 部分をクリックし、雪の結晶画像が上から下へ繰り返しアニメーションするか確認してください。

ここまでの default.js の完全なコードは以下になります。

[⇒ HTML5 game and PWD HOL Ex3 sample code](https://gist.github.com/osamum/1dedd598464c4dce90a3b897082becfb)

実際のコードの動作を確認したい場合は[ここ](https://osamum.github.io/HTML5Game_and_PWA_Handson/results/ex3/default.html)をクリックしてください。


⇒ 次の「[4. 矢印キーとタッチによる制御](html5_game_HOL04.md)」に進む

# 解説
## Canvas のアニメーション
Canvas でのアニメーションは、描画したオブジェクトのプロパティに現在位置と移動先の位置、時間あたりの移動量を指定で云々….というものではなく、もっと原始的なパラパラ漫画のようなものです。
描画要素をオブジェクトとして扱える SVG とは違い Canvas で描画された画像は、単なるビットマップ (絵) なので描画された要素を個別に指定することはできません。つまり、Canvas 上に UFO を描画した場合、表示の済んだ UFO をオブジェクトとして指定することはできません。なぜならそれは Canvas 上にビットマップで書かれた模様に過ぎないからです。

ではどのようにしてアニメーションを実現するのかというと、Canvas 全体を描画してはクリアし描き換えていくという方法で実現します。

## フレームとアニメーション
アニメーションの原理は、微妙に描写の異なる絵を高速に描き換えていくことで動画を実現しています。

この描き換えられる絵のことをフレームといい、単位時間で描画されるフレームの数をフレームレートと言います。単位としては、1 秒あたりのフレームレートを fps (frames per second) という単位で表します。
Canvas でアニメーションを実現するには、Canvas の描画とクリアを繰り返していく必要かありますが、ここで重要になってくるのが時間あたりの処理をさせるフレーム管理です。JavaScript には setInterval 関数があり、1 秒あたりの処理数を管理するのに以前から使用されてきました。しかし、HTML5 からは window オブジェクトによりアニメーションに向いた requestAnimationFrame メソッドが追加され、これを使用することができます。
## setInterval と requestAnimationFrame
setInterval は単位時間当たりの処理を繰り返し行うための関数ですが、もともとがアニメーション用に作られているわけではないので、非効率な点がいろいろとありました。例えば、Web ブラウザーがバッググラウンドにあり、描画の必要がないときでも setInterval 関数は動作しつづけます。このため CPU サイクルの浪費、電力の無駄使いという問題が発生しました。また、モニターのリフレッシュレートとも合わせられず、過剰な描画呼び出しが発生し、バッテリの駆動時間や、他のアプリのパフォーマンスにも悪影響が及ぼす可能性がありました。

いっぼう、requestAnimationFrame メソッドは、最初からアニメーションで使用されることが前提で作られているため、ブラウザーがページの表示を更新する必要のあるタイミングで (のみ) アプリは通知を受け取ることができるので、CPU やメモリを効率的に使用することができます。

## requestAnimationFrame メソッドの使い方
equestAnimationFrame メソッドは、引数にフレームを描画するための関数をコールバック関数として渡し、継続して描画を行う際にはコールバック関数内でその関数をさらに呼ぶという使い方をします。

例えは、以下は HTML エレメントの style.left を呼び出し毎に加算し、HTML エレメントを右方向へ動かす処理を記述したものですが、関数内の requestAnimationFrame メソッドに、呼び出し元と同じ関数名が指定されています。
```
function renderLoop() { 
    elm.style.left = (iPos += 3)  + "px"; 
    handle = window.requestAnimationFrame(renderLoop); 
} 
```
## requestAnimationFrame メソッドと FPS
requestAnimationFrame メソッドはブラウザーの負荷に合わせ、60 fps  以内で実行されます。実行は描画の準備が整った段階で行われるため、setInterval 関数を使ったアニメーションのような過剰な呼び出しによるコマ落ちや描画の乱れも発生せず、滑らかに動作します。

ただし、1 秒間当たりの処理数は明示的に指定できないため、厳密な fps を設定するには独自でその仕組みを実装する必要があります。例えば、現在時刻から前回実行時刻をマイナスし、その差分で描画を行うかどうかという判断する、といった具合です。

実際のところ、使用する Web ブラウザーごとに処理の発生するタイミングはまちまちなので、アニメーションさせるアイテムの数が増えてくるとその差が開き、Web ブラウザーごとに動作スピードが異なるということが発生します。
よって、fps を制御するコードを実装することをお勧めしますが、今回の実装では複雑になるので除きます。(※後の演習で実装します。)
requestAnimationFrame メソッドを使用したアニメーションの実装の詳細については以下のドキュメントを参照してください。
* [HTML5 ゲームで setInterveral を requestAnimationFrame に置き換える](https://msdn.microsoft.com/ja-jp/library/ie/dn265056(v=vs.85).aspx)
* [スクリプトによるアニメーションのタイミング制御 ("requestAnimationFrame")](https://msdn.microsoft.com/ja-jp/library/ie/hh920765(v=vs.85).aspx)

## requestAnimationFrame メソッドを使用した アニメーションの実装
この演習では、雪の結晶の画像が繰り返し降ってくるようにしました。

原理としては、requestAnimationFrame メソッドに引数として渡される関数内で Canvas をクリアし、drawImage メソッドで画像を描画する際に縦の位置を表す引数 Y を加算していき、Y の値が Canvas の縦のサイズを超えたら 0 に戻すという単純なものです。

この内容を踏まえ、デバッガなどを使用してコードの動作を観察してください。


### 目次
[4. 矢印キーとタッチによる制御](html5_game_HOL04.md)

[5. 当たり判定](html5_game_HOL05.md)

[6. 複数 Sprite の生成とランダムな動作](html5_game_HOL06.md)

[7. ヒット時の画像の切り替えと効果音の実装](html5_game_HOL07.md)

[8. ルールの追加](html5_game_HOL08.md)


[0. 最初に戻る](README.md)

[1. 開発環境の準備とプロジェクトの作成](html5_game_HOL01.md)

[0. 最初に戻る](README.md)

[1. 開発環境の準備とプロジェクトの作成](html5_game_HOL01.md)

[2. Canvas への画像のロード](html5_game_HOL02.md)