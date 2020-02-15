function renderGraph(_xaxis, _yaxis) {
    var trace2 = {
        name: "5-day forecast",
        x: _xaxis,
        y: _yaxis,
        text: addDegSign(_yaxis),
        textposition: " ",
        mode: "lines+text+markers",
        type: "scatter",
        line: { shape: "spline", color: "#9c27b0" }
    }

    var data = [trace2]

    var layout = {
        title: {
            text: "5-day forecast",
            font: {
                family: "Courier New, monospace",
                size: 24
            },
            xref: "paper",
            x: 0.05
        },
        xaxis: { showgrid: false },
        yaxis: { showgrid: false, showticklabels: false },
        margin: { t: 30, b: 15, l: 25, r: 25, pad: 0 },
        font: {
            family: "Courier New, monospace",
            size: 14,
            color: "#ffffff"
        },
        plot_bgcolor: "#303030",
        paper_bgcolor: "#303030",
        autosize: true
    }

    Plotly.newPlot("tester", data, layout, {
        displayModeBar: false,
        responsive: true,
        showSendToCloud: true,
        images: [
            {
                source:
                    "https://images.plot.ly/language-icons/api-home/js-logo.png",
                xref: "x",
                yref: "y",
                x: 1.5,
                y: 2,
                sizex: 1,
                sizey: 1,
                xanchor: "right",
                yanchor: "bottom"
            }
        ]
    })
}

function addDegSign(_yaxis) {
    let arr = []
    _yaxis.forEach(num => {
        arr.push(`${num}&#176;`)
    })
    return arr
}
