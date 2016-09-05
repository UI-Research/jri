function getActiveCategory(){
  var tab = d3.select("#tab_container .tab.active")
  return tab.node().id.replace("tab_","")
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
function drawChart(container_width){
  var IS_TABLET = d3.select("#is_tablet").style("display") == "block"
  var IS_MOBILE = d3.select("#is_mobile").style("display") == "block"

  d3.select("#tab_PRI").text(function(){return (IS_MOBILE) ? "Prison" : "Prison Population" })
  d3.select("#tab_PRO").text(function(){return (IS_MOBILE) ? "Probation" : "Probation Population" })
  d3.select("#tab_PAR").text(function(){return (IS_MOBILE) ? "Parole" : "Parole Population" })

  // console.log(container_width)

  d3.selectAll("svg").remove()
  var defaultSelector = getActiveState() + "-" + getActiveCategory();
  var pdefaultSelector = getActiveState() + "-" + "PROJ"
  var container_height = d3.select("#contents").node().getBoundingClientRect().height
  var margin = {top: 90, right: 40, bottom: 30, left: 70},
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
var data = [{"Alabama-PAR": "", "Alabama-PRI": "", "Alabama-PRO": "", "Alabama-PROJ": "", "Alaska-PAR": "", "Alaska-PRI": "", "Alaska-PRO": "", "Alaska-PROJ": "", "Arkansas-PAR": "", "Arkansas-PRI": "", "Arkansas-PRO": "", "Arkansas-PROJ": "", "Delaware-PAR": "", "Delaware-PRI": "", "Delaware-PRO": "", "Delaware-PROJ": "", "Georgia-PAR": "", "Georgia-PRI": "", "Georgia-PRO": "", "Georgia-PROJ": "", "Hawaii-PAR": "", "Hawaii-PRI": "", "Hawaii-PRO": "", "Hawaii-PROJ": "", "Idaho-PAR": "", "Idaho-PRI": "", "Idaho-PRO": "", "Idaho-PROJ": "", "Kansas-PAR": "", "Kansas-PRI": "", "Kansas-PRO": "", "Kansas-PROJ": "", "Kentucky-PAR": "", "Kentucky-PRI": "", "Kentucky-PRO": "", "Kentucky-PROJ": "", "Louisiana-PAR": "", "Louisiana-PRI": "", "Louisiana-PRO": "", "Louisiana-PROJ": "", "Michigan-PAR": "", "Michigan-PRI": "", "Michigan-PRO": "", "Michigan-PROJ": "", "Mississippi-PAR": "", "Mississippi-PRI": "", "Mississippi-PRO": "", "Mississippi-PROJ": "", "Missouri-PAR": "", "Missouri-PRI": "", "Missouri-PRO": "", "Missouri-PROJ": "", "Nebraska-PAR": "", "Nebraska-PRI": "", "Nebraska-PRO": "", "Nebraska-PROJ": "", "New_Hampshire-PAR": "", "New_Hampshire-PRI": "2870.0", "New_Hampshire-PRO": "", "New_Hampshire-PROJ": "", "North_Carolina-PAR": "", "North_Carolina-PRI": "", "North_Carolina-PRO": "", "North_Carolina-PROJ": "", "Ohio-PAR": "", "Ohio-PRI": "", "Ohio-PRO": "", "Ohio-PROJ": "", "Oklahoma-PAR": "", "Oklahoma-PRI": "", "Oklahoma-PRO": "", "Oklahoma-PROJ": "", "Oregon-PAR": "", "Oregon-PRI": "", "Oregon-PRO": "", "Oregon-PROJ": "", "Pennsylvania-PAR": "", "Pennsylvania-PRI": "", "Pennsylvania-PRO": "", "Pennsylvania-PROJ": "", "South_Carolina-PAR": "2261.0", "South_Carolina-PRI": "23887.0", "South_Carolina-PRO": "26760.0", "South_Carolina-PROJ": "", "South_Dakota-PAR": "", "South_Dakota-PRI": "", "South_Dakota-PRO": "", "South_Dakota-PROJ": "", "Utah-PAR": "", "Utah-PRI": "", "Utah-PRO": "", "Utah-PROJ": "", "Washington-PAR": "", "Washington-PRI": "", "Washington-PRO": "", "Washington-PROJ": "", "West_Virginia-PAR": "", "West_Virginia-PRI": "", "West_Virginia-PRO": "", "West_Virginia-PROJ": "", "year": "2007"}, {"Alabama-PAR": "", "Alabama-PRI": "", "Alabama-PRO": "", "Alabama-PROJ": "", "Alaska-PAR": "", "Alaska-PRI": "", "Alaska-PRO": "", "Alaska-PROJ": "", "Arkansas-PAR": "19974.0", "Arkansas-PRI": "14686.0", "Arkansas-PRO": "30997.0", "Arkansas-PROJ": "", "Delaware-PAR": "", "Delaware-PRI": "", "Delaware-PRO": "", "Delaware-PROJ": "", "Georgia-PAR": "", "Georgia-PRI": "", "Georgia-PRO": "", "Georgia-PROJ": "", "Hawaii-PAR": "", "Hawaii-PRI": "", "Hawaii-PRO": "", "Hawaii-PROJ": "", "Idaho-PAR": "", "Idaho-PRI": "", "Idaho-PRO": "", "Idaho-PROJ": "", "Kansas-PAR": "", "Kansas-PRI": "", "Kansas-PRO": "", "Kansas-PROJ": "", "Kentucky-PAR": "", "Kentucky-PRI": "22389.0", "Kentucky-PRO": "", "Kentucky-PROJ": "", "Louisiana-PAR": "", "Louisiana-PRI": "38228.0", "Louisiana-PRO": "", "Louisiana-PROJ": "", "Michigan-PAR": "", "Michigan-PRI": "", "Michigan-PRO": "", "Michigan-PROJ": "", "Mississippi-PAR": "", "Mississippi-PRI": "", "Mississippi-PRO": "", "Mississippi-PROJ": "", "Missouri-PAR": "", "Missouri-PRI": "30415.0", "Missouri-PRO": "", "Missouri-PROJ": "", "Nebraska-PAR": "", "Nebraska-PRI": "", "Nebraska-PRO": "", "Nebraska-PROJ": "", "New_Hampshire-PAR": "", "New_Hampshire-PRI": "2682.0", "New_Hampshire-PRO": "", "New_Hampshire-PROJ": "", "North_Carolina-PAR": "", "North_Carolina-PRI": "39326.0", "North_Carolina-PRO": "", "North_Carolina-PROJ": "", "Ohio-PAR": "", "Ohio-PRI": "50371.0", "Ohio-PRO": "", "Ohio-PROJ": "", "Oklahoma-PAR": "", "Oklahoma-PRI": "", "Oklahoma-PRO": "", "Oklahoma-PROJ": "", "Oregon-PAR": "", "Oregon-PRI": "", "Oregon-PRO": "", "Oregon-PROJ": "", "Pennsylvania-PAR": "", "Pennsylvania-PRI": "", "Pennsylvania-PRO": "", "Pennsylvania-PROJ": "", "South_Carolina-PAR": "1911.0", "South_Carolina-PRI": "25066.0", "South_Carolina-PRO": "26986.0", "South_Carolina-PROJ": "", "South_Dakota-PAR": "", "South_Dakota-PRI": "", "South_Dakota-PRO": "", "South_Dakota-PROJ": "", "Utah-PAR": "", "Utah-PRI": "", "Utah-PRO": "", "Utah-PROJ": "", "Washington-PAR": "", "Washington-PRI": "", "Washington-PRO": "", "Washington-PROJ": "", "West_Virginia-PAR": "", "West_Virginia-PRI": "", "West_Virginia-PRO": "", "West_Virginia-PROJ": "", "year": "2008"}, {"Alabama-PAR": "21445.0", "Alabama-PRI": "", "Alabama-PRO": "", "Alabama-PROJ": "", "Alaska-PAR": "", "Alaska-PRI": "", "Alaska-PRO": "", "Alaska-PROJ": "", "Arkansas-PAR": "21445.0", "Arkansas-PRI": "15171.0", "Arkansas-PRO": "29793.0", "Arkansas-PROJ": "", "Delaware-PAR": "", "Delaware-PRI": "", "Delaware-PRO": "", "Delaware-PROJ": "", "Georgia-PAR": "21307.0", "Georgia-PRI": "56411.0", "Georgia-PRO": "151959.0", "Georgia-PROJ": "", "Hawaii-PAR": "1869.0", "Hawaii-PRI": "6005.0", "Hawaii-PRO": "20586.0", "Hawaii-PROJ": "", "Idaho-PAR": "2208.0", "Idaho-PRI": "", "Idaho-PRO": "8077.0", "Idaho-PROJ": "", "Kansas-PAR": "3713.0", "Kansas-PRI": "", "Kansas-PRO": "", "Kansas-PROJ": "", "Kentucky-PAR": "", "Kentucky-PRI": "21445.0", "Kentucky-PRO": "", "Kentucky-PROJ": "", "Louisiana-PAR": "23021.0", "Louisiana-PRI": "39780.0", "Louisiana-PRO": "", "Louisiana-PROJ": "", "Michigan-PAR": "", "Michigan-PRI": "", "Michigan-PRO": "", "Michigan-PROJ": "", "Mississippi-PAR": "", "Mississippi-PRI": "", "Mississippi-PRO": "", "Mississippi-PROJ": "", "Missouri-PAR": "17803.0", "Missouri-PRI": "30563.0", "Missouri-PRO": "53398.0", "Missouri-PROJ": "", "Nebraska-PAR": "", "Nebraska-PRI": "", "Nebraska-PRO": "", "Nebraska-PROJ": "", "New_Hampshire-PAR": "1803.0", "New_Hampshire-PRI": "2917.0", "New_Hampshire-PRO": "4562.0", "New_Hampshire-PROJ": "2917.0", "North_Carolina-PAR": "2067.0", "North_Carolina-PRI": "40824.0", "North_Carolina-PRO": "109540.0", "North_Carolina-PROJ": "", "Ohio-PAR": "13637.0", "Ohio-PRI": "50921.0", "Ohio-PRO": "14927.0", "Ohio-PROJ": "", "Oklahoma-PAR": "3706.0", "Oklahoma-PRI": "26755.0", "Oklahoma-PRO": "27464.0", "Oklahoma-PROJ": "", "Oregon-PAR": "", "Oregon-PRI": "", "Oregon-PRO": "", "Oregon-PROJ": "", "Pennsylvania-PAR": "23224.0", "Pennsylvania-PRI": "51487.0", "Pennsylvania-PRO": "7876.0", "Pennsylvania-PROJ": "", "South_Carolina-PAR": "1653.0", "South_Carolina-PRI": "24734.0", "South_Carolina-PRO": "26694.0", "South_Carolina-PROJ": "24612.0", "South_Dakota-PAR": "", "South_Dakota-PRI": "", "South_Dakota-PRO": "", "South_Dakota-PROJ": "", "Utah-PAR": "", "Utah-PRI": "", "Utah-PRO": "", "Utah-PROJ": "", "Washington-PAR": "", "Washington-PRI": "", "Washington-PRO": "", "Washington-PROJ": "", "West_Virginia-PAR": "1491.0", "West_Virginia-PRI": "", "West_Virginia-PRO": "", "West_Virginia-PROJ": "", "year": "2009"}, {"Alabama-PAR": "21774.0", "Alabama-PRI": "", "Alabama-PRO": "", "Alabama-PROJ": "", "Alaska-PAR": "", "Alaska-PRI": "", "Alaska-PRO": "", "Alaska-PROJ": "", "Arkansas-PAR": "21774.0", "Arkansas-PRI": "16176.0", "Arkansas-PRO": "28156.0", "Arkansas-PROJ": "15916.0", "Delaware-PAR": "", "Delaware-PRI": "", "Delaware-PRO": "", "Delaware-PROJ": "", "Georgia-PAR": "22403.0", "Georgia-PRI": "56035.0", "Georgia-PRO": "156554.0", "Georgia-PROJ": "", "Hawaii-PAR": "1862.0", "Hawaii-PRI": "5987.0", "Hawaii-PRO": "N/A", "Hawaii-PROJ": "", "Idaho-PAR": "2378.0", "Idaho-PRI": "", "Idaho-PRO": "8111.0", "Idaho-PROJ": "", "Kansas-PAR": "3800.0", "Kansas-PRI": "8864.0", "Kansas-PRO": "", "Kansas-PROJ": "", "Kentucky-PAR": "", "Kentucky-PRI": "20117.0", "Kentucky-PRO": "", "Kentucky-PROJ": "20117.0", "Louisiana-PAR": "23210.0", "Louisiana-PRI": "39391.0", "Louisiana-PRO": "", "Louisiana-PROJ": "", "Michigan-PAR": "", "Michigan-PRI": "", "Michigan-PRO": "", "Michigan-PROJ": "", "Mississippi-PAR": "", "Mississippi-PRI": "", "Mississippi-PRO": "", "Mississippi-PROJ": "", "Missouri-PAR": "17730.0", "Missouri-PRI": "30623.0", "Missouri-PRO": "52190.0", "Missouri-PROJ": "", "Nebraska-PAR": "", "Nebraska-PRI": "", "Nebraska-PRO": "", "Nebraska-PROJ": "", "New_Hampshire-PAR": "1869.0", "New_Hampshire-PRI": "2755.0", "New_Hampshire-PRO": "4502.0", "New_Hampshire-PROJ": "2878.0", "North_Carolina-PAR": "2061.0", "North_Carolina-PRI": "40102.0", "North_Carolina-PRO": "107414.0", "North_Carolina-PROJ": "", "Ohio-PAR": "10774.0", "Ohio-PRI": "50987.0", "Ohio-PRO": "11500.0", "Ohio-PROJ": "50987.0", "Oklahoma-PAR": "3538.0", "Oklahoma-PRI": "27378.0", "Oklahoma-PRO": "24711.0", "Oklahoma-PROJ": "", "Oregon-PAR": "13382.0", "Oregon-PRI": "13924.0", "Oregon-PRO": "17423.0", "Oregon-PROJ": "", "Pennsylvania-PAR": "24633.0", "Pennsylvania-PRI": "51321.0", "Pennsylvania-PRO": "8140.0", "Pennsylvania-PROJ": "", "South_Carolina-PAR": "1587.0", "South_Carolina-PRI": "24710.0", "South_Carolina-PRO": "26157.0", "South_Carolina-PROJ": "25565.0", "South_Dakota-PAR": "2803.0", "South_Dakota-PRI": "3450.0", "South_Dakota-PRO": "3326.0", "South_Dakota-PROJ": "", "Utah-PAR": "", "Utah-PRI": "", "Utah-PRO": "", "Utah-PROJ": "", "Washington-PAR": "", "Washington-PRI": "", "Washington-PRO": "", "Washington-PROJ": "", "West_Virginia-PAR": "1264.0", "West_Virginia-PRI": "6483.0", "West_Virginia-PRO": "", "West_Virginia-PROJ": "", "year": "2010"}, {"Alabama-PAR": "23407.0", "Alabama-PRI": "", "Alabama-PRO": "", "Alabama-PROJ": "", "Alaska-PAR": "", "Alaska-PRI": "", "Alaska-PRO": "", "Alaska-PROJ": "", "Arkansas-PAR": "23407.0", "Arkansas-PRI": "15035.0", "Arkansas-PRO": "29741.0", "Arkansas-PROJ": "16767.0", "Delaware-PAR": "", "Delaware-PRI": "6593.0", "Delaware-PRO": "16523.0", "Delaware-PROJ": "6600.0", "Georgia-PAR": "23729.0", "Georgia-PRI": "56330.0", "Georgia-PRO": "163709.0", "Georgia-PROJ": "", "Hawaii-PAR": "1839.0", "Hawaii-PRI": "6071.0", "Hawaii-PRO": "23063.0", "Hawaii-PROJ": "", "Idaho-PAR": "2515.0", "Idaho-PRI": "7578.0", "Idaho-PRO": "8204.0", "Idaho-PROJ": "", "Kansas-PAR": "3852.0", "Kansas-PRI": "9186.0", "Kansas-PRO": "", "Kansas-PROJ": "", "Kentucky-PAR": "10656.0", "Kentucky-PRI": "21684.0", "Kentucky-PRO": "23121.0", "Kentucky-PROJ": "20900.0", "Louisiana-PAR": "25256.0", "Louisiana-PRI": "39709.0", "Louisiana-PRO": "", "Louisiana-PROJ": "39311.0", "Michigan-PAR": "", "Michigan-PRI": "", "Michigan-PRO": "", "Michigan-PROJ": "", "Mississippi-PAR": "6829.0", "Mississippi-PRI": "21367.0", "Mississippi-PRO": "27235.0", "Mississippi-PROJ": "", "Missouri-PAR": "17929.0", "Missouri-PRI": "30833.0", "Missouri-PRO": "54110.0", "Missouri-PROJ": "", "Nebraska-PAR": "", "Nebraska-PRI": "", "Nebraska-PRO": "", "Nebraska-PROJ": "", "New_Hampshire-PAR": "2156.0", "New_Hampshire-PRI": "2444.0", "New_Hampshire-PRO": "4215.0", "New_Hampshire-PROJ": "2923.0", "North_Carolina-PAR": "1900.0", "North_Carolina-PRI": "41130.0", "North_Carolina-PRO": "103882.0", "North_Carolina-PROJ": "41130.0", "Ohio-PAR": "11729.0", "Ohio-PRI": "50237.0", "Ohio-PRO": "11985.0", "Ohio-PROJ": "51297.0", "Oklahoma-PAR": "3300.0", "Oklahoma-PRI": "26692.0", "Oklahoma-PRO": "21629.0", "Oklahoma-PROJ": "26692.0", "Oregon-PAR": "13358.0", "Oregon-PRI": "13937.0", "Oregon-PRO": "17605.0", "Oregon-PROJ": "", "Pennsylvania-PAR": "26486.0", "Pennsylvania-PRI": "51638.0", "Pennsylvania-PRO": "8235.0", "Pennsylvania-PROJ": "51638.0", "South_Carolina-PAR": "1728.0", "South_Carolina-PRI": "23939.0", "South_Carolina-PRO": "25902.0", "South_Carolina-PROJ": "26082.0", "South_Dakota-PAR": "2851.0", "South_Dakota-PRI": "3434.0", "South_Dakota-PRO": "3682.0", "South_Dakota-PROJ": "", "Utah-PAR": "", "Utah-PRI": "", "Utah-PRO": "", "Utah-PROJ": "", "Washington-PAR": "", "Washington-PRI": "", "Washington-PRO": "", "Washington-PROJ": "", "West_Virginia-PAR": "1466.0", "West_Virginia-PRI": "6869.0", "West_Virginia-PRO": "", "West_Virginia-PROJ": "", "year": "2011"}, {"Alabama-PAR": "23657.0", "Alabama-PRI": "26747.0", "Alabama-PRO": "", "Alabama-PROJ": "", "Alaska-PAR": "", "Alaska-PRI": "", "Alaska-PRO": "", "Alaska-PROJ": "", "Arkansas-PAR": "23657.0", "Arkansas-PRI": "14615.0", "Arkansas-PRO": "29528.0", "Arkansas-PROJ": "17440.0", "Delaware-PAR": "", "Delaware-PRI": "6607.0", "Delaware-PRO": "16223.0", "Delaware-PROJ": "6600.0", "Georgia-PAR": "22480.0", "Georgia-PRI": "55933.0", "Georgia-PRO": "163400.0", "Georgia-PROJ": "55933.0", "Hawaii-PAR": "1632.0", "Hawaii-PRI": "6060.0", "Hawaii-PRO": "22654.0", "Hawaii-PROJ": "6060.0", "Idaho-PAR": "2839.0", "Idaho-PRI": "8097.0", "Idaho-PRO": "11456.0", "Idaho-PROJ": "", "Kansas-PAR": "4114.0", "Kansas-PRI": "9374.0", "Kansas-PRO": "", "Kansas-PROJ": "9374.0", "Kentucky-PAR": "10338.0", "Kentucky-PRI": "21801.0", "Kentucky-PRO": "22658.0", "Kentucky-PROJ": "21037.0", "Louisiana-PAR": "25834.0", "Louisiana-PRI": "40170.0", "Louisiana-PRO": "", "Louisiana-PROJ": "39247.0", "Michigan-PAR": "", "Michigan-PRI": "", "Michigan-PRO": "", "Michigan-PROJ": "", "Mississippi-PAR": "6949.0", "Mississippi-PRI": "21972.0", "Mississippi-PRO": "28293.0", "Mississippi-PROJ": "", "Missouri-PAR": "16931.0", "Missouri-PRI": "31247.0", "Missouri-PRO": "51811.0", "Missouri-PROJ": "", "Nebraska-PAR": "", "Nebraska-PRI": "4609.0", "Nebraska-PRO": "", "Nebraska-PROJ": "", "New_Hampshire-PAR": "1885.0", "New_Hampshire-PRI": "2563.0", "New_Hampshire-PRO": "3803.0", "New_Hampshire-PROJ": "2960.0", "North_Carolina-PAR": "1829.0", "North_Carolina-PRI": "38387.0", "North_Carolina-PRO": "103163.0", "North_Carolina-PROJ": "41987.0", "Ohio-PAR": "13944.0", "Ohio-PRI": "49713.0", "Ohio-PRO": "12137.0", "Ohio-PROJ": "52164.0", "Oklahoma-PAR": "3300.0", "Oklahoma-PRI": "25935.0", "Oklahoma-PRO": "21629.0", "Oklahoma-PROJ": "27159.0", "Oregon-PAR": "13422.0", "Oregon-PRI": "14285.0", "Oregon-PRO": "17377.0", "Oregon-PROJ": "", "Pennsylvania-PAR": "27913.0", "Pennsylvania-PRI": "51757.0", "Pennsylvania-PRO": "8324.0", "Pennsylvania-PROJ": "51722.0", "South_Carolina-PAR": "1626.0", "South_Carolina-PRI": "23334.0", "South_Carolina-PRO": "27824.0", "South_Carolina-PROJ": "26861.0", "South_Dakota-PAR": "2811.0", "South_Dakota-PRI": "3546.0", "South_Dakota-PRO": "4325.0", "South_Dakota-PROJ": "3636.0", "Utah-PAR": "2993.0", "Utah-PRI": "6960.0", "Utah-PRO": "11394.0", "Utah-PROJ": "", "Washington-PAR": "", "Washington-PRI": "", "Washington-PRO": "", "Washington-PROJ": "", "West_Virginia-PAR": "1498.0", "West_Virginia-PRI": "7070.0", "West_Virginia-PRO": "", "West_Virginia-PROJ": "7146.0", "year": "2012"}, {"Alabama-PAR": "22721.0", "Alabama-PRI": "26569.0", "Alabama-PRO": "", "Alabama-PROJ": "", "Alaska-PAR": "", "Alaska-PRI": "", "Alaska-PRO": "", "Alaska-PROJ": "", "Arkansas-PAR": "22721.0", "Arkansas-PRI": "17211.0", "Arkansas-PRO": "28646.0", "Arkansas-PROJ": "18147.0", "Delaware-PAR": "", "Delaware-PRI": "6991.0", "Delaware-PRO": "15995.0", "Delaware-PROJ": "6600.0", "Georgia-PAR": "25020.0", "Georgia-PRI": "53856.0", "Georgia-PRO": "164484.0", "Georgia-PROJ": "56664.0", "Hawaii-PAR": "1589.0", "Hawaii-PRI": "5643.0", "Hawaii-PRO": "21510.0", "Hawaii-PROJ": "6132.0", "Idaho-PAR": "2939.0", "Idaho-PRI": "8221.0", "Idaho-PRO": "11478.0", "Idaho-PROJ": "8160.0", "Kansas-PAR": "3221.0", "Kansas-PRI": "9581.0", "Kansas-PRO": "", "Kansas-PROJ": "9680.0", "Kentucky-PAR": "12228.0", "Kentucky-PRI": "20047.0", "Kentucky-PRO": "22459.0", "Kentucky-PROJ": "21174.0", "Louisiana-PAR": "26501.0", "Louisiana-PRI": "39299.0", "Louisiana-PRO": "", "Louisiana-PROJ": "39178.0", "Michigan-PAR": "", "Michigan-PRI": "", "Michigan-PRO": "", "Michigan-PROJ": "", "Mississippi-PAR": "6483.0", "Mississippi-PRI": "22492.0", "Mississippi-PRO": "29936.0", "Mississippi-PROJ": "22497.0", "Missouri-PAR": "15996.0", "Missouri-PRI": "31537.0", "Missouri-PRO": "48468.0", "Missouri-PROJ": "", "Nebraska-PAR": "", "Nebraska-PRI": "4760.0", "Nebraska-PRO": "", "Nebraska-PROJ": "", "New_Hampshire-PAR": "1942.0", "New_Hampshire-PRI": "2643.0", "New_Hampshire-PRO": "3896.0", "New_Hampshire-PROJ": "2989.0", "North_Carolina-PAR": "1612.0", "North_Carolina-PRI": "36227.0", "North_Carolina-PRO": "98436.0", "North_Carolina-PROJ": "42013.0", "Ohio-PAR": "16088.0", "Ohio-PRI": "50419.0", "Ohio-PRO": "12642.0", "Ohio-PROJ": "52784.0", "Oklahoma-PAR": "3059.0", "Oklahoma-PRI": "26539.0", "Oklahoma-PRO": "21085.0", "Oklahoma-PROJ": "27569.0", "Oregon-PAR": "13628.0", "Oregon-PRI": "14664.0", "Oregon-PRO": "17385.0", "Oregon-PROJ": "14600.0", "Pennsylvania-PAR": "30025.0", "Pennsylvania-PRI": "51382.0", "Pennsylvania-PRO": "8091.0", "Pennsylvania-PROJ": "52279.0", "South_Carolina-PAR": "1622.0", "South_Carolina-PRI": "23680.0", "South_Carolina-PRO": "29173.0", "South_Carolina-PROJ": "27810.0", "South_Dakota-PAR": "2871.0", "South_Dakota-PRI": "3623.0", "South_Dakota-PRO": "5011.0", "South_Dakota-PROJ": "3717.0", "Utah-PAR": "3283.0", "Utah-PRI": "7072.0", "Utah-PRO": "11203.0", "Utah-PROJ": "", "Washington-PAR": "", "Washington-PRI": "", "Washington-PRO": "", "Washington-PROJ": "", "West_Virginia-PAR": "1813.0", "West_Virginia-PRI": "6785.0", "West_Virginia-PRO": "", "West_Virginia-PROJ": "7531.0", "year": "2013"}, {"Alabama-PAR": "22414.0", "Alabama-PRI": "26029.0", "Alabama-PRO": "", "Alabama-PROJ": "26029.0", "Alaska-PAR": "", "Alaska-PRI": "", "Alaska-PRO": "", "Alaska-PROJ": "", "Arkansas-PAR": "22414.0", "Arkansas-PRI": "17850.0", "Arkansas-PRO": "27756.0", "Arkansas-PROJ": "18688.0", "Delaware-PAR": "", "Delaware-PRI": "6876.0", "Delaware-PRO": "16227.0", "Delaware-PROJ": "6650.0", "Georgia-PAR": "25195.0", "Georgia-PRI": "53131.0", "Georgia-PRO": "166207.0", "Georgia-PROJ": "57492.0", "Hawaii-PAR": "1647.0", "Hawaii-PRI": "5993.0", "Hawaii-PRO": "20908.0", "Hawaii-PROJ": "6163.0", "Idaho-PAR": "3213.0", "Idaho-PRI": "8120.0", "Idaho-PRO": "10644.0", "Idaho-PROJ": "8267.0", "Kansas-PAR": "3211.0", "Kansas-PRI": "9612.0", "Kansas-PRO": "", "Kansas-PROJ": "9916.0", "Kentucky-PAR": "11659.0", "Kentucky-PRI": "20981.0", "Kentucky-PRO": "22771.0", "Kentucky-PROJ": "21311.0", "Louisiana-PAR": "27481.0", "Louisiana-PRI": "38030.0", "Louisiana-PRO": "", "Louisiana-PROJ": "39235.0", "Michigan-PAR": "", "Michigan-PRI": "", "Michigan-PRO": "", "Michigan-PROJ": "", "Mississippi-PAR": "8057.0", "Mississippi-PRI": "20624.0", "Mississippi-PRO": "30881.0", "Mississippi-PROJ": "22869.0", "Missouri-PAR": "15243.0", "Missouri-PRI": "31942.0", "Missouri-PRO": "44493.0", "Missouri-PROJ": "", "Nebraska-PAR": "", "Nebraska-PRI": "5039.0", "Nebraska-PRO": "", "Nebraska-PROJ": "5039.0", "New_Hampshire-PAR": "2185.0", "New_Hampshire-PRI": "2755.0", "New_Hampshire-PRO": "3765.0", "New_Hampshire-PROJ": "3012.0", "North_Carolina-PAR": "1467.0", "North_Carolina-PRI": "37665.0", "North_Carolina-PRO": "94020.0", "North_Carolina-PROJ": "42267.0", "Ohio-PAR": "16633.0", "Ohio-PRI": "50510.0", "Ohio-PRO": "12248.0", "Ohio-PROJ": "53413.0", "Oklahoma-PAR": "3204.0", "Oklahoma-PRI": "27561.0", "Oklahoma-PRO": "21586.0", "Oklahoma-PROJ": "27887.0", "Oregon-PAR": "14105.0", "Oregon-PRI": "14539.0", "Oregon-PRO": "17697.0", "Oregon-PROJ": "14861.0", "Pennsylvania-PAR": "31726.0", "Pennsylvania-PRI": "50756.0", "Pennsylvania-PRO": "8084.0", "Pennsylvania-PROJ": "52236.0", "South_Carolina-PAR": "1618.0", "South_Carolina-PRI": "22315.0", "South_Carolina-PRO": "28021.0", "South_Carolina-PROJ": "27903.0", "South_Dakota-PAR": "2692.0", "South_Dakota-PRI": "3627.0", "South_Dakota-PRO": "5415.0", "South_Dakota-PROJ": "3833.0", "Utah-PAR": "3312.0", "Utah-PRI": "7024.0", "Utah-PRO": "11983.0", "Utah-PROJ": "7072.0", "Washington-PAR": "", "Washington-PRI": "", "Washington-PRO": "", "Washington-PROJ": "", "West_Virginia-PAR": "2074.0", "West_Virginia-PRI": "6896.0", "West_Virginia-PRO": "", "West_Virginia-PROJ": "7821.0", "year": "2014"}, {"Alabama-PAR": "21708.0", "Alabama-PRI": "25201.0", "Alabama-PRO": "", "Alabama-PROJ": "26029.0", "Alaska-PAR": "", "Alaska-PRI": "", "Alaska-PRO": "", "Alaska-PROJ": "", "Arkansas-PAR": "21708.0", "Arkansas-PRI": "", "Arkansas-PRO": "27127.0", "Arkansas-PROJ": "19222.0", "Delaware-PAR": "", "Delaware-PRI": "6704.0", "Delaware-PRO": "16089.0", "Delaware-PROJ": "6675.0", "Georgia-PAR": "23859.0", "Georgia-PRI": "53102.0", "Georgia-PRO": "167388.0", "Georgia-PROJ": "58664.0", "Hawaii-PAR": "1545.0", "Hawaii-PRI": "6024.0", "Hawaii-PRO": "20828.0", "Hawaii-PROJ": "6193.0", "Idaho-PAR": "3723.0", "Idaho-PRI": "8162.0", "Idaho-PRO": "10880.0", "Idaho-PROJ": "8506.0", "Kansas-PAR": "3406.0", "Kansas-PRI": "9822.0", "Kansas-PRO": "", "Kansas-PROJ": "10154.0", "Kentucky-PAR": "11588.0", "Kentucky-PRI": "", "Kentucky-PRO": "22314.0", "Kentucky-PROJ": "21448.0", "Louisiana-PAR": "", "Louisiana-PRI": "36377.0", "Louisiana-PRO": "", "Louisiana-PROJ": "39335.0", "Michigan-PAR": "", "Michigan-PRI": "", "Michigan-PRO": "", "Michigan-PROJ": "", "Mississippi-PAR": "9692.0", "Mississippi-PRI": "18789.0", "Mississippi-PRO": "35145.0", "Mississippi-PROJ": "23230.0", "Missouri-PAR": "15288.0", "Missouri-PRI": "32330.0", "Missouri-PRO": "41136.0", "Missouri-PROJ": "", "Nebraska-PAR": "", "Nebraska-PRI": "5345.0", "Nebraska-PRO": "", "Nebraska-PROJ": "5290.0", "New_Hampshire-PAR": "2320.0", "New_Hampshire-PRI": "2715.0", "New_Hampshire-PRO": "3692.0", "New_Hampshire-PROJ": "3029.0", "North_Carolina-PAR": "1407.0", "North_Carolina-PRI": "37379.0", "North_Carolina-PRO": "89106.0", "North_Carolina-PROJ": "42562.0", "Ohio-PAR": "17541.0", "Ohio-PRI": "50407.0", "Ohio-PRO": "12418.0", "Ohio-PROJ": "53858.0", "Oklahoma-PAR": "", "Oklahoma-PRI": "27889.0", "Oklahoma-PRO": "", "Oklahoma-PROJ": "28232.0", "Oregon-PAR": "14122.0", "Oregon-PRI": "14655.0", "Oregon-PRO": "17369.0", "Oregon-PROJ": "15021.0", "Pennsylvania-PAR": "33076.0", "Pennsylvania-PRI": "49914.0", "Pennsylvania-PRO": "8193.0", "Pennsylvania-PROJ": "51693.0", "South_Carolina-PAR": "2007.0", "South_Carolina-PRI": "21773.0", "South_Carolina-PRO": "26806.0", "South_Carolina-PROJ": "", "South_Dakota-PAR": "2627.0", "South_Dakota-PRI": "3588.0", "South_Dakota-PRO": "5918.0", "South_Dakota-PROJ": "3942.0", "Utah-PAR": "3693.0", "Utah-PRI": "6521.0", "Utah-PRO": "12784.0", "Utah-PROJ": "7356.0", "Washington-PAR": "", "Washington-PRI": "", "Washington-PRO": "", "Washington-PROJ": "", "West_Virginia-PAR": "2088.0", "West_Virginia-PRI": "7118.0", "West_Virginia-PRO": "", "West_Virginia-PROJ": "8072.0", "year": "2015"}, {"Alabama-PROJ": "26029.0", "Alaska-PROJ": "", "Arkansas-PROJ": "19734.0", "Delaware-PROJ": "", "Georgia-PROJ": "59553.0", "Hawaii-PROJ": "6224.0", "Idaho-PROJ": "8751.0", "Kansas-PROJ": "10312.0", "Kentucky-PROJ": "21584.0", "Louisiana-PROJ": "", "Michigan-PROJ": "", "Mississippi-PROJ": "23500.0", "Missouri-PROJ": "", "Nebraska-PROJ": "5370.0", "New_Hampshire-PROJ": "", "North_Carolina-PROJ": "42898.0", "Ohio-PROJ": "", "Oklahoma-PROJ": "28534.0", "Oregon-PROJ": "15220.0", "Pennsylvania-PROJ": "51151.0", "South_Carolina-PROJ": "", "South_Dakota-PROJ": "4070.0", "Utah-PROJ": "7498.0", "Washington-PROJ": "", "West_Virginia-PROJ": "8304.0", "year": "2016"}, {"Alabama-PROJ": "26029.0", "Alaska-PROJ": "", "Arkansas-PROJ": "", "Delaware-PROJ": "", "Georgia-PROJ": "59732.0", "Hawaii-PROJ": "6255.0", "Idaho-PROJ": "9001.0", "Kansas-PROJ": "10624.0", "Kentucky-PROJ": "", "Louisiana-PROJ": "", "Michigan-PROJ": "", "Mississippi-PROJ": "23611.0", "Missouri-PROJ": "", "Nebraska-PROJ": "5480.0", "New_Hampshire-PROJ": "", "North_Carolina-PROJ": "43220.0", "Ohio-PROJ": "", "Oklahoma-PROJ": "28798.0", "Oregon-PROJ": "15351.0", "Pennsylvania-PROJ": "", "South_Carolina-PROJ": "", "South_Dakota-PROJ": "4213.0", "Utah-PROJ": "7649.0", "Washington-PROJ": "", "West_Virginia-PROJ": "8633.0", "year": "2017"}, {"Alabama-PROJ": "26029.0", "Alaska-PROJ": "", "Arkansas-PROJ": "", "Delaware-PROJ": "", "Georgia-PROJ": "", "Hawaii-PROJ": "6287.0", "Idaho-PROJ": "9253.0", "Kansas-PROJ": "10819.0", "Kentucky-PROJ": "", "Louisiana-PROJ": "", "Michigan-PROJ": "", "Mississippi-PROJ": "23780.0", "Missouri-PROJ": "", "Nebraska-PROJ": "5572.0", "New_Hampshire-PROJ": "", "North_Carolina-PROJ": "", "Ohio-PROJ": "", "Oklahoma-PROJ": "29072.0", "Oregon-PROJ": "15502.0", "Pennsylvania-PROJ": "", "South_Carolina-PROJ": "", "South_Dakota-PROJ": "4336.0", "Utah-PROJ": "", "Washington-PROJ": "", "West_Virginia-PROJ": "8893.0", "year": "2018"}, {"Alabama-PROJ": "26029.0", "Alaska-PROJ": "", "Arkansas-PROJ": "", "Delaware-PROJ": "", "Georgia-PROJ": "", "Hawaii-PROJ": "", "Idaho-PROJ": "9408.0", "Kansas-PROJ": "", "Kentucky-PROJ": "", "Louisiana-PROJ": "", "Michigan-PROJ": "", "Mississippi-PROJ": "23903.0", "Missouri-PROJ": "", "Nebraska-PROJ": "5589.0", "New_Hampshire-PROJ": "", "North_Carolina-PROJ": "", "Ohio-PROJ": "", "Oklahoma-PROJ": "", "Oregon-PROJ": "", "Pennsylvania-PROJ": "", "South_Carolina-PROJ": "", "South_Dakota-PROJ": "", "Utah-PROJ": "", "Washington-PROJ": "", "West_Virginia-PROJ": "", "year": "2019"}, {"Alabama-PROJ": "", "Alaska-PROJ": "", "Arkansas-PROJ": "", "Delaware-PROJ": "", "Georgia-PROJ": "", "Hawaii-PROJ": "", "Idaho-PROJ": "", "Kansas-PROJ": "", "Kentucky-PROJ": "", "Louisiana-PROJ": "", "Michigan-PROJ": "", "Mississippi-PROJ": "23984.0", "Missouri-PROJ": "", "Nebraska-PROJ": "5581.0", "New_Hampshire-PROJ": "", "North_Carolina-PROJ": "", "Ohio-PROJ": "", "Oklahoma-PROJ": "", "Oregon-PROJ": "", "Pennsylvania-PROJ": "", "South_Carolina-PROJ": "", "South_Dakota-PROJ": "", "Utah-PROJ": "", "Washington-PROJ": "", "West_Virginia-PROJ": "", "year": "2020"}]
console.dir(data)
console.log(defaultSelector)
  // d3.json("data/jridata.json", function(error, data) {
    var slice = data.filter(function(d){ return typeof(d[defaultSelector]) != "undefined" && d[defaultSelector] != 0})
    var pslice = data.filter(function(d){ return typeof(d[pdefaultSelector]) != "undefined" && d[pdefaultSelector] != 0})

    // if (error) throw error;

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


  // });
if(IS_TABLET){
  d3.select("body").style("height", function(){ return d3.select("#contents").node().getBoundingClientRect().height})
}else{
  console.log("foo")
  d3.select("body").style("height", function(){ return d3.select("#chart").node().getBoundingClientRect().height + 30})
}
}

// drawChart(900)
var child = new pym.Child({ renderCallback: drawChart, polling: 500 });
