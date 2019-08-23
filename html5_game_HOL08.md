# 演習 8 : ルールの追加
加点、失点、ゲームオーバーなどのゲームのルールを実装します。

このハンズオンのゲームでは、雪だるまが雪をキャッチしたら加点、キャッチできずに落とした場合は失点、3 回の失点でゲームオーバーとします。
## タスク : ルールオブジェクトの実装
ゲームのルールを管理するオブジェクトに状態を持たせて管理します。
このゲームのルールを構成するのは加点と失点とゲームオーバーです。
よって、クラスからオブジェクトを生成したら、以下の処理を行っている箇所からそれぞれに該当する処理を行うメソッドを呼び出します。
* 当たり判定
* 雪の結晶を縦位置 (y座標) を先頭に戻す処理
* フレーム(アニメーション) の継続箇所

1. ルール管理オブジェクトを生成するためのクラスを定義します
    default.js のコメント「**/ * ここに演習 8 で Rule クラスを定義します*/**」を以下のコードに置き萎えます
    ```
    //ルールのインスタンスを格納する変数
    let gameRule;
    //ゲームのルールのクラス
    class Rule {
        constructor() {
            this.lifeBox = document.getElementById('lifeBox');
            this.scoreBox = document.getElementById('scoreBox');
            this.life = 3;
            this.scores = 0;
        }
        catched(vlu = 1) {
            this.scores = this.scores + vlu;
            this.scoreBox.innerText = 'SCORE : ' + this.scores;
        }
        fail() {
            this.life--;
            this.lifeBox.innerText = 'LIFE : ' + this.life;
            if (this.life <= 0) {
                ctx.font = 'bold 20px sans-serif';
                ctx.fillStyle = 'red';
                ctx.fillText('ゲームオーバーです。', getCenterPostion(canvas.clientWidth, 200), 230);
                window.cancelAnimationFrame(requestId);
                setTimeout(()=>{
                    this.reset(this);
                },500);
            }
        }
        isCatched(spriteIndex) {
            if (spriteIndex !== SNOW_PICTURE.clash) {
                this.fail();
            }
        }
        reset(that){
            //リセット処理
            for(let sprite_snow of sprite.snows){
                sprite_snow.y = getRandomPosition(SNOWS_MOVING_CONF.count,
                    SNOWS_MOVING_CONF.start_coefficient);
                sprite_snow.imageIndex = SNOW_PICTURE.blue;
            }
            that.life = 3;
            that.scores = 0;
            that.scoreBox.innerText = 'SCORE : 0';
            that.lifeBox.innerText = 'LIFE : 3';
            sprite.snow_man.x = getCenterPostion(canvas.clientWidth, sprite.snow_man.width);
            requestId = null;
        }
    }
    ```
2. Rule クラスのインスタンスを生成して変数にセットします
    **loadAssets** 関数内のコメント「**/* ここに演習 8 で Rule クラスのインスタンスを生成するコードを記述します*/**」を以下のコードで置き換えます
    ```
    //加点などを制御する Rule クラスのインスタンスを生成
    gameRule = new Rule();
    ```
3. 当たり判定後に加点処理を行うために Rule.catched 関数を呼び出します
    **hitJob** 関数内のコメント「**/* ここに演習 8 で gameRule.catched 関数を記述し、上の 3 行は削除します*/**」に従い hitJob 関数を以下のように書き換えます
    ```
     //あたり判定の際の処理
    function hitJob(sprite_snow) {
        /*削除するコード
        ctx.font = 'bold 20px sans-serif';
        ctx.fillStyle = 'red';
        ctx.fillText('ヒットしました', getCenterPostion(canvas.clientWidth, 140), 160);
        */
        //追加するコード↓
        //点数を加算します。
        gameRule.catched();

        sprite_snow.imageIndex = SNOW_PICTURE.clash;
        if (!sprite_snow.audioPlayed) {
            sprite_snow.audio.play();
            sprite_snow.audioPlayed = true;
        }
    }
    ```
4. 雪の結晶を取り逃がした(失点)かどうか判断するために雪の結晶を先頭に戻す処理のところで **Rule.isCatched** 関数で判断を行います。
    **renderFrame** 関数内のコメント「**/* ここに演習 8 で gameRule.isCatched メソッドを追加します*/**」を以下のコードで置き換えます
    ```
    //取り逃がしたどうか判断
    gameRule.isCatched(sprite_snow.imageIndex);
    ```
5. gameRule オブジェクトは失点をカウントしており、失点のたびに life プロパティが減算されています。life プロパティの値が 0 になったときにゲームオーバーとみなし全体のアニメーション処理を停止させます。
    **renderFrame** 関数の最後の行を以下のように書き換えます
    ```
    [変更前]
    requestId = window.requestAnimationFrame(renderFrame);

    [変更後]
    //ループを開始 
    if(gameRule.life>0) requestId = window.requestAnimationFrame(renderFrame);
    ```
6. [Ctrl] + [S] キーを押下して作業内容を保存します。
7. Visual Studio Code のターミナル画面から http-server を起動し、以下の URL にアクセスします。
    <p style="text-indent:2em">
    <a href="http://127.0.0.1:8080/default.html">http://127.0.0.1:8080/default.html</a></p>
8. Canvas 部分をクリックしてゲームを開始し、雪だるまが雪の結晶をキャッチしたときに [SCORE :]の数字が加算され、取り逃がした際に [LIFE :] の数字が減算され、3 回取り逃がした際にゲームオーバーとなることを確認してください。

ここまでの default.js の完全なコードは以下になります。

* [**HTML5 game and PWD HOL Ex8 sample code**](https://gist.github.com/osamum/1f03fa48e7a2acf66aaabe61d6221859)

実際のコードの動作を確認したい場合は[**ここ**](https://osamum.github.io/HTML5Game_and_PWA_Handson/results/ex8/default.html)をクリックしてください。

[9. Progressive Web App 化](html5_game_HOL09.md)

[0. 最初に戻る](README.md)

[1. 開発環境の準備とプロジェクトの作成](html5_game_HOL01.md)

[2. Canvas への画像のロード](html5_game_HOL02.md)

[3. 基本的なアニメーションの実装](html5_game_HOL03.md)

[4. 矢印キーとタッチによる制御](html5_game_HOL04.md)

[5. あたり判定](html5_game_HOL05.md)

[6. 複数 Sprite の生成とランダムな動作](html5_game_HOL06.md)

[7. ヒット時の画像の切り替えと効果音の実装](html5_game_HOL07.md)