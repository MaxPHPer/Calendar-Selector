$(document).ready(function(){
    var calendarSelector = new Gum_CalendarSelector({
        container: 'body'
    }, function(){
        alert("OK");
    });

    // calendarSelector._generateCalendar($('.calendar'), 2014, 7);
});