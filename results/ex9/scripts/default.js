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
        constructor(img, sp_width, sp_height) {
            this.image = img; //image オブジェクト 
            this.height = (sp_height) ? sp_height : img.height;
            this.width = (sp_width) ? sp_width : img.width;
            this.x = 0; //表示位置 x 
            this.y = 0; //表示位置 y 
            this.dx = 0; //移動量 x 
            this.dy = 0; //移動量 y
            this._imageIndex = 0;
            this._offset_x_pos = 0;
            this.audio = null; //Audio オブジェクト 
            this.audioPlayed = false; //音が複数回鳴るのを防ぐ

            //Sprite を描画するメソッド 
            this.draw = () => {
                ctx.drawImage(img, this._offset_x_pos, 0, this.width, this.height,
                    this.x, this.y, this.width, this.height);
            };
        }
        //使用するインデックスを設定するための Setter/Getter 
        get imageIndex() {
            return this._imageIndex;
        }
        set imageIndex(val) {
            this._imageIndex = val;
            this._offset_x_pos = this.width * this._imageIndex;
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
        start_coefficient: -50,
        //雪の結晶画像を切り替える閾値  
        switch_count: 24
    };
    //スプライト画像のインデックス
    let SNOW_PICTURE = { blue: 0, white: 1, clash: 2 };
    //雪の結晶の画像サイズ 
    let SNOW_SIZE = { height: 32, width: 32 };
    //雪ダルマの画像サイズ 
    let SNOW_MAN_SIZE = { height: 80, width: 80 };
    //画面の書き換え数をカウントする 
    let loopCounter = 0;

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
                setTimeout(() => {
                    this.reset(this);
                }, 500);
            }
        }
        isCatched(spriteIndex) {
            if (spriteIndex !== SNOW_PICTURE.clash) {
                this.fail();
            }
        }
        reset(that) {
            for (let sprite_snow of sprite.snows) {
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

    //ゲームに必要なアセットをロードする
    function loadAssets() {
        //加点などを制御する Rule クラスのインスタンスを生成
        gameRule = new Rule();
        //HTML ファイル上の canvas エレメントのインスタンスを取得   
        canvas = document.getElementById('bg');
        //アニメーションの開始
        canvas.addEventListener('click', () => {
            if (!requestId) { loadCheck(); }
        });
        //2D コンテキストを取得  
        ctx = canvas.getContext('2d');
        //image オブジェクトのインスタンスを生成  
        img.snow = new Image();
        //image オブジェクトに画像をロード 
        img.snow.src = './img/sp_snow.png';
        /*画像読み込み完了の Canvas に 
        画像を表示するメソッドを記述 */
        img.snow.onload = () => {
            for (let i = 0; i < SNOWS_MOVING_CONF.count; i++) {
                //画像を引数に Sprite クラスのインスタンスを生成  
                let sprite_snow = new Sprite(img.snow, SNOW_SIZE.width, SNOW_SIZE.height);
                sprite_snow.dy = 1;
                sprite_snow.dx = SNOWS_MOVING_CONF.neighor_distance;
                sprite_snow.x = i * sprite_snow.dx;
                sprite_snow.y = getRandomPosition(SNOWS_MOVING_CONF.count,
                    SNOWS_MOVING_CONF.start_coefficient);
                /*ここに演習 7 の手順 1 ステップ 8 でコードを追加します*/
                //Audio オブジェクトのインスタンスをセット 
                sprite_snow.audio = new Audio('./audio/kiiiin1.mp3');
                sprite.snows.push(sprite_snow);
                sprite_snow = null;
            }
        };
        //雪だるまインスタンスの生成 
        img.snow_man = new Image();
        img.snow_man.src = './img/snow_man.png';
        img.snow_man.onload = () => {
            sprite.snow_man = new Sprite(img.snow_man, SNOW_MAN_SIZE.width,
                SNOW_MAN_SIZE.height);
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
            evnt.preventDefault();
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
        for (let i = 0; i < length; i++) {
            let sprite_snow = sprite.snows[i];
            //sprite_snow の y 値(縦位置) が canvas からはみ出たら先頭に戻す 
            if (sprite_snow.y > canvas.clientHeight) {
                //取り逃がしたどうか判断
                gameRule.isCatched(sprite_snow.imageIndex);
                sprite_snow.y = 0;
                sprite_snow.imageIndex = SNOW_PICTURE.blue;
                //オーディオ再生を停止 
                sprite_snow.audio.pause();
                //オーディオ再生済フラグのリセット 
                sprite_snow.audioPlayed = false;
            } else {
                if (loopCounter == SNOWS_MOVING_CONF.switch_count
                    && sprite_snow.imageIndex != SNOW_PICTURE.clash) {
                    sprite_snow.imageIndex = (sprite_snow.imageIndex == SNOW_PICTURE.blue)
                        ? SNOW_PICTURE.white : SNOW_PICTURE.blue;
                }
            };
            //sprite_snow の y 値を増分 
            sprite_snow.y += sprite_snow.dy;
            //Spriteを描画 
            sprite_snow.draw();
            //当たり判定 
            if (isHit(sprite_snow, sprite.snow_man) && (sprite_snow.imageIndex !== SNOW_PICTURE.clash)) { hitJob(sprite_snow) };
            sprite_snow = null;
        }

        //Spriteを描画 
        sprite.snow_man.draw();
        //処理数のカウント 
        if (loopCounter == SNOWS_MOVING_CONF.switch_count) { loopCounter = 0; }
        loopCounter++;
        //ループを開始 
        if (gameRule.life > 0) requestId = window.requestAnimationFrame(renderFrame);
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
    function hitJob(sprite_snow) {
        //点数を加算します。
        gameRule.catched();
        sprite_snow.imageIndex = SNOW_PICTURE.clash;
        if (!sprite_snow.audioPlayed) {
            sprite_snow.audio.play();
            sprite_snow.audioPlayed = true;
        }
    }

    //雪の結晶の縦位置の初期値をランダムに設定する 
    function getRandomPosition(colCount, delayPos) {
        return Math.floor(Math.random() * colCount) * delayPos;
    };

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

})();