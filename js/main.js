function getActiveCategory(){
  var tab = d3.select("#tab_container .tab.active")
  return tab.node().id.replace("tab_","")
}
function getActiveState(){
  return $(".styled-select.states select").val()
}

function drawChart(container_width){
  d3.selectAll("svg").remove()
  var defaultSelector = getActiveState() + "-" + getActiveCategory();
  var pdefaultSelector = getActiveState() + "-" + "PROJ"
  var margin = {top: 90, right: 40, bottom: 30, left: 90},
      width = container_width - margin.left - margin.right,
      height = width/1.8 - margin.top - margin.bottom;

  var formatDate = d3.time.format("%Y");

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks((Math.floor(width/60) > 8) ? 8 : Math.floor(width/60))
      .tickFormat(d3.format(","));

  var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  svg
    .append('defs')
    .append('pattern')
      .attr('id', 'diagonalHatch')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 4)
      .attr('height', 4)
    .append('path')
      .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
      .attr('stroke', '#dedddd')
      .attr('stroke-width', 1);

  d3.json("data/jridata.json", function(error, data) {
    var slice = data.filter(function(d){ return typeof(d[defaultSelector]) != "undefined" && d[defaultSelector] != 0})
    var pslice = data.filter(function(d){ return typeof(d[pdefaultSelector]) != "undefined" && d[pdefaultSelector] != 0})

    if (error) throw error;

    x.domain([formatDate.parse("2007"),formatDate.parse("2020")]);
    y.domain([0, d3.max(slice, function(d){ return +d[defaultSelector]})])


  var line = d3.svg.line()
      .x(function(d) { return x(formatDate.parse(d.year)); })
      .y(function(d) {
          return y(+d[defaultSelector]);    
      });
  var pline = d3.svg.line()
      .x(function(d) { return x(formatDate.parse(d.year)); })
      .y(function(d) {
          return y(+d[pdefaultSelector]);    
      });


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    d3.selectAll(".y.axis .tick line")
      .style("stroke","#dedddd")
      .style("stroke-width","1px")
      .attr("x2",0)
      .attr("x1",width)
  
    var jri = svg.append("rect")
      .attr("x",0)
      .attr("y",0)
      .attr("height",height)
      .attr("width", x(formatDate.parse(JRI[getActiveState()])))
      .style("fill",'url(#diagonalHatch')
      .style("pointer-events","none")
      .style("stroke","#ccc")
      .style("stroke-width","3px")
      .style("stroke-dasharray", "0," + x(formatDate.parse(JRI[getActiveState()])) + "," + height + "," + (x(formatDate.parse(JRI[getActiveState()])) + height))


    var mainLine = svg.append("path")
        .datum(slice)
        .attr("class", "line")
        .attr("d", line);
    var projLine = svg.append("path")
        .datum(pslice)
        .attr("class", "proj_line")
        .attr("d", pline)
        .style("opacity", function(){ return (getActiveCategory() == "PRI") ? 1 : 0});

    svg.selectAll(".dot")
      .data(slice)
      .enter()
      .append("circle")
      .attr("class","dot")
      .attr("cx", function(d){ 
        return x(formatDate.parse(d.year))
      })
      .attr("cy", function(d){
         return y(+d[defaultSelector])
      })
      .attr("r",5)

    $(".styled-select").click(function () {
        var element = $(this).children("select")[0],
            worked = false;
        if(document.createEvent) { // all browsers
            var e = document.createEvent("MouseEvents");
            e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false,false, false, false, 0, null);
            worked = element.dispatchEvent(e);
        } else if (element.fireEvent) { // ie
            worked = element.fireEvent("onmousedown");
        }
        if (!worked) { // unknown browser / error
            alert("It didn't worked in your browser.");
        }
    });

    $(".styled-select select")
      .change(function(){
        updateChart($(".styled-select.states select").val(), getActiveCategory());
        var m = $(this);
        if(m.val() == ""){
          m.css("color", "#818385");
        }else{ m.css("color", "#333")}
    });

    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox){
      $(".styled-select select").css("pointer-events","visible");
    }

    d3.selectAll("#tab_container .tab")
      .on("click", function(){
        if(d3.select(this).classed("gap")){
          return false;
        }else{
          var category = this.id.replace("tab_","")
          d3.selectAll("#tab_container .tab").classed("active",false)
          d3.select(this).classed("active",true)
          updateChart(getActiveState(), category)
        }
      })

    function updateChart(state, category){
      console.log(state, category)
      var selector = state + "-" + category
      var pselector = state + "-PROJ"
      var slice = data.filter(function(d){ return typeof(d[selector]) != "undefined" && d[selector] != 0})
      var pslice = data.filter(function(d){ return typeof(d[pselector]) != "undefined" && d[pselector] != 0})

      // x.domain(d3.extent(slice, function(d) { return formatDate.parse(d.year) }));
      var max = d3.max(slice, function(d){ return +d[selector]})
      var pmax = (category == "PRI") ? d3.max(pslice, function(d){ return +d[pselector]}) : max

      y.domain([0, Math.max(max, pmax)])
      line = d3.svg.line()
          .x(function(d) { return x(formatDate.parse(d.year)); })
          .y(function(d) {
              return y(+d[selector]);    
          });
      pline = d3.svg.line()
          .x(function(d) { return x(formatDate.parse(d.year)); })
          .y(function(d) {
              return y(+d[pselector]);    
          });

      mainLine
        .datum(slice)
        .transition()
        .attr("d", line);
      if(category == "PRI"){
        projLine
          .datum(pslice)
          .transition()
          .style("opacity",1)
          .attr("d", pline);
      }else{
        projLine
          .transition()
          .style("opacity",0)
      }
      yAxis.scale(y)
    jri
      .transition()
      .attr("width", x(formatDate.parse(JRI[state])))
      .style("stroke-dasharray", "0," + x(formatDate.parse(JRI[state])) + "," + height + "," + (x(formatDate.parse(JRI[state])) + height))




      svg.select(".y.axis").transition().duration(1700).call(yAxis)
      d3.selectAll(".y.axis .tick line")
        .style("stroke","#dedddd")
        .style("stroke-width","1px")
        .attr("x2",0)
        .attr("x1",width)

    }


  });
}

var child = new pym.Child({ renderCallback: drawChart });
