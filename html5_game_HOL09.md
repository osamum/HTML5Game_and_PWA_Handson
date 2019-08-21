# 演習 9 : Progressive Web App(PWA) 化
これまで作成したゲームを Progressive Web App (PWA) 化してデバイスに直接インストールできるようにします。

## Progressive Web App (PWA) とは
PWA とは、Web クライアントのスペックに応じた体験を提供する Web アプリケーションの概念です。高機能な Web ブラウザーではネイティブアプリケーションに近い体験を提供することもできます。

PWA についての詳細は以下の記事をご参照ください。

* [**de:code2018セッションフォローアップ「進化する Web ～ Progressive Web Apps の実装と応用 ～」**](https://blogs.msdn.microsoft.com/osamum/2018/07/03/about_pwa/)


PWA 化することによってマートフォンのホーム画面から直接ゲームを起動することができ、ゲームの動作に関係のないナビゲーションバーなどのWeb ブラウザーの UI を隠すこともできます。

また、このハンズオンで作成したゲームの動作は Web ブラウザー内で完結しているので、PWA 化すればオフラインでも使用することができます。


## タスク 1 : アイコンの準備
ゲームをアプリケーションとしてデバイスにインストールする際に
必要となるアイコンを準備してアプリケーションのディレクトリに配置します。

手順は以下のとおりです。

1. アイコンの作成、または入手
    このハンズオンのために用意されているアイコンを[**ここから**](assets/html5gameHandson_PWA_Assets.zip)ダウンロードします。

2. ダウンロードした zip ファイルを解凍し、展開された各ファイルと icons フォルダを以下のとおりに配置します。

    * ファイル名 **apple-touch-icon-数字x数字.png** ファイル

        ⇒ **ルートディレクトリ** (default.html と同じ階層)
    * **icons** フォルダー

        ⇒ **img ディレクトリの中**

配置し終えたら Visual Studio Code から正しい位置に配置されているか確認してください。

## タスク 2 : マニフェストファイル (manifest.json) の作成 
PWA の設定ファイルである manifest.json を作成します。

このファイルではアプリケーションの名前やアイコン、アプリケーション ウィンドウの表示形式などを指定します。

作成手順は以下のとおりです。

1. Visual Studio Code にて、ルートディレクトリに manifest.json という名前で空のファイルを作成します。

2. manifest.json 開き、以下の設定をコピーして貼り付けます。
    ```
    {
        "name": "html5GameHandson-SnowCatch.",
        "short_name": "SnowCatch*",
        "icons": [
        {
            "src": "apple-touch-icon-72x72.png",
            "type": "image/png",
            "sizes": "72x72"
        },{
            "src": "apple-touch-icon-76x76.png",
            "type": "image/png",
            "sizes": "76x76"
        },{
            "src": "apple-touch-icon-120x120.png",
            "type": "image/png",
            "sizes": "120x120"
        },{
            "src": "apple-touch-icon-144x144.png",
            "type": "image/png",
            "sizes": "144x144"
        },{
            "src": "apple-touch-icon-152x152.png",
            "type": "image/png",
            "sizes": "152x152"
        },{
            "src": "apple-touch-icon-180x180.png",
            "type": "image/png",
            "sizes": "180x180"
        },{
            "src": "img/icons/icon-96x96.png",
            "type": "image/png",
            "sizes": "96x96"
        },{
            "src": "img/icons/icon-128x128.png",
            "type": "image/png",
            "sizes": "128x128"
        },{
            "src": "img/icons/icon-192x192.png",
            "type": "image/png",
            "sizes": "192x192"
        },{
            "src": "img/icons/icon-384x384.png",
            "type": "image/png",
            "sizes": "384x384"
        },{
            "src": "img/icons/icon-512x512.png",
            "type": "image/png",
            "sizes": "512x512"
        }],
        "start_url": "./",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#000000"
    }
    ```
3. キーボードの [Ctrl] + [S] を押下して manifest.jon を保存します。

4. default.html を開き、\<title\> タグの下の行に以下のマークアップをコピーして貼り付けます。
    ```
    <link rel="manifest" href="manifest.json">
    ```
5. キーボードの [Ctrl] + [S] を押下して default.html 保存します。

## タスク 3 : Service Wroker 用 JS ファイルの作成

Service Wroker は端的に行ってしまえばプログラミング可能なプロキシです。

Service Wroker 管理スコープ内にある *.html などの Web コンテンツをローカルにキャッシュし、リクエストをハンドリングして、キャッシュの内容を返したり、ページが非アクティブであってもバックグラウンドで動作しつづけ通知を行ったりもできます。

<img src="images/ServiceWorker.png" width="500">

今回のハンズオンではこの Service Worker の機能を利用して、アプリケーション全体をデバイスローカルにキャッシュ、オフライン状態でも使用できるようにします。

Service Worker は専用の *.js ファイルを用意し、その中に制御を行うためのコードを記述します。

アプリケーション側では、Service Worker 用の JS ファイルを登録するだけで透過的に使用することができるため、既存のアプリケーションで Service Worker を使用する場合でもコードの修正はほとんど必要ありません。

ハンズオンで作成したゲームが Service Worker を利用するための手順は以下のとおりです。

1. Visual Studio Code にて、ルートディレクトリに sw.js という名前で空のファイルを作成します。
2. sw.js を開き、以下のコードをコピーして貼り付けます。
    ```
    //キャッシュの名前
    const CACHE_NAME = 'html5gameHandson-asset0820';
    //キャッシュするアセット類を指定
    var assetsToCache = [
            '/',
            '/default.html',
            '/css/default.css',
            '/scripts/default.js',
            '/img/snow_man.png',
            '/img/snow.png',
            '/img/sp_snow.png',
            '/audio/kiiiin1.mp3',
        ];
    /*ここにインストール イベントのハンドラを記述します*/ 
    /*ここにアクティベイト イベントのハンドラを記述します*/ 
    /*取り出しイベントのハンドラを記述します*/ 
    ```
    このコードでは、Servive Worker が使用するキャッシュの名前、とキャッシュするアセット(ファイル)を指定しています。

3. Service Worker がインストールされた際のイベントハンドラを記述します。

    ここでは前の手順で設定したキャッシュの名前でキャッシュを作成し、同じく前の手順で指定したアセットのリストに指定されたファイルをキャッシュします。

    sw.js のコメント「/* ここにインストール イベントのハンドラを記述します*/ 」) を以下のコードで置き換えます。
    ```
    //インストール イベント (キャッシュを行う)
    self.addEventListener('install', function(e) {
        e.waitUntil(
            caches.open(CACHE_NAME).then(function(cache) {
                return cache.addAll(assetsToCache);
            })
        );
    });
    ```

4. アクティベイト時のイベントハンドラを記述します。

    ここでは古いキャッシュを削除するための処理を記述しています。

    Service Worker のキャッシュは Service Worker の更新を行っても自動では削除されないのでコンテンツを更新するにはどこかでキャッシュ削除を行う必要があります。

    sw.js のコメント「/* ここにアクティベイト イベントのハンドラを記述します*/」) を以下のコードで置き換えます。

    ```
    //アクティベイト イベント (古いキャッシュを削除する)
    self.addEventListener('activate', function(e) {
        e.waitUntil(
            caches.keys().then(function(keyList) {
                return Promise.all(keyList.map(function(key) {
                    //今回指定されたキャッシュの名前と違う場合は
                    if (key !== CACHE_NAME) {
                    //キャッシュを削除する
                    return caches.delete(key);
                    }
                }));
            })
        );
    });
    ```
    このコードでは、単純に今回使用しているキャッシュの名前と違うものを削除していますが、実際の運用では、きちんとしたキャッシュ戦略を立てそれに沿ったロジックで実装することをお勧めします。

5. コンテンツの取り出しの際のイベントハンドラを記述します。

    fetch イベントハンドラの引数として要求されたファイル名が渡されるので、キャッシュ内を検索し、該当するもがあればそれを返し、存在しない場合は Web サーバーにリクエストして結果を返します。

    sw.js のコメント「/* 取り出しイベントのハンドラを記述します*/ 」) を以下のコードで置き換えます。
    ```
    //取り出し時のイベント (キャッシュから取り出す)
    self.addEventListener('fetch', function(e) {
        e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
        );
    });
    ```
6. キーボードの [Ctrl] + [S] を押下して sw.js を保存します。

7. default.html を開き、コメント「\<!-- ここに演習 9 のタスク 3 で Service Worker を呼び出す記述をします-->」を以下のマークアップで置き換えます。
    ```
    <script>
        if (navigator.serviceWorker) {
            navigator.serviceWorker.register('sw.js');
        } 
    </script>
    ```
8. キーボードの [Ctrl] + [S] を押下して default.html 保存します。

9. Visual Studio Code のターミナル画面から **http-server** を起動します。
    <p style="text-indent:2em">
    <a href="http://127.0.0.1:8080/default.html">http://127.0.0.1:8080/default.html</a></p>
10. コマンドプロンプトを起動し、cd コマンドで作業ディレクトリを ngrok.exe が配置されているディレクトリに切り替えます
11. 以下のコマンドを実行して cmd にシェルを切り替えます。

    ***cmd**

12. 以下のコマンドを実行します

    **ngrok http 8080 --host-header=localhost**

13. エコーされた内容の Foewarding の横に表示された http、もしくは https のドメイン名を使用してアクセスします

    <img src="images/engrok.png">
    たとえば、ngrok から返されたドメイン名が http://9fcf38b6.engrok.io だった場合は以下の URL でインターネットからローカルの default.html にアクセスすることができます。
    
    http://9fcf38b6.engrok.io/default.html

14. スマートフォンの Web ブラウザーからアクセスして、ページが表示されることを確認します。

15. 以下の手順でデバイスにインストールを行います。

    * iPhone の場合
        1. モバイル Safari の [追加・共有・保存] ボタンをクリック
        2. メニュー一覧から [ホーム画面に追加] をクリック
        3. 画面右上の [追加] メニューをクリック

    * Android の場合

ホーム画面のアイコンをタップしてゲームが起動するか確認してください。

ここまでの sw.js の完全なコードは以下になります。

* [**HTML5 game and PWD HOL Ex9 SW sample code**](https://gist.github.com/osamum/4c526fa7845294fd2848f036cc4080f0)


[0. 最初に戻る](README.md)

[1. 開発環境の準備とプロジェクトの作成](html5_game_HOL01.md)

[2. Canvas への画像のロード](html5_game_HOL02.md)

[3. 基本的なアニメーションの実装](html5_game_HOL03.md)

[4. 矢印キーとタッチによる制御](html5_game_HOL04.md)

[5. あたり判定](html5_game_HOL05.md)

[6. 複数 Sprite の生成とランダムな動作](html5_game_HOL06.md)

[7. ヒット時の画像の切り替えと効果音の実装](html5_game_HOL07.md)

[8. ルールの追加](html5_game_HOL08.md)