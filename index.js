var colCount
var colHeightArray = []
var nodeWidth 

nodeWidth = $('.container .item').outerWidth(true)
colCount = Math.floor($('.container').width() / nodeWidth)
if (colHeightArray.length == 0) {
    for (var i = 0; i < colCount; i++) {
        colHeightArray[i] = 0
    }

}

var Helper = {
    createNode: function(news){
        var item = `
            <div class="item">
            <a href="" class="link">
                <img src="" alt="">
            </a>
            <h4 class="title"></h4>
            <p class="intro"></p>
        </div>`
        var $item = $(item)
        $item.find('img').attr('src',news.img_url)
        $item.find('.title').text(news.short_name)
        $item.find('.intro').text(news.name)
        //console.log($item[0])
        return $item
    },
    waterfall: function($node){
            console.log(colHeightArray)

            var minHeight = colHeightArray[0]
            var minIndex = 0
            for (var i = 0; i < colCount; i++) {
                if (colHeightArray[i] < minHeight) {
                    minHeight = colHeightArray[i]
                    minIndex = i
                }
            }

            console.log(minHeight, minIndex)
            $node.css({
                'left': nodeWidth * minIndex,
                'top': minHeight
            })
            colHeightArray[minIndex] += $node.outerHeight(true)
            $('.container').height(Math.max.apply(null, colHeightArray));
    },
    lazyLoad: function ($node) {
        return $(window).height() + $(window).scrollTop() >= $node.offset().top - 10
    }

}       

var Newspage = {
    init: function(){
        this.page = 1
        this.count = 20
        this.$container = $('.container')
        this.isDataArrive = true
        this.$tag = $('#load')

        this.bind()
        this.start()


    },
    bind: function(){
        var _this = this
        if (!_this.isDataArrive) return
        _this.isDataArrive = true
        $(window).scroll(function(){
            console.log('1')
            if(Helper.lazyLoad(_this.$tag)){
                _this.start()
            }        
        })

    },
    start: function(){
        var _this = this
        this.getData(function(data){
            _this.render(data)
        })

    },
    getData: function(callback){
        var _this = this
        $.ajax({
            type: 'GET',
            url: 'https://platform.sina.com.cn/slide/album_tech',
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            data: {
                app_key: '1271687855',
                num: _this.count,
                page: _this.page
            }
        }).done(function(ret){
            console.log(ret)
            if(ret && ret.status &&ret.status.code === '0'){
                callback(ret.data)
                _this.page++
            }
        }).fail(function(){
            console.log('error')
        })

    },
    render: function(data){
        var _this = this
       data.forEach(function(news){
           var $node = Helper.createNode(news)
           $node.find('img').load(function(){
               _this.$container.append($node)
               Helper.waterfall($node)
           })
       });
       _this.isDataArrive = false
    }
}
Newspage.init()