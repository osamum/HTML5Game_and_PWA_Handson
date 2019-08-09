# 演習 4 : 矢印キーとタッチによる制御の実装
キーボードの矢印キーと、タッチイベントで雪だるま画像を左右に動かせるようにします。
## タスク 1 : キーダウンイベントの取得と雪だるまの制御 
*** 
キーダウンイベントを取得し、引数として渡されるキーコードの内容を判別して雪ダルマを左右に動かします。

具体的な手順は以下のとおりです。
1.	キー コード判別用と、タッチの識別で使用する変数を追加します。
    全体を囲んでいる即時実行関数の先頭箇所にあるコメント「/*ここに演習 4 タスク 1 で変数を追加します。*/」を以下のコードで置き換えます。
    ```
    //矢印キーのコード 
    let KEY_CODE = {
            left : 37, right:39
        };
    //取得したキーの値
    let key_value = 0; 
    //タッチ開始時の位置
    let touchStartPos = 0;
    ```
2. キーダウンとキーアップのイベントを取得すハンドラを記述しますが、あとで記述するタッチイベントのハンドラとまとめるために setHandlers 関数を作成します。
renderFrame 関数の定義箇所の上にあるコメント「/* ここに演習 4 タスク 1 で setHandlers 関数の定義を記述します*/」を以下のコードで置き換えます。
    ```
    function setHandlers(){
        //キーイベントの取得 (キーダウン) 
        document.addEventListener('keydown', (evnt)=> { 
            if (evnt.which == KEY_CODE.left) { 
                key_value = -3; 
            } else if (evnt.which == KEY_CODE.right) {  
                key_value = 3; 
            } 
        }); 
        //雪だるまが進みっぱなしにならないように、 キーが上がったら 0 に  
        document.addEventListener('keyup', ()=> { 
        key_value = 0; 
        }); 
        /* ここに演習 4 のタスク 2 でタッチイベントのハンドラを記述*/
    };

    ```
3. 定義した setHandlers 関数を呼び出すコードを記述します。

    DOMContentLoaded イベントハンドラ内のコメント「/* ここに演習 4 タスク 1 で setHandlers 関数の呼び出しを記述します */」を以下のコードで置き換えます。
    ```
    setHandlers();
    ```
4. 雪だるまが Canvas の右端からはみ出ないよう計算する getRightLimitPosition 関数を記述します。
    
    default.js 下部にあるコメント「/* ここに演習 4 タスク 1 で getRightLimitPosition関数を記述します。*/」を以下のコードで置き換えます。
    ```
    //雪だるまを動かせる右の限界位置を算出する 
    function getRightLimitPosition(containerWidth, itemWidth)
    { 
         return containerWidth - itemWidth; 
    }
    ```
5. loadAssets 関数中で雪だるまの画像をロードしている箇所に getRightLimitPosition 関数の呼び出しを追記し、sprite.snow_man の limit_rightPosition プロパティに返り値をセットするようにします。limit_rightPosition プロパティは、あらかじめ定義はされていませんか、JavaScript では値がセットされたと同時にプロパティが作られるので問題ありません。

    loadAssets 関数の中のコメント「/* ここに演習 4 のタスク 1 で getRightLimitPosition 関数を使用した処理を記述します*/」を以下のコードで置き換えます。
    ```
    //右側に動かせる最大値を設定 
    sprite.snow_man.limit_rightPosition = getRightLimitPosition(
        canvas.clientWidth, sprite.snow_man.width);
    ```
6. renderFrame 関数に、雪だるま画像の横位置を書き換えるコードを追記します。renderFrame 関数内のコメント「/* ここに演習 4 タスク 1 手順 6 のコードを追記します。*/」を以下のコードで置き換えます。
    ```
    // sprite.snow_man の x 値が動作範囲内かどうか 
    if ((sprite.snow_man.x < sprite.snow_man.limit_rightPosition && key_value > 0) 
      || (sprite.snow_man.x >= 3 && key_value < 0)) { 
           //sprite.snow_man の x 値を増分 
           sprite.snow_man.x += key_value; 
        }       
    ```
7. [Ctrl] + [S] キーを押下して作業内容を保存します。
8. Visual Studio Code のターミナル画面から http-server を起動し、以下の URL にアクセスします。
    <p style="text-indent:2em">
    <a href="http://127.0.0.1:8080/default.html">http://127.0.0.1:8080/default.html</a></p>
6. Canvas 部分をクリックし、雪の結晶が動き始めたらキーボードの矢印キーを押下して、雪だるまが左右に動くか確認してください。


## タスク 2 : タッチイベントの取得と雪だるまの制御
***
タッチイベント発生時の位置とスワイプ時の位置から移動量を計算し、雪ダルマを左右に動かします。
手順は以下のとおりです。

1. setHandlers 関数にタッチ関連のイベントハンドラを追加します。同関数内のコメント「/* ここに演習 4 のタスク 2 でタッチイベントのハンドラを記述*/」を以下のコードに置き換えます。
    ```
    //Canvas へのタッチイベント設定 
    canvas.addEventListener('touchstart', (evnt)=> {
        touchStartPos = evnt.touches[0].clientX;
    });
    //左右のスワイプ量を雪だるまの移動量に  
    canvas.addEventListener('touchmove', (evnt)=> { 
        key_value =Math.round((evnt.touches[0].clientX - touchStartPos)/10);
    });  
    //雪だるまが進みっぱなしにならないように、 タッチが完了したら 0 に  
    canvas.addEventListener('touchend', (evnt)=> { 
        key_value = 0; 
    }); 
    ```
2. [Ctrl] + [S] キーを押下して作業内容を保存します。
3. タッチデバイスのズームやピンチ、長押しでの選択機能を無効可します。
    Visual Studio Code の左のツリーから default.css を開き、以下のマークアップを貼り付けます。
    ```
    body{
        touch-action: none;
        user-select:none; 
        -webkit-touch-callout: none;
    }
    ```
4. [Ctrl] + [S] キーを押下して作業内容を保存します。
5. Visual Studio Code のターミナル画面から http-server を起動します。
    <p style="text-indent:2em">
    <a href="http://127.0.0.1:8080/default.html">http://127.0.0.1:8080/default.html</a></p>
6. engrok  コマンドプロンプトを起動し、cd コマンドで作業ディレクトリを ngrok.exe が配置されているディレクトリに切り替えます
7. 以下のコマンドを実行します
    <p style="text-indent:2em">ngrok http 8080 --host-header=localhost</p>
5. エコーされた内容の Foewarding の横に表示された http、もしくは https のドメイン名を使用してアクセスします

    <img src="images/engrok.png">
    たとえば、ngrok から返されたドメイン名が http://9fcf38b6.engrok.io だった場合は以下の URL でインターネットからローカルの default.html にアクセスすることができます。
    <p style="text-indent:2em">http://9fcf38b6.engrok.io/default.html</p>

7. スマートフォンの Web ブラウザーからアクセスして、ページが表示されること、左右のスワイプで雪だるまを左右に動かせることを確認してください。

ここまでの default.js の完全なコードは以下になります。
[⇒ HTML5 game and PWD HOL Ex4 sample code](https://gist.github.com/osamum/fb7b00f4d8b3d23e68a36bbbf606a767)



[5. 当たり判定](html5_game_HOL05.md)

[6. 複数 Sprite の生成とランダムな動作](html5_game_HOL06.md)

[7. ヒット時の画像の切り替えと効果音の実装](html5_game_HOL07.md)

[8. ルールの追加](html5_game_HOL08.md)


[0. 最初に戻る](README.md)

[1. 開発環境の準備とプロジェクトの作成](html5_game_HOL01.md)

[2. Canvas への画像のロード](html5_game_HOL02.md)

[3. 基本的なアニメーションの実装](html5_game_HOL03.md)