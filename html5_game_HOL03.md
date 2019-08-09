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