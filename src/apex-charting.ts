import ApexCharts = require('apexcharts');
import { removeMonthsTooCloseToEachOther, getFirstOfTheMonthEntriesWhileNullingOutOtherDates } from './chart-utils'

export default function ChartWithApex(htmlTagId: string, x_labels: Array<any>, y_data: Array<any>, chart_title: string): void {

    let mod_x_labels = getFirstOfTheMonthEntriesWhileNullingOutOtherDates(x_labels);
    mod_x_labels = removeMonthsTooCloseToEachOther(25, mod_x_labels);
    const axes_colour: string = "#FEFEFE";
    console.log("in Apex " + htmlTagId);
    const options: object = {
        chart: {
            type: 'line',
            toolbar: {
                show: false,
            }
        },
        grid: {
            show: false,
        },
        stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            // colors: undefined,
            width: 2,
            dashArray: 0,
        }
        ,
        title: {
            text: chart_title,
            align: 'left',
            margin: 10,
            offsetX: 0,
            offsetY: 0,
            floating: false,
            style: {
                fontSize: '14px',

                fontFamily: 'Roboto',
                color: '#D85D4C'
            },
        },
        colors: ['#778DA9'],
        series: [{
            name: chart_title,
            data: y_data
        }],
        xaxis: {
            categories: mod_x_labels,
            labels: {
                style: {
                    colors: axes_colour,
                    fontFamily: 'Roboto',

                },
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: axes_colour,
                    fontFamily: 'Roboto'
                },
                formatter: (value : any) => { return value }
            }
        },
        tooltip: {
            enabled: true,
            x: {
                formatter: function (value: any) {
                    return x_labels[value - 1]
                }
            },
        }


    };
    const thisTag = document.querySelector(htmlTagId)

    const chart: ApexCharts = new ApexCharts(thisTag, options);

    chart.render();
}