String.prototype.contains = function(other){
  return (this.indexOf(other) > -1);
};

function TuringList(handle,lines,format){

    this.element = $(handle);
    this.lines = lines || [];
    this.format = format || function(item){
        var pre = $(document.createElement('pre'));
        pre.html(JSON.stringify(item,null,2))
        return pre;
    }

    this.update = function(lines) {
        this.lines = lines;
        this.render();
    };

    this.formatter = function(format) {
        this.format = format;
        this.render();
    };

    this.render = function() {
        var _this = this;
        this.element.html('');
        var list = $(document.createElement('ul'));
        this.element.append(list);
        this.lines.map(function(item) {
            var line = $(document.createElement('li'));
            line.html(_this.format(item));
            list.append(line);
        });
        this.element.show();
    };

    this.render()

}

function TuringChart(handle,type,data){

    this.type = type;
    data = data || [];
    this.element = $(handle);

    this.options = {
        chart: {
            type: this.type
        },
        title: {
            text: this.element.attr('name')
        },
        legend: {
            enabled: false
        },
        xAxis: {
            title: {
                text: null
            }
        },
        yAxis: {
            title: {
                text: null
            }
        },
        series: [{
            data: data
        }],
        tooltip: {
            formatter: function(){
                var text = this.point.text || this.point.name || false;
                if (!text) return false;
                return '<p>' + text + '</p>';
            }
        }
    }

    this.getData = function(axis) {
        var point = this.options.series[0].data[0];
        var lookup = { x:0, y:1, z:2 };
        var entry = point[axis] || point[lookup[axis]];
        return entry;
    }

    this.format = function(){
        if (this.getData('x') instanceof Date) this.options.xAxis.type = 'datetime';
        if (this.getData('y') instanceof Date) this.options.yAxis.type = 'datetime';

        this.options.series[0].data = this.options.series[0].data.map((point) => {
            if (point.x) point.x = Number(point.x);
            if (point.y) point.y = Number(point.y);
            if (point.z) point.z = Number(point.z);
            return point;
        })
    }

    this.draw = function(){
        this.element.html();
        this.format();
        this.chart = this.element.highcharts(this.options);   
    }

    this.data = function(data){
        this.options.series[0].data = data;
        this.draw();
    };

    this.axis = function(axis){
        this.options.xAxis.title.text = axis.x;
        this.options.yAxis.title.text = axis.y;
        this.draw();
    }

    this.xLabels = function(formatter){
        this.options.xAxis.labels = {
            formatter: formatter
        };
        this.draw();
    }

    this.yLabels = function(formatter){
        this.options.yAxis.labels = {
            formatter: formatter
        };
        this.draw();
    }

    this.tooltip = function(formatter){
        this.options.tooltip = {
            formatter: formatter
        };
        this.draw();
    }

    this.draw();

};

function TuringBar(handle,data){
    var type = 'bar';
    TuringChart.call(this,handle,type,data);
};

function TuringBubble(handle,data){
    var type = 'bubble';
    TuringChart.call(this,handle,type,data);
};
