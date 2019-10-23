//table.json
//chart.json

var body_count = [];
var imdb_rating = [];
var mpaa_rating = [];
var mpaa_av_count = [];
var mpaa = ["G", "GP", "PG", "PG-13", "R", "M", "NC-17", "Unrated"];
var g_total = 0;
var g_bcount = 0;
var gp_total = 0;
var gp_bcount = 0;
var pg_total = 0;
var pg_bcount = 0;
var pg13_total = 0;
var pg13_bcount = 0;
var r_total = 0;
var r_bcount = 0;
var m_total = 0;
var m_bcount = 0;
var nc17_total = 0;
var nc17_bcount = 0;
var u_total = 0;
var u_bcount = 0;
var sortedimdbtitles = [];
var topten = [];
var topten_title = [];
var topten_count = [];


//document loads functions
$(document).ready(function(){
  buildTable();
  loadData();
});

//loads json parseData
function loadData() {
  //ajax request
  //onSuccess parseData(data);

  $.ajax({
    method: "GET",
    url: "data.json",
    dataType: "text",
    success: parseData
  });
//
}

function parseData(data) {

  dataObj = $.parseJSON(data);
  for (var i = 0, len = dataObj.length; i < len; ++i) {
      body_count.push(dataObj[i]["Body_Count"]);
      imdb_rating.push(dataObj[i]["IMDB_Rating"]);
      mpaa_rating.push(dataObj[i]["MPAA_Rating"]);

      // finds average of all ratings
      if (dataObj[i]["MPAA_Rating"] == "G") {
          g_total++;
          g_bcount += dataObj[i]["Body_Count"];
          mpaa_av_count[0] = Math.round(g_bcount / g_total);
      } else if (dataObj[i]["MPAA_Rating"] == "GP") {
          gp_total++;
          gp_bcount += dataObj[i]["Body_Count"];
          mpaa_av_count[1] = Math.round(gp_bcount / gp_total);
      } else if (dataObj[i]["MPAA_Rating"] == "PG") {
          pg_total++;
          pg_bcount += dataObj[i]["Body_Count"];
          mpaa_av_count[2] = Math.round(pg_bcount / pg_total);
      } else if (dataObj[i]["MPAA_Rating"] == "PG-13") {
          pg13_total++;
          pg13_bcount += dataObj[i]["Body_Count"];
          mpaa_av_count[3] = Math.round(pg13_bcount / pg13_total);
      } else if (dataObj[i]["MPAA_Rating"] == "R") {
          r_total++;
          r_bcount += dataObj[i]["Body_Count"];
          mpaa_av_count[4] = Math.round(r_bcount / r_total);
      } else if (dataObj[i]["MPAA_Rating"] == "M") {
          m_total++;
          m_bcount += dataObj[i]["Body_Count"];
          mpaa_av_count[5] = Math.round(m_bcount / m_total);
      } else if (dataObj[i]["MPAA_Rating"] == "NC-17") {
          nc17_total++;
          nc17_bcount += dataObj[i]["Body_Count"];
          mpaa_av_count[6] = Math.round(nc17_bcount / nc17_total);
      } else if (dataObj[i]["MPAA_Rating"] == "Unrated") {
          u_total++;
          u_bcount += dataObj[i]["Body_Count"];
          mpaa_av_count[7] = Math.round(u_bcount / u_total);
      }


      sortedimdbtitles.push(dataObj[i]);


  }

  // orders imdb ratings high to low
  function compare(a,b) {
    if (a.IMDB_Rating < b.IMDB_Rating)
       return -1;
    if (a.IMDB_Rating > b.IMDB_Rating)
      return 1;
    return 0;
}

  //finds top 10 highest imdb ratings
  sortedimdbtitles.sort(compare);
  sortedimdbtitles.reverse();
  topten = sortedimdbtitles.slice(0,10);

  // finds titles and body count of top 10 highest imdb ratings
  for (var i = 0, len = topten.length; i < len; ++i) {
    topten_title.push(i+1 + "." + " " + topten[i]["Film"]);
    topten_count.push(topten[i]["Body_Count"]);
  }

  buildCharts();
}



function buildCharts() {

  //creates chart comparing average body count to mpaa rating
  $('#mpaarating-chart').highcharts({
      chart: {
          type: 'bar',
          zoomType: 'xy'
      },
      title: {
          text: 'Average Dead Body Count per MPAA Rating'
      },
      xAxis: {
          title: {
             enabled: true,
             text: 'MPAA Rating'
         },
         startOnTick: true,
         endOnTick: false,
         showLastLabel: true,
         categories: mpaa
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Average Body Count'
          },

      },
      tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f} bodies</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
      },
      plotOptions: {
        scatter: {
            marker: {
                radius: 5,
                states: {
                    hover: {
                        enabled: true,
                        lineColor: 'rgb(100,100,100)'
                    }
                }
              }
            },
          column: {
              pointPadding: 0.2,
              borderWidth: 0
          },

      },
      series: [{
          data: mpaa_av_count,
          showInLegend: false,
          color: '#4c4e4d',
          border: 'black'
      }]

  });

  //creates chart to compare ratio of dead bodies to imdb ratings
  $('#rating-chart').highcharts({
      chart: {
          type: 'scatter',
          zoomType: 'xy'
      },
      title: {
          text: 'Ratio of Dead Bodies to IMDb Rating'
      },
      xAxis: {
          title: {
             enabled: true,
             text: 'IMDb Rating'
         },
         startOnTick: true,
         endOnTick: false,
         showLastLabel: true,
         categories: imdb_rating,
         tickInterval: 5
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Body Count'
          },

      },
      tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f} bodies</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
      },
      plotOptions: {
        scatter: {
            marker: {
                radius: 5,
                states: {
                    hover: {
                        enabled: true,
                        lineColor: 'rgb(100,100,100)'
                    }
                }
              }
            },
          column: {
              pointPadding: 0.2,
              borderWidth: 0
          },

      },
      series: [{
          data: body_count,
          showInLegend: false,
          color: '#4c4e4d',
          border: 'black'
      }]

  });

  //creates chart of body count for top 10 imdb ratings
  $('#topten-chart').highcharts({
      chart: {
          type: 'column',
          zoomType: 'xy',
          height: (12 / 16 * 100) + '%' // 16:9 ratio

      },
      title: {
          text: 'Top Ten Movies Dead Body Count'
      },
      xAxis: {
          title: {
             enabled: true,
             text: 'Top Ten Movies (According to IMDb Rating)'
         },
         startOnTick: true,
         endOnTick: false,
         showLastLabel: true,
         categories: topten_title
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Body Count'
          },
          max: 900

      },
      tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f} bodies</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
      },
      plotOptions: {
        scatter: {
            marker: {
                radius: 5,
                states: {
                    hover: {
                        enabled: true,
                        lineColor: 'rgb(100,100,100)'
                    }
                }
              }
            },
          column: {
              pointPadding: 0.2,
              borderWidth: 0
          },

      },
      series: [{
          data: topten_count,
          showInLegend: false,
          color: '#4c4e4d',
          border: 'black'
      }]

  });


}

// creates table of json data using datatables
 function buildTable() {
 $('#example').DataTable( {
       ajax: {
         url: 'table.json',
         dataSrc: ''
       },
       columns: [
         {data: 'Film'},
         {data: 'Year'},
         {data: 'Body_Count'},
         {data: 'MPAA_Rating'},
         {data: 'Genre'},
         {data: 'Director'},
         {data: 'Length_Minutes'},
         {data: 'IMDB_Rating'}
       ],
       rowReorder: {
            selector: 'td:nth-child(2)'
        },
        responsive: true
   } );
}
