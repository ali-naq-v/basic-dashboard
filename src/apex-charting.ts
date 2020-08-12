import {roundThis} from './utils'
import ApexCharts = require('apexcharts');
import { removeMonthsTooCloseToEachOther, getFirstOfTheMonthEntriesWhileNullingOutOtherDates } from './chart-utils'

export default function ChartWithApex(htmlTagId: string, x_labels: Array<any>, y_data: Array<any>, chart_title: string, chart_unit?: string): void {

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
                fontSize: '30px',

                fontFamily: 'Roboto',
                color: '#778DA9'
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
                    fontSize:  '10px',
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
                formatter: (value : any) => { return roundThis(value, 1) }
            }
        },
        tooltip: {
            enabled: true,
            x: {
                formatter: function (value: any) {
                    return x_labels[value - 1]
                }
            },
        },
        markers: {
            size: 0.1,
            colors: undefined,
            strokeColors: '#fff',
            strokeWidth: 2,
            strokeOpacity: 0.9,
            strokeDashArray: 0,
            fillOpacity: 1,
            discrete: [{
                seriesIndex: 0,
                dataPointIndex: y_data.length - 1,
                fillColor: '#e3e3e3',
                strokeColor: '#fff',
                size: 3
              }],
            shape: "circle",
            radius: 2
        }
        


    };
    const thisTag : HTMLDivElement = document.querySelector(htmlTagId)
    const figure : HTMLElement =  thisTag.getElementsByTagName("figure")[0];
    const figureBackground : HTMLElement =  thisTag.getElementsByTagName("figcaption")[0];
    const lastItemOfY : number =  <number>(y_data[y_data.length-1]);
    const suffixContent : string | null = chart_unit ? chart_unit : "";
    const content  = document.createTextNode(String(roundThis(lastItemOfY, 1)) + suffixContent);
    figureBackground.appendChild(content);

    const chart: ApexCharts = new ApexCharts(figure, options);

    chart.render();
}