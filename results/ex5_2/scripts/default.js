(function () {
    //全体で使用する変数
    //矢印キーのコード 
    let KEY_CODE = {
        left: 37, right: 39
    };
    //取得したキーの値
    let key_value = 0;
    //タッチ開始時の位置
    let touchStartPos = 0;
    //全体で使用する変数
    let canvas;
    let ctx;
    let img = { snow: null, snow_man: null };
    let requestId;
    //DOM のロードが完了したら実行      
    document.addEventListener('DOMContentLoaded', () => {
        loadAssets();
        setHandlers();
    });

    //Sprite クラスの定義 
    class Sprite {
        constructor(img) {
            this.image = img; //image オブジェクト 
            this.height = img.height;
            this.width = img.width;
            this.x = 0; //表示位置 x 
            this.y = 0; //表示位置 y 
            this.dx = 0; //移動量 x 
            this.dy = 0; //移動量 y
            /*ここに演習 7 のタスク 2 でオーディオ再生用の
           プロパティが追加されます*/
            /*ここに演習 7 のタスク 1 で Getter と Setter の
           コードが追加されます*/
            //Sprite を描画するメソッド 
            this.draw = () => {
                ctx.drawImage(img, this.x, this.y);
            };
        }
    }

    //Sprite を扱う変数オブジェクト
    let sprite = {
        //雪の結晶 Sprite が格納
        snows: [],
        //雪だるまの Sprite が格納
        snow_man: null
    };

    //雪の結晶の動作が使用する定数
    let SNOWS_MOVING_CONF = {
        //表示する雪の結晶の数 
        count: 7,
        //隣り合う 雪の結晶画像の x 位置の差分
        neighor_distance: 56,
        //開始時のマイナス値係数(出現を遅らせるため)
        start_coefficient: -50
        /* ここに演習 7 タスク 1 で switch_count プロパティを記述します。*/
    };
    /* ここに演習 7 タスク 1 でスプライト関連の変数をいくつか記述します。*/

    /*ここに演習 8 で Rule クラスを定義します*/
    //ゲームに必要なアセットをロードする
    function loadAssets() {
        /*ここに演習 8 で Rule クラスのインスタンスを生成するコードを記述します*/
        //HTML ファイル上の canvas エレメントのインスタンスを取得   
        canvas = document.getElementById('bg');
        //アニメーションの開始
        canvas.addEventListener('click', () => {
            /*演習 6 のタスク 3 で loadCheck 関数を呼び出すように変更されます*/
            if (!requestId) { renderFrame(); }
        });

        //2D コンテキストを取得  
        ctx = canvas.getContext('2d');
        //image オブジェクトのインスタンスを生成  
        img.snow = new Image();
        //image オブジェクトに画像をロード 
        img.snow.src = './img/snow.png';
        /*画像読み込み完了の Canvas に 
        画像を表示するメソッドを記述 */
        img.snow.onload = () => {
            for (var i = 0; i < SNOWS_MOVING_CONF.count; i++) {
                //画像を引数に Sprite クラスのインスタンスを生成  
                /*ここは演習 7 のタスク 1 手順 3 で変更されます*/
                var sprite_snow = new Sprite(img.snow);
                sprite_snow.dy = 1;
                sprite_snow.dx = SNOWS_MOVING_CONF.neighor_distance;
                sprite_snow.x = i * sprite_snow.dx;
                sprite_snow.y = getRandomPosition(SNOWS_MOVING_CONF.count,
                    SNOWS_MOVING_CONF.start_coefficient);
                /*ここに演習 8 で gameRule.isCatched メソッドを追加します*/
                /*ここに演習 7 の手順 1 ステップ 8 でコードを追加します*/
                /*ここに演習 7 のタスク 2 でオーディオ再生用のコードを追加します*/
                sprite.snows.push(sprite_snow);
                sprite_snow = null;
            }
        };
        //雪だるまインスタンスの生成 
        img.snow_man = new Image();
        img.snow_man.src = './img/snow_man.png';
        img.snow_man.onload = () => {
            /*このハンドラの処理は演習 6 のタスク 1 手順 3 で書き換えます*/
            sprite.snow_man = new Sprite(img.snow_man);
            sprite.snow_man.x = getCenterPostion(canvas.clientWidth, sprite.snow_man.width);
            //雪だるま画像は、表示領域の底辺に画像の底辺がつくように 
            sprite.snow_man.y = canvas.clientHeight - sprite.snow_man.height;
            //右側に動かせる最大値を設定 
            sprite.snow_man.limit_rightPosition = getRightLimitPosition(
                canvas.clientWidth, sprite.snow_man.width);
            sprite.snow_man.draw();
        };
    };

    function setHandlers() {
        //キーイベントの取得 (キーダウン) 
        document.addEventListener('keydown', (evnt) => {
            if (evnt.which == KEY_CODE.left) {
                key_value = -3;
            } else if (evnt.which == KEY_CODE.right) {
                key_value = 3;
            }
        });
        //雪だるまが進みっぱなしにならないように、 キーが上がったら 0 に  
        document.addEventListener('keyup', () => {
            key_value = 0;
        });
        //Canvas へのタッチイベント設定 
        canvas.addEventListener('touchstart', (evnt) => {
            touchStartPos = evnt.touches[0].clientX;
        });
        //左右のスワイプ量を雪だるまの移動量に  
        canvas.addEventListener('touchmove', (evnt) => {
            key_value = Math.round((evnt.touches[0].clientX - touchStartPos) / 10);
        });
        //雪だるまが進みっぱなしにならないように、 タッチが完了したら 0 に  
        canvas.addEventListener('touchend', (evnt) => {
            key_value = 0;
        });
    };

    //中央の Left 位置を求める関数 
    function getCenterPostion(containerWidth, itemWidth) {
        return (containerWidth / 2) - (itemWidth / 2);
    };

    function renderFrame() {

        //canvas をクリア 
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // sprite.snow_man の x 値が動作範囲内かどうか 
        if ((sprite.snow_man.x < sprite.snow_man.limit_rightPosition && key_value > 0)
            || (sprite.snow_man.x >= 3 && key_value < 0)) {
            //sprite.snow_man の x 値を増分 
            sprite.snow_man.x += key_value;
        }
        let length = sprite.snows.length;
        for (var i = 0; i < length; i++) {
            var sprite_snow = sprite.snows[i];
            //sprite_snow の y 値(縦位置) が canvas からはみ出たら先頭に戻す 
            if (sprite_snow.y > canvas.clientHeight) {
                /*演習 6 のタスク 2 ステップ 3 で
                 getRandomPosition 関数から値を取得するように変更 */
                sprite_snow.y = 0;
            };
            //sprite_snow の y 値を増分 
            sprite_snow.y += sprite_snow.dy;
            //Spriteを描画 
            sprite_snow.draw();
            //当たり判定 
            if (isHit(sprite_snow, sprite.snow_man)) { hitJob() };
            sprite_snow = null;
        }
        //Spriteを描画 
        sprite.snow_man.draw();

        /*ここに演習 7 のタスク 1 手順 7 で処理数のカウントを追加します*/
        //ループを開始 
        requestId = window.requestAnimationFrame(renderFrame);
    }
    //雪だるまを動かせる右の限界位置を算出する 
    function getRightLimitPosition(containerWidth, itemWidth) {
        return containerWidth - itemWidth;
    }
    //あたり判定処理
    function isHit(targetA, targetB) {
        return (((targetA.x <= targetB.x && targetA.x + targetA.width > targetB.x)
            || (targetB.x <= targetA.x && targetB.x + targetB.width > targetA.x))
            && ((targetA.y <= targetB.y && targetA.y + targetA.height >= targetB.y)
                || (targetB.y <= targetA.y && targetB.y + targetB.height >= targetA.y)));
    }
    //あたり判定の際の処理
    function hitJob() {
        ctx.font = 'bold 20px sans-serif';
        ctx.fillStyle = 'red';
        ctx.fillText('ヒットしました', getCenterPostion(canvas.clientWidth, 140), 160);
        /*ここに演習 8 で gameRule.catched 関数を記述し、上の 3 行は削除します*/
        /*ここに演習 7 のタスク 1 で画像を変更するコードを追加します*/
        /*ここに演習 7 タスク 2 手順 3 でオーディオを再生するコードを追加します*/
    }
    //雪の結晶の縦位置の初期値をランダムに設定する 
    function getRandomPosition(colCount, delayPos) {
        return Math.floor(Math.random() * colCount) * delayPos;
    };
    /*ここに演習 6 タスク 3 で loadCheck 関数を記述します。*/
})();