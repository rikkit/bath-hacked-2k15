import _ from 'lodash';
import {forData} from 'modules/api';

/**
 * Add interactivity to Dyson office location map
 */
class Locations {
    constructor (config) {
        this.config = config;
    }

    render() {
        forData('/resource/e46f-mhfs.json')
        .then((crimes) => {

            var condensedCrimes = [];

            _.forEach(crimes, (crime) => {
                condensedCrimes.push({category: crime.crime_category, month:  crime.month});
            });

            var chart = AmCharts.makeChart("chartdiv", {
                "type": "serial",
                "theme": "light",
                "dataProvider": [{crime: '500', date: '01/01/2014'}],
                parseDates: true,
                "valueAxes": [{
                    "gridColor": "#FFFFFF",
                    "gridAlpha": 0.2,
                    "dashLength": 0
                }],
                "gridAboveGraphs": true,
                "startDuration": 1,
                "graphs": [{
                    "balloonText": "[[category]]: <b>[[value]]</b>",
                    "fillAlphas": 0.8,
                    "lineAlpha": 0.2,
                    "type": "column",
                    "valueField": "visits"
                }],
                "chartCursor": {
                    "categoryBalloonEnabled": false,
                    "cursorAlpha": 0,
                    "zoomable": false
                },
                "categoryField": "country",
                "categoryAxis": {
                    "gridPosition": "start",
                    "gridAlpha": 0,
                    "tickPosition": "start",
                    "tickLength": 20
                },
                "export": {
                    "enabled": true
                }

            });

        })
    }
}

export default Locations;
