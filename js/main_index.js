function getActiveCategory(){
  var tab = d3.select("#tab_container .tab.active")
  return tab.node().id.replace("tab_","")
  // return "PRI"
}
function getActiveState(){
  // return $(".styled-select.states select").val()
  return "Georgia"
}

function moveTooltip(dot){
        var TT_WIDTH = 200
        var d = d3.select(dot).datum()
        var main_val = d[getActiveState() + "-" + getActiveCategory()]
        var proj_val = d[getActiveState() + "-" + "PROJ"]
        var comma = d3.format(",")
        var year = d.year
        d3.selectAll(".tt_year").text(year)
        if(main_val != 0 && ! isNaN(main_val)){
          d3.select("#tt_main_text").text("Population: ")
          d3.select("#tt_main_val").text(comma(main_val))
        }else{
          d3.select("#tt_main_text").text("")
          d3.select("#tt_main_val").text("")
          d3.select("#tt_main .tt_year").text("")
          d3.select("#tooltip").style("height","36px")
        }
        if(proj_val != 0 && ! isNaN(proj_val) && getActiveCategory() == "PRI"){
          d3.select("#tt_proj_text").text("Projected Population: ")
          d3.select("#tt_proj_val").text(comma(proj_val))
        }else{
          d3.select("#tt_proj_text").text("")
          d3.select("#tt_proj_val").text("")
          d3.select("#tt_proj .tt_year").text("")
          d3.select("#tooltip").style("height","24px")
        }
        if( (proj_val != 0 && ! isNaN(proj_val) && getActiveCategory() == "PRI") && (main_val != 0 && ! isNaN(main_val)) ){
            d3.select("#tooltip").style("height","62px")
        }

        if(dot == null){
          hideTooltip();
          return false
        }else{
          d3.select("#tooltip")
          .style("opacity",1)
          .style("top", function(){
            return dot.getBoundingClientRect().top + 12
          })
          .style("left", function(){
            if(d3.select("svg").node().getBoundingClientRect().width - dot.getBoundingClientRect().left - TT_WIDTH < 0){
              return dot.getBoundingClientRect().left - 6 - TT_WIDTH
            }
            return dot.getBoundingClientRect().left + 12
          })
        }
}
function hideTooltip(){
  d3.selectAll("circle.active").classed("active",false)
  d3.select("#tooltip")
    .style("opacity",0)
}
function drawChart(){
  container_width = $("h2.jri-state")[0].getBoundingClientRect().width
  var IS_TABLET = d3.select("#is_tablet").style("display") == "block"
  var IS_MOBILE = d3.select("#is_mobile").style("display") == "block"

  // d3.select("#tab_PRI").text(function(){return (IS_MOBILE) ? "Prison" : "Prison Population" })
  // d3.select("#tab_PRO").text(function(){return (IS_MOBILE) ? "Probation" : "Probation Population" })
  // d3.select("#tab_PAR").text(function(){return (IS_MOBILE) ? "Parole" : "Parole Population" })

  // console.log(container_width)

  d3.selectAll("svg").remove()
  var defaultSelector = getActiveState() + "-" + getActiveCategory();
  var pdefaultSelector = getActiveState() + "-" + "PROJ"
  // var container_height = d3.select("#contents").node().getBoundingClientRect().height
  var container_height;
  if(IS_MOBILE) container_height = 400
  else if(IS_TABLET) container_height = 400
  else container_height = 400
  // var container_height = container_width/scalar

  var margin = {top: 90, right: 40, bottom: 50, left: 70},
      width = (IS_TABLET) ? container_width - margin.left - margin.right : container_width*.7 - margin.left - margin.right,
      height = (IS_TABLET) ? container_height-90 - margin.top - margin.bottom : container_height - 40 - margin.top - margin.bottom;
  d3.select(".tab.gap").style("width", function(){
    if(IS_TABLET){
      return container_width - 50 - (150+10)*3
    }else{
      return container_width*.7 - 50 - (150+50)*3
    }
  })


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

  var svg = d3.select("#chart").insert("svg",".div-dash-block")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
            .on("mousemove", mousemove)
            .on("mouseout",hideTooltip)


    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


  bisectDate = d3.bisector(function(d) { return parseFloat(d.year); }).left
  function mousemove() {
// return typeof(d[selector]) != "undefined" && d[selector] != 0
    var x0 = x.invert(d3.mouse(this)[0]-margin.left)
    var year = x0.getFullYear()
    d3.selectAll(".active.dot").classed("active",false)
    d3.selectAll(".active.pdot").classed("active",false)
    d3.selectAll(".dot.y" + year)
      .classed("active", function(d){
        return (typeof(d[defaultSelector]) != "undefined" && d[defaultSelector] != 0)
      })
    d3.selectAll(".pdot.y" + year)
      .classed("active", function(d){
        if(getActiveCategory() == "PRI"){
          return (typeof(d[pdefaultSelector]) != "undefined" && d[pdefaultSelector] != 0)
        } else return false
      })
      // d3.select("#tooltip")
      //   .style("top", function(){
      //     return d3.select("circle.active").node().getBoundingClientRect().top + 12
      //   })
      //   .style("left", function(){
      //     return d3.select("circle.active").node().getBoundingClientRect().left + 12
      //   })
      moveTooltip(d3.select("circle.active").node())
  }
  svg
    .append('defs')
    .append('pattern')
      .attr('id', 'diagonalHatch')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 8)
      .attr('height', 8)
    .append('path')
      .attr('d', 'M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4')
      .attr('stroke', '#d2d2d2')
      .attr('stroke-width', 1);

  d3.json("data/jridata.json", function(error, data) {
    var slice = data.filter(function(d){ return typeof(d[defaultSelector]) != "undefined" && d[defaultSelector] != 0})
    var pslice = data.filter(function(d){ return typeof(d[pdefaultSelector]) != "undefined" && d[pdefaultSelector] != 0})

    if (error) throw error;

    x.domain([d3.min(slice, function(d){ return formatDate.parse(d.year)}), d3.max(pslice, function(d){ return formatDate.parse(d.year)})]);
    y.domain([0, d3.max(slice, function(d){ return +d[defaultSelector]*1.5})])


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
      .style("stroke","#e3e3e3")
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
      .style("stroke","#5c5859")
      .style("stroke-width","2px")
      .style("stroke-dasharray", "0," + x(formatDate.parse(JRI[getActiveState()])) + "," + height + "," + (x(formatDate.parse(JRI[getActiveState()])) + height))

    var pointer = svg.append("g")
          .attr("transform", "translate(" + (x(formatDate.parse(JRI[getActiveState()])) - 137) + "," + height/2 + ")")

        pointer
          .append("polygon")
          .attr("points","0,24.8 119.8,24.8 136,12.1 119.8,0 0,0")
          .attr("fill","#5c5859")
          .attr("stroke","#5c5859")
          .attr("stroke-width","2px")
        pointer.append("text")
          .text("JRI Implementation")
          .style("font-size","12px")
          .attr("dy",17)
          .attr("dx",5)
          .style("font-weight","500")
          .style("fill","white")
          .style("letter-spacing",".7px")

    var mainLine = svg.append("path")
        .datum(slice)
        .attr("class", "line")
        .attr("d", line);
    var projLine = svg.append("path")
        .datum(pslice)
        .attr("class", "proj_line")
        .attr("d", pline)
        .style("opacity", function(){ return (getActiveCategory() == "PRI") ? 1 : 0});

    var mainDot = svg.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class",function(d){
        return "dot y" + d.year
      })
      .attr("cx", function(d){ 
        return x(formatDate.parse(d.year))
      })
      .attr("cy", function(d){
         return y(+d[defaultSelector])
      })
      .attr("r",6)

    var projDot = svg.selectAll(".pdot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class",function(d){
        return "pdot y" + d.year
      })
      .attr("cx", function(d){ 
        return x(formatDate.parse(d.year))
      })
      .attr("cy", function(d){
         return y(+d[pdefaultSelector])
      })
      .attr("r",6)

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
      hideTooltip();
      console.log(state, category)
      var selector = state + "-" + category
      var pselector = state + "-PROJ"
      var slice = data.filter(function(d){ return typeof(d[selector]) != "undefined" && d[selector] != 0})
      var pslice = data.filter(function(d){ return typeof(d[pselector]) != "undefined" && d[pselector] != 0})

      if (category != "PRI"){
        d3.select("#l_proj")
          .transition()
          .style("opacity", 0)
      }else{
        d3.select("#l_proj")
          .transition()
          .style("opacity", 1)
      }
      var FULL = {"PRI" : "Prison", "PAR": "Parole", "PRO": "Probation"}
      d3.select("#l_main_text span").text(FULL[category])
      // x.domain(d3.extent(slice, function(d) { return formatDate.parse(d.year) }));
      var max = d3.max(slice, function(d){ return +d[selector]})
      var pmax = (category == "PRI") ? d3.max(pslice, function(d){ return +d[pselector]}) : max

      if(category != "PRI"){
        x.domain([d3.min(slice, function(d){ return formatDate.parse(d.year)}), d3.max(slice, function(d){ return formatDate.parse(d.year)})]);
      }else{
        x.domain([d3.min(slice, function(d){ return formatDate.parse(d.year)}), d3.max(pslice, function(d){ return formatDate.parse(d.year)})]);
      }


      y.domain([0, Math.max(max*1.5, pmax*1.5)])
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


      mainDot
      .data(data)
      .attr("class",function(d){
        return "dot y" + d.year
      })
      .transition()
      .attr("cx", function(d){ 
        return x(formatDate.parse(d.year))
      })
      .attr("cy", function(d){
         return y(+d[selector])
      })
      
      if(category == "PRI"){
        projLine
          .datum(pslice)
          .transition()
          .style("opacity",1)
          .attr("d", pline);
      projDot
        .data(data)
        .attr("class",function(d){
          return "pdot y" + d.year
        })
        .transition()
        .attr("cx", function(d){ 
          return x(formatDate.parse(d.year))
        })
        .attr("cy", function(d){
           return y(+d[pselector])
        })
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

      pointer
        .transition()
        .attr("transform", "translate(" + (x(formatDate.parse(JRI[state])) - 137) + "," + height/2 + ")")



      svg.select(".x.axis").transition().duration(1700).call(xAxis)
      svg.select(".y.axis").transition().duration(1700).call(yAxis)
      d3.selectAll(".y.axis .tick line")
        .style("stroke","#dedddd")
        .style("stroke-width","1px")
        .attr("x2",0)
        .attr("x1",width)

    d3.select("svg")
    .on("mousemove", function(){
      var x0 = x.invert(d3.mouse(this)[0]-margin.left)
      var year = x0.getFullYear()
      d3.selectAll(".active.dot").classed("active",false)
      d3.selectAll(".active.pdot").classed("active",false)
      d3.selectAll(".dot.y" + year)
        .classed("active", function(d){
          if(typeof(d[selector]) != "undefined" && d[selector] != 0){
           var dot = this;
           moveTooltip(dot)
            return true
          }else{
            hideTooltip();
            return false
         }
        })

      d3.selectAll(".pdot.y" + year)
        .classed("active", function(d){
          if(getActiveCategory() == "PRI"){
          if(typeof(d[pselector]) != "undefined" && d[pselector] != 0){
           var dot = this;
           moveTooltip(dot)
            return true
            }
          }else{
            // hideTooltip()
            return false
          }
        })
      })

    }


  });
if(IS_TABLET){
  // d3.select("body").style("height", function(){ return d3.select("#contents").node().getBoundingClientRect().height})
}else{
  d3.select("body").style("height", function(){ return d3.select("#chart").node().getBoundingClientRect().height + 30})
}
}

drawChart()
$(window).on("resize",drawChart)