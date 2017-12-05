var dataset;
var chart = dc.barChart("#test");
var pie = dc.pieChart("#pie");
var timeChart = dc.lineChart("#timeSeries");
var ndx;
var killDimension;
var killSumGroup;
var countryDimension;
var countryCountGroup;
var countryKillCountGroup;
var yearDimension;
var yearKillGroup;
var markers = [];
var points = [];
var heatmap;

d3.dsv(",")("data/data.csv", function(d){
  return {
  year: +d.iyear,
  month: +d.imonth,
  day: +d.iday,
  lat: +d.latitude,
  lng: +d.longitude,
  country: d.country_txt,
  killed: +d.nkill,
  description: d.summary};
},function(d){
  dataset = d;


//d3.csv("morley.csv", function(error, experiments) {

ndx                 = crossfilter(dataset);
killDimension        = ndx.dimension(function(d) {return +d.killed;});
killSumGroup       = killDimension.group().reduceCount(function(d){return +d.killed;});
countryDimension = ndx.dimension(function(d){return d.country;});
countryCountGroup = countryDimension.group().reduceCount(function(d){return +d.Country;});
countryKillCountGroup = countryDimension.group().reduceSum(function(d){return +d.killed;});
yearDimension = ndx.dimension(function(d){return d.year;})
yearKillGroup = yearDimension.group().reduceSum(function(d){return +d.killed;})

  chart
    .width(768)
    .height(480)
    .x(d3.scale.linear().domain([1,2000]))
    .brushOn(true)
    .yAxisLabel("This is the Y Axis!")
    .dimension(killDimension)
    .group(killSumGroup)
    .render();

    pie
      .width(768)
      .height(480)
      .dimension(countryDimension)
      .group(countryKillCountGroup)
      .radius(100)
      .innerRadius(50)
      .render();

    timeChart
      .width(768)
      .height(480)
      .x(d3.scale.linear().domain([1970, 2020]))
      .brushOn(true)
      .dimension(yearDimension)
      .group(yearKillGroup)
      .render()


  // set filters
   // yearDimension.filter(function(d){return d>2009});
   // countryDimension.filter(function(d){return d == 'Germany'});
  var subset = countryDimension.top(Infinity);

  // set markers for filtered subset
  // for (i=0; i<subset.length; i++){
  //   console.log(subset[i].lat, subset[i].lng);
  //   var marker = new google.maps.Marker({
  //         position: { lat:subset[i].lat, lng:subset[i].lng },
  //         map: map,
  //         title: 'Hello World!'
  //       });
  //   markers.push(marker);
  // };

  for (i=0; i<subset.length; i++){
      points[i] = {location: new google.maps.LatLng(subset[i].lat, subset[i].lng), weight: subset[i].killed};
    };



    heatmap = new google.maps.visualization.HeatmapLayer({
           data: points,
           map: map
         });

});
