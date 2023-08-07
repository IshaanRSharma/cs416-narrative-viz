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

function preprocessData(rawData) {
    // Filter out rows with NaN values
    const filteredData = rawData.filter(d => !isNaN(d.Diabetes_012) && !isNaN(d.Sex) && !isNaN(d.Age));

    const ageBins = ["0-20", "20-40", "40-60", "60-80", "80-100"];

    // Initialize an empty data structure for our age bins and sexes
    let data = {};
    ageBins.forEach(bin => {
        data[bin] = { 'Male': { 'Diabetic': 0, 'Non-Diabetic': 0 }, 'Female': { 'Diabetic': 0, 'Non-Diabetic': 0 } };
    });

    // Populate the data structure
    filteredData.forEach(d => {
        const age = +d.Age;
        let bin = null;

        if (age <= 20) bin = "0-20";
        else if (age <= 40) bin = "20-40";
        else if (age <= 60) bin = "40-60";
        else if (age <= 80) bin = "60-80";
        else bin = "80-100";

        if (+d.Diabetes_012 === 1) {
            data[bin][d.Sex]['Diabetic']++;
        } else {
            data[bin][d.Sex]['Non-Diabetic']++;
        }
    });

    return data;
}


function renderScene1(raw_data) {
    const svg = d3.select("#slide-container svg");

    const width = 800;
    const height = 400;
    const margin = {top: 20, right: 20, bottom: 40, left: 50};

    // Scales
    const xScale = d3.scaleBand()
    .domain(ageBins)
    .range([margin.left, width - margin.right])
    .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[1].reduce((acc, curr) => acc + curr[1], 0))])
        .range([height - margin.bottom, margin.top]);

    const colorScale = d3.scaleOrdinal()
        .domain(['Male', 'Female'])
        .range(['#1f77b4', '#ff7f0e']); // blue and orange

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickSizeOuter(0));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));

    const processedData = preprocessData(raw_data);
    const data = [];

    for (const [age, sexes] of Object.entries(processedData)) {
        for (const [sex, diabeticStatus] of Object.entries(sexes)) {
            data.push({
                age: age,
                sex: sex,
                count: diabeticStatus['Diabetic'],
                type: 'Diabetic'
            });
            data.push({
                age: age,
                sex: sex,
                count: diabeticStatus['Non-Diabetic'],
                type: 'Non-Diabetic'
            });
        }
    }

    svg.selectAll(".bar")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.age))
    .attr("y", d => yScale(d.count))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - margin.bottom - yScale(d.count))
    .attr("fill", d => colorScale(d.sex));

// Tooltip behavior
const tooltip = d3.select("#tooltip");
svg.selectAll(".bar")
    .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 0.7);

        const totalCount = rawData.filter(row => row.Age === d.age && row.Sex === d.sex).length;
        const percentage = (d.count / totalCount) * 100;

        tooltip.html(`Age: ${d.age}<br>Sex: ${d.sex}<br>Percentage: ${percentage.toFixed(2)}%`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px")
            .style("visibility", "visible")
            .style("background-color", "white")
            .style("padding", "5px")
            .style("border", "1px solid black");
    })
    .on("mouseout", function(event, d) {
        d3.select(this).attr("opacity", 1);
        tooltip.style("visibility", "hidden");
    });
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

