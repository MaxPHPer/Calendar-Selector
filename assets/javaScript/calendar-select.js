function Gum_CalendarSelector(opt, callback){
    this.opt = $.extend({
        container: "body",
        month_rang: 3
    }, opt);

    this.selectCheckInDate = true;
    this.callback = callback || function(){};

    this.init();
}

Gum_CalendarSelector.prototype = {
    constructor: Gum_CalendarSelector,

    init: function(){
        this._generateDomTree();
        this._initCookie();
        this._generateCalendarHead();
        this._generateCalendars();
        this._calendarTabsEvent();
        this._calendarClickEvent();
    },

    _initCookie: function(){
        if(!$.fn.cookie('checkInDate') && !$.fn.cookie('checkOutDate')){
            var date = new Date();
            $.fn.cookie('checkInDate', this._formartDate(date));
            date.setDate(date.getDate() + 1);
            $.fn.cookie('checkOutDate', this._formartDate(date));
        }
    },

    _formartDate: function(date){
        return [date.getFullYear(), date.getMonth()+1, date.getDate()].join('-');
    },

    _generateCalendarHead: function(){
        var days = ['日', '一', '二', '三', '四', '五', '六'],
            checkInDate = new Date($.fn.cookie('checkInDate')),
            checkOutDate = new Date($.fn.cookie('checkOutDate')),
            $calendarTabs = this.container.find('.calendar-tab');

        function setCalendarTabInfo(tab, date){
            tab.find('p').text((date.getMonth()+1) + "月" + date.getDate() + '日' +
                               " " + "星期" + days[date.getDay()]);
        }

        setCalendarTabInfo($calendarTabs.first(), checkInDate);
        setCalendarTabInfo($calendarTabs.last(), checkOutDate);
    },

    _generateCalendars: function(){
        var today = new Date(),
            month = today.getMonth(),
            year = today.getFullYear(),
            $calendarSelector = this.container,
            $calendar = $calendarSelector.find('.calendar'),
            i, $newCalendar;

        $calendar.remove();

        for(i=0; i<=this.opt.month_rang; i++){
            $newCalendar = this._generateCalendar($calendar.clone(), year, month + i);
            $newCalendar.appendTo($calendarSelector);
        }

        $calendar = null;

        this._modifyCalendar();
    },

    _generateCalendar: function($calendar, year, month){
        $calendar.find('.year').text(year + "年");
        $calendar.find('.month').text(month + 1 + "月");
        this._generateDate($calendar.children('.date-container'), year, month);
        return $calendar;
    }, 

    _generateDate: function($calendar, year, month){
        var $tbody = $calendar.children('tbody'), 
            currentDate = new Date(year, month),
            week = currentDate.getDay(),
            $tds = $(), date;

        for(; week>1; week--){
            $tds = $tds.add($('<td class="no-content"></td>'));
        }

        while(currentDate.getMonth() == month){
            date = currentDate.getDate();
            $tds = $tds.add($('<td><p>' + date + '</p></td>'))
            currentDate.setDate(date + 1);
        }

        $tds.appendTo($tbody);

        for(i=1; i<=$tds.length; i++){
            if(i % 7 == 0){
                $tds.slice(i-7, i).wrapAll($('<tr></tr>'));
            }
        }

        $tds.slice(i-i%7).wrapAll('<tr>');

    },

    _modifyCalendar: function(){
        var $calendar = this.container.find('.calendar').first(),
            today = new Date(),
            date = today.getDate(),
            $tds = $calendar.find('td:not(.no-content)');

        $tds.slice(0, date - 1).addClass('invalid-day');

        $tds.eq(date-1).children('p').addClass('today').text('今天');

        $calendar = this.container.find('.calendar').last();
        $tds = $calendar.find('td:not(.no-content)');

        $tds.slice(date-2).addClass('invalid-day');
    },

    _calendarTabsEvent: function(){
        var $calendarTabs = this.container.find('.calendar-tab'),
            me = this;

        $calendarTabs.click(function(){
            var $this = $(this),
                $tds = me.container.find('td:not(.no-content)'),
                $td;

            if(!$this.hasClass('active')){
                $this.addClass('active').siblings().removeClass('active');
            }

            $td = me._selectDate(new Date($.fn.cookie('checkInDate')));
            $tds.removeClass('select-in').removeClass('selected').removeClass('select-out');
            
            if($this.hasClass('check-in')){
                $td.addClass('select-in');
                $tds.removeClass('old-day');
                me.selectCheckInDate = true;
            }else{
                $td.addClass('selected');
                $td = me._selectDate(new Date($.fn.cookie('checkOutDate')));
                $td.addClass('select-out');
            }

            me._generateCalendarHead();
        });

        $calendarTabs.first().click();
    },

    _selectDate: function(date){
        var today = new Date(),
            index = date.getMonth() - today.getMonth(),
            date = date.getDate(),
            $calendar = this.container.find('.date-container'),
            $tds = $calendar.eq(index).find('td:not(.no-content)');

        return $tds.eq(date - 1);
    },

    _calendarClickEvent: function(){
        var me = this;

        this.container.click(function(e){
            var $target = $(e.target),
                $tds = me.container.find('td:not(.no-content)'),
                tagName = $target.attr('tagName').toUpperCase(),
                parentTagName = $target.parent().attr('tagName').toUpperCase(),
                year, month, date, dateInfo, dateObj;

            if(tagName == 'TD' || parentTagName == 'TD'){
                if(parentTagName == 'TD'){
                    $target = $target.parent();
                }

                if(!$target.hasClass('no-content') && !$target.hasClass('invalid-day')){
                    date = $target.children('p').text();

                    if(!parseInt(date)){
                        date = (new Date()).getDate();
                    }

                    year = parseInt($target.parents().filter('.calendar').find('.year').text());
                    month = parseInt($target.parents().filter('.calendar').find('.month').text());

                    dateInfo = year + "-" + month + "-" + date;

                    if(me.selectCheckInDate){
                        $.fn.cookie('checkInDate', dateInfo);
                        dateObj = new Date(dateInfo);
                        if(new Date($.fn.cookie('checkOutDate')) <= dateObj){
                            dateObj.setDate(parseInt(date) + 1);
                            dateInfo = me._formartDate(dateObj);
                            $.fn.cookie('checkOutDate', dateInfo);
                        }
                        me.selectCheckInDate = false;
                        me._removeInvalideDate();
                        me.container.find('.calendar-tab').last().click();
                    }else{
                        $.fn.cookie('checkOutDate', dateInfo);
                        me.selectCheckInDate = true;
                        me.callback();
                    }

                }
            }
        });
    },

    _removeInvalideDate: function(){
        var date = new Date($.fn.cookie('checkInDate')),
            currentDate = new Date(),
            disYear = date.getFullYear() - currentDate.getFullYear(),
            disMonth = date.getMonth() - currentDate.getMonth() + disYear * 12,
            $calendars = this.container.find('.date-container');


            if(disMonth > 0){
                $calendars.slice(0, disMonth).find('td:not(.no-content):not(.invalid-day)').addClass('old-day');
            }

            $calendars.eq(disMonth).find('td:not(no-content)').slice(0, date.getDay() - 1).addClass('old-day');


    },

    _generateDomTree: function(){
        var text = '<div id="calendar-selector"><div class="calendar-head"> <div class="calendar-tab check-in"> <h2>选择入住日期</h2> <p></p> </div> <div class="calendar-vbar"></div> <div class="calendar-tab check-out"> <h2>选择入住日期</h2> <p></p> </div> </div> <div class="calendar"> <h2><span class="year">2014年</span><span class="month">8月</span></h2> <table class="date-container"> <thead> <tr> <th>周一</th> <th>周二</th> <th>周三</th> <th>周四</th> <th>周五</th> <th>周六</th> <th>周日</th> </tr> </thead> <tbody></tbody> </table> </div> </div>';
            this.container = $(text); 
            this.container.appendTo($(this.opt.container));
    }
};