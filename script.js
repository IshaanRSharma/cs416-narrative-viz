let currentScene = 0;
const scenes = [renderScene1, renderScene2, renderScene3];  


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

function renderScene1(data) {
    const svg = d3.select("#slide-container svg");
    const width = +svg.attr("width");
    const height = +svg.attr("height");

  
    const ageBins = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]; // e.g., 0-10, 10-20, etc.

    const binnedData = d3.bin()
        .domain([0, 100])  // Assuming age ranges from 0 to 100
        .thresholds(ageBins)
        (data.map(d => d.Age));


    const diabetesCounts = binnedData.map(bin => {
        const diabetic = d3.sum(bin, d => d.Diabetes_012 === 1);
        return {
            ageRange: [bin.x0, bin.x1],
            prevalence: diabetic / bin.length
        };
    });
    console.log(diabetesCounts)


    const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, d3.max(diabetesCounts, d => d.prevalence)]);


    const yScale = d3.scaleBand()
        .domain(ageBins.slice(0, -1).map(d => `${d}-${d+10}`))
        .range([0, height]);


    svg.selectAll('rect')
        .data(diabetesCounts)
        .enter().append('rect')
        .attr('y', d => yScale(`${d.ageRange[0]}-${d.ageRange[1]}`))
        .attr('height', yScale.bandwidth())
        .attr('width', width)
        .attr('fill', d => colorScale(d.prevalence))
        .on("mouseover", function(event, d) {
            d3.select(this).attr('stroke', 'black');
            svg.append('text')
                .attr('id', 'tooltip')
                .attr('x', width / 2)
                .attr('y', height / 2)
                .attr('text-anchor', 'middle')
                .text(`Age: ${d.ageRange[0]}-${d.ageRange[1]}, Prevalence: ${d.prevalence.toFixed(2)}`);
        })
        .on("mouseout", function() {
            d3.select(this).attr('stroke', null);
            svg.select('#tooltip').remove();
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

