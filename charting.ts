
//import Chart = require( "https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js" );
declare const Chart: any;

export default function CovidChart(htmlTagId : string,
     x_labels : Array<any>,
      y_data : Array<any>,
    chart_title : string
       ) : void {

    let filtered_x_data : Array<string | null> = getFirstOfTheMonthEntriesWhileNullingOutOtherDates(x_labels)
    filtered_x_data = removeMonthsTooCloseToEachOther(25, filtered_x_data);

    const ctx : CanvasRenderingContext2D = (<HTMLCanvasElement>document.getElementById(htmlTagId)).getContext('2d');
    const myChart : any = new Chart(ctx, {
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
                callbacks: {
                    title: function(tooltipItem : any) : string {
                        return "Date: " + x_labels[tooltipItem[0].index];
                        // console.log(tooltipItem);
                        // console.log();
                    //   return data['labels'][tooltipItem[0]['index']];
                        
                    }}
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
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                    },
                    color: "#FFFFFF"


                }]
                , xAxes: [{
                    ticks: {
                        autoSkip: false,
                        fontColor: "#FFFFFF",
                        minRotation: 0,
                        maxRotation: 0,
                        fontFamily: 'Roboto',
                    },
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                    }


                }]


            }
        }
    });
}

function getFirstOfTheMonthEntriesWhileNullingOutOtherDates(datesList: Array<string>) : Array<string> {
    const list_of_months : any = {}
    let filtered_x_data = datesList.map((x) => {
        let _ : Date = new Date(x + "T00:00:00.000-05:00");

        let month_prefix : string = _.getUTCMonth() < 9 ? '0' : '';
        let _month : string = month_prefix + (_.getUTCMonth() + 1);

        let _year : number = _.getFullYear();
        let _key : string = _year + "-" + _month;

        if (list_of_months[_key]) {
            return ""
        }
        list_of_months[_key] = true;
        return _key

    });
    return filtered_x_data
}



function removeMonthsTooCloseToEachOther(minMonthsGap : number, monthsArray : Array<string>) {
    let currentGapCount : number | null = null;
    let lastMatchLocation : number | null = null
    for (let i = 0; i < monthsArray.length  ; i++) {

        if (monthsArray[i]) {
            if (i===0){
                lastMatchLocation = 0;
                currentGapCount = 0;
                continue;
            }

            if (currentGapCount < minMonthsGap){
                monthsArray[lastMatchLocation] = "";
            }

            lastMatchLocation = i;
            currentGapCount = 0;




        }
        else {
            currentGapCount +=1
        }
      }
      return monthsArray
}


