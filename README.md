## 日期区间选择插件

#### 简介
这是一款日期区间选择插件，和去哪儿网的酒店日期选择很像（说的是外表）。

用户选择的日期会保存在 cookie 里面，分别为 checkInDate 和 CheckOutDate，格式为 2014-8-12。

插件功能还是很完善和强大的，不过我想复用的空间应该很小了吧。

#### 使用

插件依赖两个库文件，zepto.js 和 zepto.cookie.js，需要引入。

然后这个插件一共包括两个文件，分别是 calendar-select.js 和 calendar-select.less(有压缩好的calendar.css)，也需要分别引入。

使用如下：

     var calendarSelector = new Gum_CalendarSelector({container: 'body'});
   
完整使用如下：

    var calendarSelector = new Gum_CalendarSelector({
        container: 'body',    // 挂载到 body 这个容器里, 使用 Zepto 选择器选择
        month_rang: 3,    // 有效选择日期为 3 个月
    }, function(){    // 用户点击选择离店日期后，执行一个回调函数
        alert("OK");   
    });
    
效果图如下:

 ![Calendar-Selector](http://ww3.sinaimg.cn/large/6473e757jw1ejcboou139j20iu0tmad5.jpg)