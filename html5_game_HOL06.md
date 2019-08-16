# 演習 6 : 複数の Sprite の生成とランダム処理
この演習では、降ってくる雪の結晶を増やし、それら生成された複数の雪の結晶の実態 (インスタンス) を制御する機能を実装します。
## タスク 1  : Sprite オブジェクトの定義
このゲームでは、ゲーム内で扱うキャラクターを **Sprite** という**クラス**から**インスタンス**(実体)を生成して使用しています。インスタンスは、元となるひとつのクラスの定義からいくつも生成することができ、それぞれに状態を保持させることができまかす。この性質を利用して、雪の結晶を複数表示して制御します。

具体的な手順は以下のとおりです。
1. default.js の前半にあるオブジェクト変数 **sprite** の定義の中の **snow: null**, を以下のように **snows:[],** に書き換えます。

(※)変数名は **snow** から **snows** に変更されるので注意してください。

    ```
    //Sprite を扱う変数オブジェクト
    let sprite = {
        //雪の結晶 Sprite が格納
        snows:[], 
        //雪だるまの Sprite が格納
        snow_man: null
    };
    ```
2. 雪の結晶が複数表示される際の雪の結晶の数と、隣り合う結晶どうしの間隔を定義します。

    オブジェクト変数 **sprite** の定義の下にあるコメント「**/* ここに演習 6 タスク 1 で SNOWS_MOVING_CON オブジェクト変数を定義します。*/**」を以下のコードで置き換えます。
    ```
    //雪の結晶の動作が使用する定数
    let SNOWS_MOVING_CONF = {
        //表示する雪の結晶の数 
        count : 7,
        //隣り合う 雪の結晶画像の x 位置の差分
        neighor_distance : 56,
        /* ここに演習 6 タスク 2 で start_coefficient プロパティを記述します。*/
        /* ここに演習 7 タスク 1 で switch_count プロパティを記述します。*/
    };
    /* ここに演習 7 タスク 1 でスプライト関連の変数をいくつか記述します。*/
    ```
3. **Sprit**e 関数から複数のインスタンスを生成するように **loadAssets** 関数の中の **img.snow.onload** イベントハンドラを以下のコードに書き換えます。

    具体的には、以下のコードのコメント「**//書き換え : ここから ->」から「//<- 書き換え : ここまで**」の間のコードで置き換えます。
    ```
    /*画像読み込み完了の Canvas に 画像を表示するメソッドを記述 */
    img.snow.onload = ()=> {
        //書き換え : ここから ->
        for (let i = 0; i < SNOWS_MOVING_CONF.count; i++) {
            //画像を引数に Sprite クラスのインスタンスを生成  
            /*ここは演習 7 のタスク 1 手順 3 で変更されます*/
            let sprite_snow = new Sprite(img.snow);
            sprite_snow.dy = 1;
            sprite_snow.dx = SNOWS_MOVING_CONF.neighor_distance;
            sprite_snow.x = i * sprite_snow.dx;
            /*演習 6 のタスク 2 ステップ 3 で
            sprite_snow.y を getRandomPosition 関数でセット*/
            /*ここに演習 7 のタスク 2 でオーディオ再生用のコードを追加します*/
            sprite.snows.push(sprite_snow);
            sprite_snow = null;
        }
        //<- 書き換え : ここまで
    };
    ```
4. 書き換えた **loadAssets** 関数の **img.snow.onload** イベントハンドラ内では、雪の結晶用の Sprite オブジェクトのインスタンスをループして複数個生成しています。

    アニメーション時には、この生成された各インスタンスに対して処理を行う必要があるので、それらが格納されている配列 **sprite_snows** をループして処理を行います。

    これを踏まえ **renderFrame** 関数を以下のように書き換えます。

    具体的には以下のコード中で 「**//削除 ->**」 と書かれている行のコードやコメントを削除し、コメント「**追加 -> ここから**」 から「**//追加 <- ここまで**」の間のコードを追加します。
    ```
    function renderFrame() {
        //削除 -> //sprite.snow の y 値(縦位置) が canvas からはみ出たら先頭に戻す 
        //削除 -> if (sprite.snow.y > canvas.clientHeight) { sprite.snow.y = 0 }; 
        //canvas をクリア 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //削除 -> //sprite.snow の y 値を増分 
        //削除 -> sprite.snow.y += 2; 

        // sprite.snow_man の x 値が動作範囲内かどうか 
        if ((sprite.snow_man.x < sprite.snow_man.limit_rightPosition && key_value > 0)
            || (sprite.snow_man.x >= 3 && key_value < 0)) {
            //img.snow_man の x 値を増分 
            sprite.snow_man.x += key_value;
        }
        //追加 -> ここから
        let length = sprite.snows.length;
        for (let i = 0; i < length; i++) {
            let sprite_snow = sprite.snows[i];
            //sprite_snow の y 値(縦位置) が canvas からはみ出たら先頭に戻す 
            if (sprite_snow.y > canvas.clientHeight) {
                /*ここに演習 8 で gameRule.isCatched メソッドを追加します*/
                sprite_snow.y = 0;
                /* ここに演習 7 のタスク 1 手順 8 でコードを追加します*/
            };
            //sprite_snow の y 値を増分 
            sprite_snow.y += sprite_snow.dy;
            //Spriteを描画 
            sprite_snow.draw();
            //当たり判定 
            if (isHit(sprite_snow, sprite.snow_man)) { hitJob() };
            sprite_snow = null;
        }
        //追加 <- ここまで

        //Spriteを描画 
        //削除 -> sprite.snow.draw();
        sprite.snow_man.draw();
        //削除 -> //あたり判定
        //削除 -> if(isHit(sprite.snow,sprite.snow_man)){hitJob()};

        /*ここに演習 7 のタスク 1 ステップ 3 で処理数のカウントを追加します*/
        //ループを開始 
        requestId = window.requestAnimationFrame(renderFrame);
    }
    ```
5. [Ctrl] + [S] キーを押下して作業内容を保存します。
6. Visual Studio Code のターミナル画面から http-server を起動し、以下の URL にアクセスします。
    <p style="text-indent:2em">
    <a href="http://127.0.0.1:8080/default.html">http://127.0.0.1:8080/default.html</a></p>
7. 表示されたページの Canvas 部分をクリックし、雪の結晶が複数個降ってくることを確認してください。

ここまでの default.js の完全なコードは以下になります。

[**HTML5 game and PWD HOL Ex6 task1 sample code**](https://gist.github.com/osamum/047b98b27fa209af9b128afa40c026da)

実際のコードの動作を確認したい場合は[ここ](https://osamum.github.io/HTML5Game_and_PWA_Handson/results/ex6_1/default.html)をクリックしてください。



## タスク 2 : 雪の結晶の降るタイミングの不確定化
***
雪の結晶が複数個降ってくるようになりましたが、各々のタイミング同じであるため一列になって降ってくるためゲーム性に欠けます。

このタスクでは JavaScript の Math.random 関数を利用し、雪の結晶がランダムに出現する実装を行います。

手順は以下の通りです。
1. プログラム全体を包括する即時実行関数の最後にランダムな値を生成するための **getRandomPosition** 関数を記述します。

    具体的には、default.js の下の方にあるコメント「**/* ここに演習 6 タスク 2 で getRandomPosition 関数を記述します。*/**」を以下のコードで置き換えます。
    ```
    //雪の結晶の縦位置の初期値をランダムに設定する 
    function getRandomPosition(colCount, delayPos) { 
        return Math.floor(Math.random() * colCount) * delayPos; 
    };
    ```
2. **Sprite** クラスの定義の上に、以下のように 開始の際のマイナス値を得るための係数 –50 を宣言します。

    具体的には、**SNOWS_MOVING_CONF** オブジェクトの定義内にあるコメント「**/* ここに演習 6 タスク 2 で start_coefficient プロパティを記述します。*/**」を以下の記述で置き換えます。
    ```
    //開始時のマイナス値係数(出現を遅らせるため)
    start_coefficient : -50,
    ```
    なお、前の行の **neighor_distance: 58** の最後に , (カンマ) を追加しないとエラーになるので注意してください。
3. **loadAssets** 関数内の **sprite_snow.y** プロパティの設定箇所を変更します。
    
    具体的にはコメント「**/* 演習 6 のタスク 2 ステップ 3 で sprite_snow.y を getRandomPosition 関数でセット*/**」を以下のコードに置き換えます。
    ```
    sprite_snow.y = getRandomPosition(SNOWS_MOVING_CONF.count, 
                             SNOWS_MOVING_CONF.start_coefficient);
    /*ここに演習 7 の手順 1 ステップ 8 でコードを追加します*/
    ```
4. [Ctrl] + [S] キーを押下して作業内容を保存します。
5. Visual Studio Code のターミナル画面から http-server を起動し、以下の URL にアクセスします。
    <p style="text-indent:2em">
    <a href="http://127.0.0.1:8080/default.html">http://127.0.0.1:8080/default.html</a></p>
7. 表示されたページの Canvas 部分をクリックし、雪の結晶がランダムに降ってくることを確認してください。

[**HTML5 game and PWD HOL Ex6 task2 sample code**](https://gist.github.com/osamum/a5079656701f528327b48b4a9d73dbf4)

実際のコードの動作を確認したい場合は[ここ](https://osamum.github.io/HTML5Game_and_PWA_Handson/results/ex6_2/default.html)をクリックしてください。


## タスク 3 : アセットファイルの読み込みの待機処理
***
このハンズオンで作成しているゲームは、使用している画像のサイズが小さく動作の開始も画面をクリックした後に行われることから、画像などのアセット類がロードされる前にそれらにアクセスしてエラーになる、といったことはあまり心配する必要はありません。

しかし今後新しいゲームを開発するにおいて、使用する画像の数やサイズが増えたり、オーディオや動画のようなサイズの大きなファイルを扱う際には、ゲームで使用するアセット全体のロードの完了に時間がかかる場合があります。そういった問題に対処するためのアセット類がロードされたかどうかをチェックする関数を作成します。

手順は以下のとおりです。
1. ゲームで使用するアセット類のロードが完了するまで待機する **loadCheck** 関数を以下のように記述します。
    具体的には、default.js の下の方にあるコメント「**/* ここに演習 6 タスク 3 で loadCheck 関数を記述します。*/**」を以下のコードで置き換えます。
    ```
    //ゲームで使用する Splite オブジェクトが準備されたかどうかを判断 
    function loadCheck() { 
        if (sprite.snows.length && sprite.snow_man) { 
            //準備ができたらアニメーションを開始 
            window.requestAnimationFrame(renderFrame); 
        } else { 
            //まだの場合はループして待機 
            window.requestAnimationFrame(loadCheck); 
        } 
    }
    ```
2. **loadAssets** 関数内の canvas の **click イベントハンドラ**内のコードを **loadCheck** 関数を呼び出すように書き換えます。

    具体的には **loadAssets** 関数内のコメント「**/* 演習 6 のタスク 3 で loadCheck 関数を呼び出すように変更されます*/**」の下の行のコードを以下のように書き換えます。
    ```
    if(!requestId){loadCheck();}
    ```
3. [Ctrl] + [S] キーを押下して作業内容を保存します。
4. Visual Studio Code のターミナル画面から http-server を起動し、以下の URL にアクセスします。
    <p style="text-indent:2em">
    <a href="http://127.0.0.1:8080/default.html">http://127.0.0.1:8080/default.html</a></p>
5. 表示されたページの Canvas 部分をクリックし、作業前と同様に動作することを確認してください。

ここまでの default.js の完全なコードは以下になります。

[**HTML5 game and PWD HOL Ex6 task3 sample code**](https://gist.github.com/osamum/09b9087313a9ccf035f3a94bc362766f)


⇒ 次の「[**7. ヒット時の画像の切り替えと効果音の実装**](html5_game_HOL07.md)」に進む

# 解説
## クラスの使用
このゲームに表示される雪の結晶の数を増やすことは、image オブジェクトをCanvan に追加する処理を複数回記述することで実装することもできます。
ただ、それでは同じような処理を何度も繰り返し記述する必要が出てきたり、追加した複数の画像の管理が煩雑になります。

これを効率よく行うには、画像も含め、雪の結晶が動作するのに必要なデータをまとめたクラスを定義し、必要に応じて必要個数ぶんのインスタンスを生成します。ちなみに「**クラス**」とは「**オブジェクト**」の定義(設計図 のようなもの) であり、new することでその定義されたオブジェクトの実体 (インスタンス) を生成して増やすことができます。生成されたインスタンスはそれぞれのプロパティに固有の値を保持することができます。

## JavaScript におけるクラスの定義
ECMA Script 2015(ECMA Script 6) から、JavaScript でもクラスを定義する構文が使用できるようになりましたが、それ以前は function(関数) を疑似的なクラスとして使用していました。

例えば、以下は Human という function を定義し、その後 new キーワードで 2 つの異なるインスタンスを生成しています。ちなみに new でインスタンスを生成する関数は名前の先頭を大文字にするのが JavaScript では慣例となっています。
```
//Human クラスの定義 (ECMA Script 2015 以前)
var Human = function(name){ 
        this.name = name; 
        this.myNameIs = function(){return name}; 
    }; 
//Human クラスから異なる情報をもったインスタンスを生成 
var taro = new Human(‘タロウ’) 
var jiro = new Human(‘ヂロウ’) 
console.log(taro.myNameIs());  //’タロウ’ が返る 
console.log(jiro.myNameIs());  //’ヂロウ’ が返る
```
## Sprite (スプライト) について
ゲーム画面に表示されるキャラクターなどの要素を慣例的に Sprite (スプライト) と呼びます。スプライトとは、もともとは霊や精神などを意味するものです。

(※) 画像処理の方法についても スプライト と呼ばれるものがありますが、ここでのスプライトはゲームのキャラクタを表します。
このハンズオンのゲームでは、ゲーム中の雪の結晶を制御するための Sprite クラスを定義し、インスタンス化された複数のオブジェクトは配列 sprite.snows[] に格納されます。 

## 雪の結晶の降るタイミングの不確定化
Sprite クラスから生成した 7 つの雪の結晶の降るタイミングを変更するには、縦の位置を示すプロパティである y の値を各々変更します。

具体的には、現在初期値が 0 になっている雪の結晶インスタンスの y プロパティに、7 パターンの異なるマイナス値を指定します。なぜマイナス値かというと、プラスの値だと、Canvas 内の、本来なら雪の結晶が落ちていく途中に表示されてしまうからです。
1 ～ 7 間の異なる値は以下の式で得ることができます。
```
1 ～ 7 間の異なる値 = Math.floor(Math.random() * 7 )
```
そして、ここに雪の結晶の降るタイミングとして不自然にならないマイナス値を得るために –50 を掛けその結果を雪の結晶の移動開始位置 (プロパティ y の初期値)とします。ちなみにこの –50 という数値は数学的根拠があるものではなく、目分量的なものです。
```
雪の結晶の y プロパティの初期値 = Math.floor(Math.random() * 6 ) * -50;
```
この式を使用してハンズオン中のコードで getRandomPosition 関数を定義します。

詳しくはハンズオンのコードを確認してください。

### 目次

[7. ヒット時の画像の切り替えと効果音の実装](html5_game_HOL07.md)

[8. ルールの追加](html5_game_HOL08.md)


[0. 最初に戻る](README.md)

[1. 開発環境の準備とプロジェクトの作成](html5_game_HOL01.md)

[2. Canvas への画像のロード](html5_game_HOL02.md)

[3. 基本的なアニメーションの実装](html5_game_HOL03.md)

[4. 矢印キーとタッチによる制御](html5_game_HOL04.md)

[5. あたり判定](html5_game_HOL05.md)