jQuery(document).ready(function() {
    citys = ['北京', '上海', '广州', '深圳', '杭州', '天津', '成都', '南京', '西安',
        '武汉', '鞍山', '安阳', '保定', '宝鸡', '包头', '北海', '北京', '本溪', '滨州',
        '沧州', '长春', '常德', '长沙', '常熟', '长治', '常州', '潮州', '承德', '成都',
        '赤峰', '重庆', '大连', '丹东', '大庆', '大同', '德阳', '德州', '东莞', '东营',
        '鄂尔多斯', '佛山', '抚顺', '富阳', '福州', '广州', '桂林', '贵阳', '哈尔滨',
        '海口', '海门', '邯郸', '杭州', '合肥', '衡水', '河源', '菏泽', '淮安', '呼和浩特',
        '惠州', '葫芦岛', '湖州', '江门', '江阴', '胶南', '胶州', '焦作', '嘉兴', '嘉峪关',
        '揭阳', '吉林', '即墨', '济南', '金昌', '荆州', '金华', '济宁', '金坛', '锦州', '九江',
        '句容', '开封', '克拉玛依', '库尔勒', '昆明', '昆山', '莱芜', '莱西', '莱州', '廊坊',
        '兰州', '拉萨', '连云港', '聊城', '临安', '临汾', '临沂', '丽水', '柳州', '溧阳',
        '洛阳', '泸州', '马鞍山', '茂名', '梅州', '绵阳', '牡丹江', '南昌', '南充', '南京',
        '南宁', '南通', '宁波', '盘锦', '攀枝花', '蓬莱', '平顶山', '平度', '青岛', '清远',
        '秦皇岛', '齐齐哈尔', '泉州', '曲靖', '衢州', '日照', '荣成', '乳山', '三门峡',
        '三亚', '上海', '汕头', '汕尾', '韶关', '绍兴', '沈阳', '深圳', '石家庄', '石嘴山',
        '寿光', '宿迁', '苏州', '泰安', '太仓', '太原', '台州', '泰州', '唐山', '天津',
        '铜川', '瓦房店', '潍坊', '威海', '渭南', '文登', '温州', '武汉', '芜湖', '吴江',
        '乌鲁木齐', '无锡', '厦门', '西安', '湘潭', '西安', '邢台', '西宁', '徐州', '延安',
        '盐城', '阳江', '阳泉', '扬州', '烟台', '宜宾', '宜昌', '银川', '营口', '义乌', '宜兴',
        '岳阳', '云浮', '玉溪', '枣庄', '张家港', '张家界', '张家口', '章丘', '湛江', '肇庆',
        '招远', '郑州', '镇江', '中山', '舟山', '珠海', '诸暨', '株洲', '淄博', '自贡', '遵义'
    ]
    d3.select("#areas").selectAll("option")
        .data(citys)
        .enter()
        .append("option")
        .text(function(d) {
            return d;
        })
        .attr("value", function(d) {
            return d;
        });

    redraw();
});

function cal_aqidays(url) {
    $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
        })
        .done(function(data) {

            aqidays = [0, 0, 0, 0, 0, 0]
            $.each(data, function(index, val) {
                /* iterate through array or object */
                if (val < 50) {
                    aqidays[0]++;
                } else if (val < 100) {
                    aqidays[1]++;
                } else if (val < 150) {
                    aqidays[2]++;
                } else if (val < 200) {
                    aqidays[3]++;
                } else if (val < 300) {
                    aqidays[4]++;
                } else {
                    aqidays[5]++;
                }
            });
            for (var i = 0; i < aqidays.length; i++) {
                $("#aqiday" + i).text(aqidays[i])
            };
        });
}

function redraw() {
    $("#cal-heatmap1").find('svg,div').remove();
    $('#cal-heatmap2').find('svg,div').remove();


    var area = $('#areas');
    var value = area.val();
    var data_url = "./data/" + value + ".json";

    cal_aqidays(data_url);

    var shared_conf = {
        domain: "month",
        subDomain: "x_day",
        domainGutter: 10,
        itemName: "",
        domainDynamicDimension: false,
        cellSize: 25,
        range: 6,
        subDomainDateFormat: "%Y-%m-%d",
        cellPadding: 5,
        displayLegend: false,
        verticalOrientation: false,
        domainLabelFormat: "%Y-%m",
        legend: [50, 100, 150, 200, 300, 500],

        label: {
            position: "top",
            width: 46
        },
        subDomainTextFormat: function(date, value) {
            return value;
        },
        data: data_url,
    };

    if (document.body.clientWidth > 1000) {

        var cal1 = new CalHeatMap();
        shared_conf.itemSelector = "#cal-heatmap1";
        shared_conf.start = new Date(2015, 0, 1);
        cal1.init(shared_conf);

        var cal2 = new CalHeatMap();
        shared_conf.itemSelector = "#cal-heatmap2";
        shared_conf.start = new Date(2015, 6, 1);
        cal2.init(shared_conf);
    } else {

        $("#cal-heatmap3").find('svg,div').remove();
        $("#cal-heatmap4").find('svg,div').remove();

        shared_conf.range = 3;
        shared_conf.cellSize = 30;

        var cal1 = new CalHeatMap();
        shared_conf.itemSelector = "#cal-heatmap1";
        shared_conf.start = new Date(2015, 0, 1);
        cal1.init(shared_conf);

        var cal2 = new CalHeatMap();
        shared_conf.itemSelector = "#cal-heatmap2";
        shared_conf.start = new Date(2015, 3, 1);
        cal2.init(shared_conf);

        var cal3 = new CalHeatMap();
        shared_conf.itemSelector = "#cal-heatmap3";
        shared_conf.start = new Date(2015, 6, 1);
        cal3.init(shared_conf);

        var cal4 = new CalHeatMap();
        shared_conf.itemSelector = "#cal-heatmap4";
        shared_conf.start = new Date(2015, 9, 1);
        cal4.init(shared_conf);
    }

}
