/*LiveInternet counter*/
document.write("<a href='//www.liveinternet.ru/click' "+
    "target=_blank><img src='//counter.yadro.ru/hit?t25.6;r"+
    escape(document.referrer)+((typeof(screen)=="undefined")?"":
        ";s"+screen.width+"*"+screen.height+"*"+(screen.colorDepth?
            screen.colorDepth:screen.pixelDepth))+";u"+escape(document.URL)+
    ";"+Math.random()+
    "' alt='' title='LiveInternet: показано число посетителей за"+
    " сегодня' "+
    "border='0' width='88' height='15'><\/a>")
/*LiveInternet*/