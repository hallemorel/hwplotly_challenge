function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  d3.json(`/metadata/${sample}`).then((data) => {
// Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
// Use `.html("") to clear any existing metadata
    PANEL.html("");
// Use `Object.entries` to add each key and value pair to the panel
// Hint: Inside the loop, you will need to use d3 to append new
// tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key}: ${value}`);
      console.log(key, value);
    });
  });
}

function buildCharts(sample) {
// @TODO: Use `d3.json` to fetch the sample data for the plots  
  d3.json(`/samples/${sample}`).then((data) => {
    var ids = data.otu_ids;
    var labels = data.otu_labels;
    var values = data.sample_values;
    console.log(ids,labels, values);
// @TODO: Build a Bubble Chart using the sample data
    var bubbleLayout = {
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "ID"}
    };
    var bubbleData = [
      {
        x:ids,
        y:values,
        text:labels,
        } 
      ];

    Plotly.plot("bubble", bubbleData, bubbleLayout);
// @TODO: Build a Pie Chart
// HINT: You will need to use slice() to grab the top 10 sample_values,
// otu_ids, and labels (10 each).
    var pieData = [
      {
        values: values.slice(0, 40),
        labels: ids.slice(0, 100),
        hovertext: labels.slice(0,10),
        hoverinfo: "hovertext",
        type: "pie"
      }
    ];
    var pieLayout = {
      margin: { t: 0, l: 0 }
    };

    Plotly.plot("pie", pieData, pieLayout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const Sample1 = sampleNames[0];
    buildCharts(Sample1);
    buildMetadata(Sample1);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
