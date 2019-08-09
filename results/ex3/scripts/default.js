(function () {
    //全体で使用する変数
    /*ここに演習 4 タスク 1 で変数を追加します。*/
    //全体で使用する変数
    let canvas;
    let ctx;
    let img = { snow: null, snow_man: null };
    let requestId;
    //DOM のロードが完了したら実行      
    document.addEventListener('DOMContentLoaded', function () {
        loadAssets();
        /*ここに演習 4 タスク 1 で setHandlers 関数の呼び出しを記述します*/
    });

    //Sprite を扱う変数オブジェクト
    let sprite = {
        //雪の結晶 Sprite が格納
        snow: null,
        //雪だるまの Sprite が格納
        snow_man: null
    };

    //Sprite クラスの定義 
    class Sprite {
        constructor(img) {
            this.image = img; //image オブジェクト 
            this.height = img.height;
            this.width = img.width;
            this.x = 0;   //表示位置 x 
            this.y = 0;  //表示位置 y 
            this.dx = 0; //移動量 x 
            this.dy = 0; //移動量 y 
            /*ここに演習 7 のタスク 1 で Getter と Setter の
           コードが追加されます*/
            //Sprite を描画するメソッド 
            this.draw = function () {
                ctx.drawImage(img, this.x, this.y);
            };
        }
    }
    
    //ゲームに必要なアセットをロードする
    function loadAssets() {
        //HTML ファイル上の canvas エレメントのインスタンスを取得   
        canvas = document.getElementById('bg');
        //アニメーションの開始
        canvas.addEventListener('click', function(){
        /*演習 6 のタスク 3 で loadCheck 関数を呼び出すように変更されます*/
            if(!requestId){renderFrame();}
        });
        //2D コンテキストを取得  
        ctx = canvas.getContext('2d');
        //image オブジェクトのインスタンスを生成  
        img.snow = new Image();
        //image オブジェクトに画像をロード 
        img.snow.src = './img/snow.png';
        /*画像読み込み完了の Canvas に 画像を表示するメソッドを記述 */
        img.snow.onload = function () {
            /*このハンドラの処理は演習 6 のタスク 1 手順 3 で書き換えます*/
            /*ここは演習 7 のタスク 1 手順 3 で変更されます*/
            //画像を引数に Sprite クラスのインスタンスを生成  
            sprite.snow = new Sprite(img.snow);
            sprite.snow.x = getCenterPostion(canvas.clientWidth, sprite.snow.width);
            sprite.snow.y = 0;
            //Sprite オブジェクトに定義した draw メソッドで描画
            sprite.snow.draw();
        };
        //雪だるまインスタンスの生成 
        img.snow_man = new Image();
        img.snow_man.src = './img/snow_man.png';
        img.snow_man.onload = function () {
            /*このハンドラの処理は演習 6 のタスク 1 手順 3 で書き換えます*/
            sprite.snow_man = new Sprite(img.snow_man);
            sprite.snow_man.x = getCenterPostion(canvas.clientWidth, sprite.snow_man.width);
            //雪だるま画像は、表示領域の底辺に画像の底辺がつくように 
            sprite.snow_man.y = canvas.clientHeight - sprite.snow_man.height;
            /*ここに演習 4 のタスク 1 で 
            getRightLimitPosition 関数を使用した処理を記述します*/
            sprite.snow_man.draw();
        };
    };

    //中央の Left 位置を求める関数
    function getCenterPostion(containerWidth, itemWidth) {
        return (containerWidth / 2) - (itemWidth / 2);
    };

    function renderFrame() { 
        //sprite.snow の y 値(縦位置) が canvas からはみ出たら先頭に戻す 
        if (sprite.snow.y > canvas.clientHeight) { sprite.snow.y = 0 }; 
        //canvas をクリア 
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        //sprite.snow の y 値を増分 
        sprite.snow.y += 2; 
    　　/*ここに演習 4 タスク 1 手順 5 のコードを追記します。*/
        //Spriteを描画 
        sprite.snow.draw();
        sprite.snow_man.draw();
        /*ここに演習 5 手順 3 で isHit関数を呼び出すコードを追加します*/
    　　/*ここに演習 7 のタスク 1 ステップ 3 で処理数のカウントを追加します*/
        //ループを開始 
        requestId =window.requestAnimationFrame(renderFrame); 
    }
    
    /*ここに演習 4 タスク 1 で setHandlers 関数を記述します。*/
    /*ここに演習 4 タスク 3 で getRightLimitPosition関数を記述します。*/
})();
