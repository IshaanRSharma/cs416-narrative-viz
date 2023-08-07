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
    // Filter out invalid entries
    const validData = rawData.filter(d => !isNaN(d.Diabetes_012) && d.Sex);
    
    // Group by sex and diabetes status
    const grouped = d3.group(validData, d => d.Sex, d => d.Diabetes_012);
    
    // Transform data for chart
    const data = [];
    for (let [sex, diabetesMap] of grouped.entries()) {
        for (let [status, individuals] of diabetesMap.entries()) {
            const type = (status === 1 || status === 2) ? 'Diabetic' : 'Non-Diabetic';
            data.push({sex, type, count: individuals.length});
        }
    }
    return data;
}


function renderScene1(raw_data) {
    const data = preprocessData(raw_data);
    const svg = d3.select("#slide-container svg");
    const width = 800;
    const height = 400;
    const margin = {top: 20, right: 20, bottom: 40, left: 50};

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.sex))
        .range([margin.left, width - margin.right])
        .padding(0.5);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .range([height - margin.bottom, margin.top]);

    const colorScale = d3.scaleOrdinal()
        .domain(['Diabetic', 'Non-Diabetic'])
        .range(['#d62728', '#2ca02c']);  // Red for Diabetic, Green for Non-Diabetic

    // Create bars
    svg.selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.sex))
        .attr("y", d => yScale(d.count))
        .attr("width", xScale.bandwidth() / 2)
        .attr("height", d => height - margin.bottom - yScale(d.count))
        .attr("fill", d => colorScale(d.type))
        .attr("transform", d => `translate(${d.type === 'Diabetic' ? 0 : xScale.bandwidth() / 2},0)`);

    // Axes
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickSizeOuter(0));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));
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

