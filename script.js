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
    const filteredData = rawData.filter(d => !isNaN(d.Diabetes_012) && !isNaN(d.Sex) && !isNaN(d.Age));
    const groupedData = d3.rollups(
        filteredData, 
        v => v.length, 
        d => d.Age, 
        d => d.Sex, 
        d => d.Diabetes_012
    );
    console.log(groupedData)
    return groupedData;
}
function renderScene1(raw_data) {
    const data = preprocessData(raw_data);
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

    svg.selectAll(".barGroup")
        .data(data)
        .join("g")
        .attr("class", "barGroup")
        .attr("transform", d => `translate(${xScale(d[0])},0)`)
        .selectAll("rect")
        .data(d => d[1])
        .join("rect")
        .attr("width", xScale.bandwidth())
        .attr("y", d => yScale(d[1]))
        .attr("height", d => height - margin.bottom - yScale(d[1]))
        .attr("fill", d => colorScale(d[0]));

        const tooltip = d3.select("#tooltip");
        svg.selectAll(".barGroup rect")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("opacity", 0.7);

            const ageGroup = d[0];
            const sex = d[1][0];
            const count = d[1][1];
            const totalCount = d3.sum(rawData, row => +row.Age === ageGroup && row.Sex === sex);
            const percentage = (count / totalCount) * 100;

            tooltip.html(`Age: ${ageGroup}<br>Sex: ${sex}<br>Percentage: ${percentage.toFixed(2)}%`)
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
    return data;
}

