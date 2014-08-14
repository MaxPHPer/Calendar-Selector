$(document).ready(function(){
    var calendarSelector = new Gum_CalendarSelector({
        container: 'body',    // 挂载到 body 这个容器里, 使用 Zepto 选择器选择
        month_rang: 3,    // 有效选择日期为 3 个月
    }, function(){    // 用户点击选择离店日期后，执行一个回调函数
        alert("OK");   
    });

    // calendarSelector._generateCalendar($('.calendar'), 2014, 7);
});