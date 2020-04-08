import React from 'react';
import '../App.css';
import CanvasJSReact from '../canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var Chart = ({data}) => {
    const options = {
        title: {
        },
        axisX: {
            interval: 8,
            labelAngle: 0,
            interlacedColor: 'rgba(0,0,0, 0.1)',
        },
        axisY: {
            titleAngle: 90,
            gridColor: 'rgba(0,0,0, 0.1)'
        },
        
        data: [{				
            type: "line",
            dataPoints: data.graphData,
            color: "#2962ff",
            xValueType: "dateTime",
            lineThickness: 1
        }],
        zoomEnabled: true,
        animationEnabled: true
      }  
    return (
        <div className="chart">  
            <div className="chart-data">
                <h2>{data.name}</h2>
                <p>Real-time price in USD from the Alpha Vantage API</p>
                <h3>Current Stock Price: {data.graphData[data.graphData.length - 1].y+""}</h3>
                <p>Zoom in by dragging a box over where you'd like to zoom in</p>
            </div>    
            
            <CanvasJSChart options = {options}/>
        </div>
    );
}

export default Chart;
