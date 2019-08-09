# 演習 7 : ヒット時の画像の切り替えと効果音の実装
あたり判定時の画像の切り替えと効果音の再生機能を実装します。
## タスク 1 : 降雪時の画像の切り替えとあたり判定時の画像の変更
あたり判定時に、以下のような 1 ファイルに収められた複数の図案から任意のものを表示して画像を切り替えます。この方法は「スプライト」と呼ばれますが、ゲームプログラミングで慣例的に使用されるゲーム内のキャラクターを表す「Sprite」とは別のものです。

<img src="images/sprite.png" width="200px">

1. 雪の結晶の動作が使用する定数 NOWS_MOVING_CONF の定義に、スプライトとして切り出す画像の内容と、インデックスを示す定数と切り出す画像のサイズ、画像の切り替えに使用する変数などを定義します。

    具体的には NOWS_MOVING_CONF 内にあるコメント「/* ここに演習 7 タスク 1 で switch_count プロパティを記述します。*/」を以下のコードで置き換えます。
    ```
    //雪の結晶画像を切り替える閾値  
    switch_count : 24
    ```
    なお、前の行の start_coefficient : -50 の最後に , (カンマ) を追加しないとエラーになるので注意してください。
2. スプライトの画像の切り出しなどに使用するオブジェクトを定義します。
    手順 1 の作業を行った近くにあるコメント「/* ここに演習 7 タスク 1 でスプライト関連の変数をいくつか記述します。*/」を以下のコードで置き換えます。
    ```
    //スプライト画像のインデックス
    let SNOW_PICTURE = {blue : 0, white : 1, clash : 2};
    //雪の結晶の画像サイズ 
    let SNOW_SIZE = {height : 32, width : 32};
    //雪ダルマの画像サイズ 
    let SNOW_MAN_SIZE = {height : 80, width : 80};
    //画面の書き換え数をカウントする 
    let loopCounter = 0;
    ```
3. スプライトを使用して画像をインデックスで指定できるように Sprite クラスの constructor の引数と、this.height、this.width の設定を以下のように変更します。

    constructor の引数
    ```
    Sprite クラス

    [変更前]
    constructor(img) {　
    
    [変更後]
    constructor(img, sp_width, sp_height){ 

    ```
    this.height、this.width の設定
    ```
    [変更前]
    this.height = img.height;
    this.width = img.width;
    
    [変更後]
    this.height = (sp_height)?sp_height : img.height;
    this.width = (sp_width)?sp_width : img.width; 
    ```
4.  Sprite クラスにプロパティが設定されたときに動作する Getter と Setter を追加します。
    Sprite クラス内のコメント「/* ここに演習 7 のタスク 1 で Getter と Setter のコードが追加されます*/」を以下のコードで置き換えます。
    ```
    let _offset_x_pos = 0; 
    let that = this; 
    //使用するインデックスを設定するための Setter/Getter 
    let _imageIndex = 0; 
    Object.defineProperty(this, 'imageIndex', { 
        get: function () { 
            return _imageIndex; 
        }, 
        set: function (val) { 
            _imageIndex = val; 
            _offset_x_pos = that.width * _imageIndex; 
        } 
    }); 
    ```
5. Sprite クラス内の draw メソッドを以下のように書き換えます。
    ```
    [変更前]
    //Sprite を描画するメソッド 
    this.draw = ()=> {
        ctx.drawImage(img, this.x, this.y);
    };

    [変更後]
    //Sprite を描画するメソッド 
    this.draw = ()=> { 
        ctx.drawImage(img, _offset_x_pos, 0, that.width,that.height, 
                         that.x, that.y, that.width, that.height); 
    }; 
    ```
6. Sprite クラスのコンストラクタの引数の変更に合わせ loadAssets 関数内で Sprite クラスのインスタンスを生成している箇所を各々以下のように書き換えます。画像のファイルが snow.png から sp_snow.png に変更されているので注意してください。
    ```
    //image オブジェクトに画像をロード  
    //変更前 : img.snow.src = './img/snow.png';
    //変更後 ↓
    img.snow.src = './img/sp_snow.png';

    /*画像読み込み完了のイベントハンドラに Canvas に 
           画像を表示するメソッドを記述 */  
    img.snow.onload = function () { 
        for (let i = 0; i < SNOWS_MOVING_CONF.count; i++) { 
            //変更前 : let sprite_snow = new Sprite(img.snow);
            //変更後 ↓
            let sprite_snow = new Sprite(img.snow, SNOW_SIZE.width, SNOW_SIZE.height); 
            sprite_snow.dy = 1; 
            sprite_snow.dx = SNOWS_MOVING_CONF.neighor_distance; 
            sprite_snow.x = i * sprite_snow.dx; 
            sprite_snow.y = getRandomPosition(SNOWS_MOVING_CONF.count, 
                            SNOWS_MOVING_CONF.start_coefficient); 
            sprite_snows.push(sprite_snow); 
            sprite_snow = null; 
        } 
    }; 
    //雪だるまインスタンスの生成 
    img.snow_man = new Image(); 
    img.snow_man.src = '/img/snow_man.png'; 
    img.snow_man.onload = () => {
        //変更前 : sprite.snow_man = new Sprite(img.snow_man);
        //変更後 ↓
        sprite.snow_man = new Sprite(img.snow_man, SNOW_MAN_SIZE.width, 
                                                 SNOW_MAN_SIZE.height);
        sprite.snow_man.x = getCenterPostion(canvas.clientWidth, img.snow_man.width); 
        //雪だるま画像は、表示領域の底辺に画像の底辺がつくように 
        sprite.snow_man.y = canvas.clientHeight - img.snow_man.height;
        //右側に動かせる最大値を設定 
        sprite.snow_man.limit_rightPosition = getRightLimitPosition(canvas.clientWidth,
            img.snow_man.width); 
    };
    ```
7. renderFrame 関数の最後の処理である window.requestAnimationFrame(renderFrame); の前の行に処理数のカウントを行うコードを追加します。

    具体的には、renderFrame 関数内のコメント「/* ここに演習 7 のタスク 1 手順 7 で処理数のカウントを追加します*/」を以下のコードに置き換えます。
    ```
    //処理数のカウント 
    if (loopCounter == SNOWS_MOVING_CONF.switch_count) { loopCounter = 0; } 
    loopCounter++;
    ```
8.	renderFrame 関数内の sprite_snow の y 値(縦位置) が canvas からはみ出たら先頭に戻す処理に以下のように追記します。
    具体的には、renderFrame 関数内のコメント「/* ここに演習 7 のタスク 1 手順 8 でコードを追加します*/」を以下のコードに置き換えます。
    ```
        sprite_snow.imageIndex = SNOW_PICTURE.blue; 
    }else {  
        if (loopCounter == SNOWS_MOVING_CONF.switch_count  
        && sprite_snow.imageIndex != SNOW_PICTURE.clash) { 
           sprite_snow.imageIndex = (sprite_snow.imageIndex == SNOW_PICTURE.blue)  
                               　? SNOW_PICTURE.white : SNOW_PICTURE.blue; 
    } 
    ```
9. あたり判定時の雪の結晶画像の切り替え処理を hitJob 関数中に以下のように追記します。
    ```
    //あたり判定の際の処理
    //変更前 : function hitJob() {
    //変更後 ↓
    function hitJob(sprite_snow) {
        ctx.font = 'bold 20px 'メイリオ', sans-serif;'; 
        ctx.fillStyle = 'red'; 
        ctx.fillText('ヒットしました', getCenterPostion(canvas.clientWidth, 140), 160); 
        //追加したコード↓
        sprite_snow.imageIndex = SNOW_PICTURE.clash;
    }
    ```
10. 前の手順での hitJob 関数の引数の変更に合わせ、renderFrame 関数中の hitJob 関数の呼び出しを以下のように変更します。
    ```
    [変更前]
    //当たり判定 
    if (isHit(sprite_snow, sprite.snow_man)) { hitJob() };

    [変更後]
    //当たり判定 
    if(isHit(sprite_snow, sprite.snow_man)){hitJob(sprite_snow)};
    ```
11.  [Ctrl] + [S] キーを押下して作業内容を保存します。
12. Visual Studio Code のターミナル画面から http-server を起動し、以下の URL にアクセスします。
    <p style="text-indent:2em">
    <a href="http://127.0.0.1:8080/default.html">http://127.0.0.1:8080/default.html</a></p>
13. 表示されたページの Canvas 部分をクリックし、雪の結晶が降ってくる際に点滅し、雪だるまと当たった際には画像が変更されることを確認してください。

ここまでの default.js の完全なコードは以下になります。

[⇒ HTML5 game and PWD HOL Ex7 sample code](https://gist.github.com/osamum/50551b30d92be53a0958ba855d2b1896)