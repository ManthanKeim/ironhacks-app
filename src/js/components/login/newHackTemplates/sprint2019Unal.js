/// New project template
export const indexContent = `<!DOCTYPE html>
    <html>
    <head>
      <title>Ironhacks project</title>
      <link href="https://fonts.googleapis.com/css?family=Muli" rel="stylesheet"/>
      <link rel="stylesheet" href="./css/main.css"/>
    </head>
    <body>
      <h1>IronHacks Project editor demo</h1>

      <h2>D3.js demo:</h2>

      <p>
        Bellow you will find a D3 demo, you can find all the JavaScript on the "visualization.js" file, in the "js" folder.
      </p>
    
      <p>
      This diagram shows the distribution of age groups in the United States over the last 150 years. Use the arrow keys to observe the changing population. Data from the Minnesota Population Center. Use the arrow keys to change the displayed year. The blue bars are the male population for each five-year age bracket, while the pink bars are the female population; the bars are partially transparent so that you can see how they overlap, unlike the traditional side-by-side display which makes it difficult to compare the relative distribution of the sexes.</p>

      <a href="https://bl.ocks.org/mbostock/4062085">Click here to check the full d3.js example.</a>
      
      <svg id="d3Example"></svg>

      <h2>Google Maps demo</h2>

      <p>
        Bellow you will find a GoogleMaps demo, PLEASE DO NOT MODIFY the google API key, other wise you will have to provide your own key. <br/> You can find all the JavaScript on the "map.js" on the "js" folder.
      </p>

      <div id="googleMapContainer"></div>
      
      <script type="text/javascript" src="//d3js.org/d3.v3.min.js"></script>
      <script type="text/javascript" src="./js/main.js"></script>
      <script type="text/javascript" src="./js/visualization.js"></script>
      <script type="text/javascript" src="./js/map.js"></script>
      <!-- Google Maps -->
     <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAwWYDB9v1MopiTtPpUXMDaCwAlOQbtn3c&callback=onGoogleMapResponse"
      ></script>
    </body>
  </html>`

export const mainJSContent = `/*
    Feel free to put your custom js here.
  */

  console.log("Hello Ironhacks!")`

export const mapJSContent = `var map;

  function onGoogleMapResponse(){
    map = new google.maps.Map(document.getElementById('googleMapContainer'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    });
  }`

export const visualizationJSContent = `
  var el   = document.getElementById("d3Example");
  var rect = el.getBoundingClientRect();

  var margin = {top: 20, right: 40, bottom: 30, left: 20},
      width = rect.width - margin.left - margin.right,
      height = rect.height - margin.top - margin.bottom,
      barWidth = Math.floor(width / 19) - 1;

  var x = d3.scale.linear()
      .range([barWidth / 2, width - barWidth / 2]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("right")
      .tickSize(-width)
      .tickFormat(function(d) { return Math.round(d / 1e6) + "M"; });

  // An SVG element with a bottom-right origin.
  var svg = d3.select("#d3Example").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // A sliding container to hold the bars by birthyear.
  var birthyears = svg.append("g")
      .attr("class", "birthyears");

  // A label for the current year.
  var title = svg.append("text")
      .attr("class", "title")
      .attr("dy", ".71em")
      .text(2000);

  d3.csv("./data/population.csv", function(error, data) {

    // Convert strings to numbers.
    data.forEach(function(d) {
      d.people = +d.people;
      d.year = +d.year;
      d.age = +d.age;
    });

    // Compute the extent of the data set in age and years.
    var age1 = d3.max(data, function(d) { return d.age; }),
        year0 = d3.min(data, function(d) { return d.year; }),
        year1 = d3.max(data, function(d) { return d.year; }),
        year = year1;

    // Update the scale domains.
    x.domain([year1 - age1, year1]);
    y.domain([0, d3.max(data, function(d) { return d.people; })]);

    // Produce a map from year and birthyear to [male, female].
    data = d3.nest()
        .key(function(d) { return d.year; })
        .key(function(d) { return d.year - d.age; })
        .rollup(function(v) { return v.map(function(d) { return d.people; }); })
        .map(data);

    // Add an axis to show the population values.
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxis)
      .selectAll("g")
      .filter(function(value) { return !value; })
        .classed("zero", true);

    // Add labeled rects for each birthyear (so that no enter or exit is required).
    var birthyear = birthyears.selectAll(".birthyear")
        .data(d3.range(year0 - age1, year1 + 1, 5))
      .enter().append("g")
        .attr("class", "birthyear")
        .attr("transform", function(birthyear) { return "translate(" + x(birthyear) + ",0)"; });

    birthyear.selectAll("rect")
        .data(function(birthyear) { return data[year][birthyear] || [0, 0]; })
      .enter().append("rect")
        .attr("x", -barWidth / 2)
        .attr("width", barWidth)
        .attr("y", y)
        .attr("height", function(value) { return height - y(value); });

    // Add labels to show birthyear.
    birthyear.append("text")
        .attr("y", height - 4)
        .text(function(birthyear) { return birthyear; });

    // Add labels to show age (separate; not animated).
    svg.selectAll(".age")
        .data(d3.range(0, age1 + 1, 5))
      .enter().append("text")
        .attr("class", "age")
        .attr("x", function(age) { return x(year - age); })
        .attr("y", height + 4)
        .attr("dy", ".71em")
        .text(function(age) { return age; });

    // Allow the arrow keys to change the displayed year.
    window.focus();
    d3.select(window).on("keydown", function() {
      switch (d3.event.keyCode) {
        case 37: year = Math.max(year0, year - 10); break;
        case 39: year = Math.min(year1, year + 10); break;
      }
      update();
    });

    function update() {
      if (!(year in data)) return;
      title.text(year);

      birthyears.transition()
          .duration(750)
          .attr("transform", "translate(" + (x(year1) - x(year)) + ",0)");

      birthyear.selectAll("rect")
          .data(function(birthyear) { return data[year][birthyear] || [0, 0]; })
        .transition()
          .duration(750)
          .attr("y", y)
          .attr("height", function(value) { return height - y(value); });
    }
  });`

export const mainCSSContent = `body {
  font-family: 'Muli', sans-serif;
  padding: 20px;
}

h2 {
  margin-left: 30px;
}

#d3Example p {
  padding: 30px;
  font-size: 18px;
  text-align: justify;
}

a {
  margin-left: 30px;
}

svg {
  width: 100%;
  height: 500px;
  font: 10px sans-serif;
}

.y.axis path {
  display: none;
}

.y.axis line {
  stroke: #fff;
  stroke-opacity: .2;
  shape-rendering: crispEdges;
}

.y.axis .zero line {
  stroke: #000;
  stroke-opacity: 1;
}

.title {
  font: 300 78px Helvetica Neue;
  fill: #666;
}

.birthyear,
.age {
  text-anchor: middle;
}

.birthyear {
  fill: #fff;
}

rect {
  fill-opacity: .6;
  fill: #e377c2;
}

rect:first-child {
  fill: #1f77b4;
}

#googleMapContainer {
  width: 100%;
  height: 500px;
}
`
export const d3Data = `year,age,sex,people
1850,0,1,1483789
1850,0,2,1450376
1850,5,1,1411067
1850,5,2,1359668
1850,10,1,1260099
1850,10,2,1216114
1850,15,1,1077133
1850,15,2,1110619
1850,20,1,1017281
1850,20,2,1003841
1850,25,1,862547
1850,25,2,799482
1850,30,1,730638
1850,30,2,639636
1850,35,1,588487
1850,35,2,505012
1850,40,1,475911
1850,40,2,428185
1850,45,1,384211
1850,45,2,341254
1850,50,1,321343
1850,50,2,286580
1850,55,1,194080
1850,55,2,187208
1850,60,1,174976
1850,60,2,162236
1850,65,1,106827
1850,65,2,105534
1850,70,1,73677
1850,70,2,71762
1850,75,1,40834
1850,75,2,40229
1850,80,1,23449
1850,80,2,22949
1850,85,1,8186
1850,85,2,10511
1850,90,1,5259
1850,90,2,6569
1860,0,1,2120846
1860,0,2,2092162
1860,5,1,1804467
1860,5,2,1778772
1860,10,1,1612640
1860,10,2,1540350
1860,15,1,1438094
1860,15,2,1495999
1860,20,1,1351121
1860,20,2,1370462
1860,25,1,1217615
1860,25,2,1116373
1860,30,1,1043174
1860,30,2,936055
1860,35,1,866910
1860,35,2,737136
1860,40,1,699434
1860,40,2,616826
1860,45,1,552404
1860,45,2,461739
1860,50,1,456176
1860,50,2,407305
1860,55,1,292417
1860,55,2,267224
1860,60,1,260887
1860,60,2,249735
1860,65,1,149331
1860,65,2,141405
1860,70,1,98465
1860,70,2,101778
1860,75,1,56699
1860,75,2,57597
1860,80,1,29007
1860,80,2,29506
1860,85,1,10434
1860,85,2,14053
1860,90,1,7232
1860,90,2,6622
1870,0,1,2800083
1870,0,2,2717102
1870,5,1,2428469
1870,5,2,2393680
1870,10,1,2427341
1870,10,2,2342670
1870,15,1,1958390
1870,15,2,2077248
1870,20,1,1805303
1870,20,2,1909382
1870,25,1,1509059
1870,25,2,1574285
1870,30,1,1251534
1870,30,2,1275629
1870,35,1,1185336
1870,35,2,1137490
1870,40,1,968861
1870,40,2,944401
1870,45,1,852672
1870,45,2,747916
1870,50,1,736387
1870,50,2,637801
1870,55,1,486036
1870,55,2,407819
1870,60,1,399264
1870,60,2,374801
1870,65,1,260829
1870,65,2,239080
1870,70,1,173364
1870,70,2,165501
1870,75,1,86929
1870,75,2,89540
1870,80,1,47427
1870,80,2,54190
1870,85,1,15891
1870,85,2,19302
1870,90,1,8649
1870,90,2,13068
1880,0,1,3533662
1880,0,2,3421597
1880,5,1,3297503
1880,5,2,3179142
1880,10,1,2911924
1880,10,2,2813550
1880,15,1,2457734
1880,15,2,2527818
1880,20,1,2547780
1880,20,2,2512803
1880,25,1,2119393
1880,25,2,1974241
1880,30,1,1749107
1880,30,2,1596772
1880,35,1,1540772
1880,35,2,1483717
1880,40,1,1237347
1880,40,2,1239435
1880,45,1,1065973
1880,45,2,1003711
1880,50,1,964484
1880,50,2,863012
1880,55,1,679147
1880,55,2,594843
1880,60,1,580298
1880,60,2,526956
1880,65,1,369398
1880,65,2,346303
1880,70,1,255422
1880,70,2,251860
1880,75,1,141628
1880,75,2,143513
1880,80,1,67526
1880,80,2,77290
1880,85,1,22437
1880,85,2,31227
1880,90,1,10272
1880,90,2,15451
1900,0,1,4619544
1900,0,2,4589196
1900,5,1,4465783
1900,5,2,4390483
1900,10,1,4057669
1900,10,2,4001749
1900,15,1,3774846
1900,15,2,3801743
1900,20,1,3694038
1900,20,2,3751061
1900,25,1,3389280
1900,25,2,3236056
1900,30,1,2918964
1900,30,2,2665174
1900,35,1,2633883
1900,35,2,2347737
1900,40,1,2261070
1900,40,2,2004987
1900,45,1,1868413
1900,45,2,1648025
1900,50,1,1571038
1900,50,2,1411981
1900,55,1,1161908
1900,55,2,1064632
1900,60,1,916571
1900,60,2,887508
1900,65,1,672663
1900,65,2,640212
1900,70,1,454747
1900,70,2,440007
1900,75,1,268211
1900,75,2,265879
1900,80,1,127435
1900,80,2,132449
1900,85,1,44008
1900,85,2,48614
1900,90,1,15164
1900,90,2,20093
1910,0,1,5296823
1910,0,2,5287477
1910,5,1,4991803
1910,5,2,4866139
1910,10,1,4650747
1910,10,2,4471887
1910,15,1,4566154
1910,15,2,4592269
1910,20,1,4637632
1910,20,2,4447683
1910,25,1,4257755
1910,25,2,3946153
1910,30,1,3658125
1910,30,2,3295220
1910,35,1,3427518
1910,35,2,3088990
1910,40,1,2860229
1910,40,2,2471267
1910,45,1,2363801
1910,45,2,2114930
1910,50,1,2126516
1910,50,2,1773592
1910,55,1,1508358
1910,55,2,1317651
1910,60,1,1189421
1910,60,2,1090697
1910,65,1,850159
1910,65,2,813868
1910,70,1,557936
1910,70,2,547623
1910,75,1,322679
1910,75,2,350900
1910,80,1,161715
1910,80,2,174315
1910,85,1,59699
1910,85,2,62725
1910,90,1,23929
1910,90,2,28965
1920,0,1,5934792
1920,0,2,5694244
1920,5,1,5789008
1920,5,2,5693960
1920,10,1,5401156
1920,10,2,5293057
1920,15,1,4724365
1920,15,2,4779936
1920,20,1,4549411
1920,20,2,4742632
1920,25,1,4565066
1920,25,2,4529382
1920,30,1,4110771
1920,30,2,3982426
1920,35,1,4081543
1920,35,2,3713810
1920,40,1,3321923
1920,40,2,3059757
1920,45,1,3143891
1920,45,2,2669089
1920,50,1,2546035
1920,50,2,2200491
1920,55,1,1880975
1920,55,2,1674672
1920,60,1,1587549
1920,60,2,1382877
1920,65,1,1095956
1920,65,2,989901
1920,70,1,714618
1920,70,2,690097
1920,75,1,417292
1920,75,2,439465
1920,80,1,187000
1920,80,2,211110
1920,85,1,75991
1920,85,2,92829
1920,90,1,22398
1920,90,2,32085
1930,0,1,5875250
1930,0,2,5662530
1930,5,1,6542592
1930,5,2,6129561
1930,10,1,6064820
1930,10,2,5986529
1930,15,1,5709452
1930,15,2,5769587
1930,20,1,5305992
1930,20,2,5565382
1930,25,1,4929853
1930,25,2,5050229
1930,30,1,4424408
1930,30,2,4455213
1930,35,1,4576531
1930,35,2,4593776
1930,40,1,4075139
1930,40,2,3754022
1930,45,1,3633152
1930,45,2,3396558
1930,50,1,3128108
1930,50,2,2809191
1930,55,1,2434077
1930,55,2,2298614
1930,60,1,1927564
1930,60,2,1783515
1930,65,1,1397275
1930,65,2,1307312
1930,70,1,919045
1930,70,2,918509
1930,75,1,536375
1930,75,2,522716
1930,80,1,246708
1930,80,2,283579
1930,85,1,88978
1930,85,2,109210
1930,90,1,30338
1930,90,2,43483
1940,0,1,5294628
1940,0,2,5124653
1940,5,1,5468378
1940,5,2,5359099
1940,10,1,5960416
1940,10,2,5868532
1940,15,1,6165109
1940,15,2,6193701
1940,20,1,5682414
1940,20,2,5896002
1940,25,1,5438166
1940,25,2,5664244
1940,30,1,5040048
1940,30,2,5171522
1940,35,1,4724804
1940,35,2,4791809
1940,40,1,4437392
1940,40,2,4394061
1940,45,1,4190187
1940,45,2,4050290
1940,50,1,3785735
1940,50,2,3488396
1940,55,1,2972069
1940,55,2,2810000
1940,60,1,2370232
1940,60,2,2317790
1940,65,1,1897678
1940,65,2,1911117
1940,70,1,1280023
1940,70,2,1287711
1940,75,1,713875
1940,75,2,764915
1940,80,1,359418
1940,80,2,414761
1940,85,1,127303
1940,85,2,152131
1940,90,1,42263
1940,90,2,58119
1950,0,1,8211806
1950,0,2,7862267
1950,5,1,6706601
1950,5,2,6450863
1950,10,1,5629744
1950,10,2,5430835
1950,15,1,5264129
1950,15,2,5288742
1950,20,1,5573308
1950,20,2,5854227
1950,25,1,6007254
1950,25,2,6317332
1950,30,1,5676022
1950,30,2,5895178
1950,35,1,5511364
1950,35,2,5696261
1950,40,1,5076985
1950,40,2,5199224
1950,45,1,4533177
1950,45,2,4595842
1950,50,1,4199164
1950,50,2,4147295
1950,55,1,3667351
1950,55,2,3595158
1950,60,1,3035038
1950,60,2,3009768
1950,65,1,2421234
1950,65,2,2548250
1950,70,1,1627920
1950,70,2,1786831
1950,75,1,1006530
1950,75,2,1148469
1950,80,1,511727
1950,80,2,637717
1950,85,1,182821
1950,85,2,242798
1950,90,1,54836
1950,90,2,90766
1960,0,1,10374975
1960,0,2,10146999
1960,5,1,9495503
1960,5,2,9250741
1960,10,1,8563700
1960,10,2,8310764
1960,15,1,6620902
1960,15,2,6617493
1960,20,1,5268384
1960,20,2,5513495
1960,25,1,5311805
1960,25,2,5548259
1960,30,1,5801342
1960,30,2,6090862
1960,35,1,6063063
1960,35,2,6431337
1960,40,1,5657943
1960,40,2,5940520
1960,45,1,5345658
1960,45,2,5516028
1960,50,1,4763364
1960,50,2,4928844
1960,55,1,4170581
1960,55,2,4402878
1960,60,1,3405293
1960,60,2,3723839
1960,65,1,2859371
1960,65,2,3268699
1960,70,1,2115763
1960,70,2,2516479
1960,75,1,1308913
1960,75,2,1641371
1960,80,1,619923
1960,80,2,856952
1960,85,1,253245
1960,85,2,384572
1960,90,1,75908
1960,90,2,135774
1970,0,1,8685121
1970,0,2,8326887
1970,5,1,10411131
1970,5,2,10003293
1970,10,1,10756403
1970,10,2,10343538
1970,15,1,9605399
1970,15,2,9414284
1970,20,1,7729202
1970,20,2,8341830
1970,25,1,6539301
1970,25,2,6903041
1970,30,1,5519879
1970,30,2,5851441
1970,35,1,5396732
1970,35,2,5708021
1970,40,1,5718538
1970,40,2,6129319
1970,45,1,5794120
1970,45,2,6198742
1970,50,1,5298312
1970,50,2,5783817
1970,55,1,4762911
1970,55,2,5222164
1970,60,1,4037643
1970,60,2,4577251
1970,65,1,3142606
1970,65,2,3894827
1970,70,1,2340826
1970,70,2,3138009
1970,75,1,1599269
1970,75,2,2293376
1970,80,1,886155
1970,80,2,1417553
1970,85,1,371123
1970,85,2,658511
1970,90,1,186502
1970,90,2,314929
1980,0,1,8439366
1980,0,2,8081854
1980,5,1,8680730
1980,5,2,8275881
1980,10,1,9452338
1980,10,2,9048483
1980,15,1,10698856
1980,15,2,10410271
1980,20,1,10486776
1980,20,2,10614947
1980,25,1,9624053
1980,25,2,9827903
1980,30,1,8705835
1980,30,2,8955225
1980,35,1,6852069
1980,35,2,7134239
1980,40,1,5692148
1980,40,2,5953910
1980,45,1,5342469
1980,45,2,5697543
1980,50,1,5603709
1980,50,2,6110117
1980,55,1,5485098
1980,55,2,6160229
1980,60,1,4696140
1980,60,2,5456885
1980,65,1,3893510
1980,65,2,4896947
1980,70,1,2857774
1980,70,2,3963441
1980,75,1,1840438
1980,75,2,2951759
1980,80,1,1012886
1980,80,2,1919292
1980,85,1,472338
1980,85,2,1023115
1980,90,1,204148
1980,90,2,499046
1990,0,1,9307465
1990,0,2,8894007
1990,5,1,9274732
1990,5,2,8799955
1990,10,1,8782542
1990,10,2,8337284
1990,15,1,9020572
1990,15,2,8590991
1990,20,1,9436188
1990,20,2,9152644
1990,25,1,10658027
1990,25,2,10587292
1990,30,1,11028712
1990,30,2,11105750
1990,35,1,9853933
1990,35,2,10038644
1990,40,1,8712632
1990,40,2,8928252
1990,45,1,6848082
1990,45,2,7115129
1990,50,1,5553992
1990,50,2,5899925
1990,55,1,4981670
1990,55,2,5460506
1990,60,1,4953822
1990,60,2,5663205
1990,65,1,4538398
1990,65,2,5594108
1990,70,1,3429420
1990,70,2,4610222
1990,75,1,2344932
1990,75,2,3723980
1990,80,1,1342996
1990,80,2,2545730
1990,85,1,588790
1990,85,2,1419494
1990,90,1,238459
1990,90,2,745146
2000,0,1,9735380
2000,0,2,9310714
2000,5,1,10552146
2000,5,2,10069564
2000,10,1,10563233
2000,10,2,10022524
2000,15,1,10237419
2000,15,2,9692669
2000,20,1,9731315
2000,20,2,9324244
2000,25,1,9659493
2000,25,2,9518507
2000,30,1,10205879
2000,30,2,10119296
2000,35,1,11475182
2000,35,2,11635647
2000,40,1,11320252
2000,40,2,11488578
2000,45,1,9925006
2000,45,2,10261253
2000,50,1,8507934
2000,50,2,8911133
2000,55,1,6459082
2000,55,2,6921268
2000,60,1,5123399
2000,60,2,5668961
2000,65,1,4453623
2000,65,2,4804784
2000,70,1,3792145
2000,70,2,5184855
2000,75,1,2912655
2000,75,2,4355644
2000,80,1,1902638
2000,80,2,3221898
2000,85,1,970357
2000,85,2,1981156
2000,90,1,336303
2000,90,2,1064581`

export const files = [
  {
    name: 'index.html',
    path: '',
    blob: new Blob([indexContent], {type: 'text/html'})
  },
  {
    name: 'main.js',
    path: 'js/',
    blob: new Blob([mainJSContent], {type: 'text/javascript'})
  },
  {
    name: 'map.js',
    path: 'js/',
    blob: new Blob([mapJSContent], {type: 'text/javascript'})
  },
  {
    name: 'visualization.js',
    path: 'js/',
    blob: new Blob([visualizationJSContent], {type: 'text/javascript'})
  },
  {
    name: 'main.css',
    path: 'css/',
    blob: new Blob([mainCSSContent], {type: 'text/css'})
  },
  {
    name: 'population.csv',
    path: 'data/',
    blob: new Blob([d3Data], {type: 'text/csv'})
  },
]