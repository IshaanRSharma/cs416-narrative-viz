let currentScene = 0;
const scenes = [renderScene1, renderScene2, renderScene3];  
const ageBins = ["0-20", "20-40", "40-60", "60-80", "80-100"];


window.onload = renderScene;
document.getElementById('previous').style.display = 'none';

document.getElementById('next').addEventListener('click', function() {
    if (currentScene === scenes.length - 1) {
        document.getElementById('next').style.display = 'none';
        document.getElementById('start-over').style.display = 'inline-block'; 
    } else {
        currentScene = (currentScene + 1) % scenes.length;
        renderScene();

        if (currentScene === 1) {
            document.getElementById('previous').style.display = 'inline-block'; 
        }
    }
});

document.getElementById('previous').addEventListener('click', function() {
    if (currentScene === 1) {
        document.getElementById('previous').style.display = 'none';
    }

    currentScene = (currentScene - 1 + scenes.length) % scenes.length;
    renderScene();
});

document.getElementById('start-over').addEventListener('click', function() {
    currentScene = 0;
    renderScene();
    
    document.getElementById('start-over').style.display = 'none';
    document.getElementById('previous').style.display = 'none';
    document.getElementById('next').style.display = 'inline-block'; 
});


function clearScene() {
    d3.select("#slide-container svg").selectAll("*").remove();
}

function renderScene() {
    clearScene();
    loadData().then(data => {
        scenes[currentScene](data);
    });

}

function renderScene1(raw_data) {
    const margin = { top: 30, right: 30, bottom: 70, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  
    // Define color scale for male and female bars
    const color = d3.scaleOrdinal()
      .domain(["Male", "Female"])
      .range(["#1f77b4", "#ff7f0e"]);
  
    // Append the SVG object to the chart div
    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    // X-axis scale for Diabetes_012 categories
    const x = d3.scaleBand()
      .range([0, width])
      .domain(raw_data.map(d => d.Diabetes_012))
      .padding(0.2);
  
    // Y-axis scale
    const y = d3.scaleLinear()
      .domain([0, d3.max(raw_data, d => d.Diabetes_012)])
      .range([height, 0]);
  
    // X-axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(d => (d === 0 ? "No Diabetic" : d === 1 ? "Prediabetic" : "Diabetic")));
  
    // Y-axis
    svg.append("g")
      .call(d3.axisLeft(y));
  
    // Bars
    svg.selectAll(".bar")
      .data(raw_data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.Diabetes_012))
      .attr("y", d => y(d.Diabetes_012))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.Diabetes_012))
      .attr("fill", d => color(d.Sex)); // Set different color for male and female bars
  
    // Add chart title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .text("Diabetes Status and Sex Bar Chart");
  }

function renderScene2(data) {
    const svg = d3.select("#slide-container svg");
    // D3 code for the second scene.
    svg.append("circle")
       .attr("cx", 150)
       .attr("cy", 150)
       .attr("r", 70)
       .attr("fill", "#4CAF50");
}

function renderScene3(data) {
    const svg = d3.select("#slide-container svg");
    // D3 code for the third scene.
    svg.append("ellipse")
       .attr("cx", 250)
       .attr("cy", 150)
       .attr("rx", 100)
       .attr("ry", 50)
       .attr("fill", "#FF5733");
}

function printAges() {
    d3.csv("Data/data.csv").then(function(data) {
        data.forEach(d => {
            console.log(d.Age);
        });
    });
}

async function loadData() {
    const data = await d3.csv("Data/data.csv");
    console.log(data['age'])
    return data;
}

