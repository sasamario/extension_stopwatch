$(function() {
    let background = chrome.extension.getBackgroundPage();
    let intervalId = "";
    let bgTimeCount = 0;

    //拡張機能起動時のカウントチェック
    chrome.runtime.sendMessage({text: "check"}, function(response) {
        if (response.text == "done") {
            //裏側で動いている場合は、表示部分に反映させる
            reflectCount();
            intervalId = setInterval(function(){
                reflectCount();
            }, 1000);
        } else {
            reflectCount();
        }
    });

    //カウントアップ開始処理
    $("#start").on("click", function(){
        chrome.runtime.sendMessage({text: "start"}, function(response) {
            //カウント反映処理を重複させないように、スタート時のみ以下の反映処理を実行する
            if (response.text == "start") {
                intervalId = setInterval(function(){
                    reflectCount();
                }, 1000);
            }
        });
    });

    //カウントアップ停止処理
    $("#stop").on("click", function() {
        chrome.runtime.sendMessage({text: "stop"}, function() {});
        clearInterval(intervalId);
    });

    //カウントアップ値リセット処理
    $("#reset").on("click", function() {
        chrome.runtime.sendMessage({text: "reset"}, function() {});
        $(".time").text("00:00");
    });


    /**
     * 表示部分に反映させる処理
     */
    function reflectCount() {
        let min = 0;
        let sec = 0;

        bgTimeCount = background.timeCount;
        min = String(Math.floor(bgTimeCount / 60));
        sec = String(bgTimeCount - min*60);
        sec = sec.length == 1 ? `0${sec}` : sec;
        min = min.length == 1 ? `0${min}` : min;
        
        let timer = `${min}:${sec}`;

        $(".time").text(timer);
    }
    
});