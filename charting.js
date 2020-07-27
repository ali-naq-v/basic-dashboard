
export default function CovidChart(htmlTagId, x_labels, y_data, chart_title) {

    const list_of_months = {}
  let filtered_x_data = x_labels.map((x) => {
    let _ = new Date(x + "T00:00:00.000-05:00");
    
    let month_prefix = _.getUTCMonth() < 9 ? '0' : '';
    let _month =   month_prefix + (_.getUTCMonth()+1);
    
    let _year =  _.getFullYear();
    let _key = _year + "-" + _month;
    
    if (list_of_months[_key]){
        return ""
    }
    list_of_months[_key] = true;
    return _key
        
  });


// console.log(filtered_x_data);
    
    var ctx = document.getElementById(htmlTagId).getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: filtered_x_data,
            datasets: [{
                label: chart_title,
                data: y_data,
                backgroundColor: '#778DA9',
                borderColor: '#778DA9',
                pointRadius: 1,
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            tooltips: {
                mode: 'index',
                titleFontFamily: 'Roboto',
                bodyFontFamily: 'Roboto',
                intersect: true,
            },
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: '#D85D4C',
                    fontFamily: 'Roboto'
                }
            },
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        display: true,
                        fontFamily: 'Roboto',
                    },
                    gridLines:false,
                    color: "#FFFFFF"
                    
                    
                }]
                ,xAxes: [{
                    ticks: {
                        autoSkip: false,
                        fontColor: "#FFFFFF",
                        minRotation: 0,
                        maxRotation: 0,
                        fontFamily: 'Roboto',
                      },
                      
                      
                }]
                
                
            }
        }
    });
}


function filterXLabels(data) {
    console.log(data[0]);
    return data[0];
}