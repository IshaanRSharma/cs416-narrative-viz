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
    var aggregatedData = aggregateData(raw_data);
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

        var xScale = d3.scaleBand()
        .domain(aggregatedData.map(d => d.genre))
        .range([50, width - 50])
        .padding(0.5);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(aggregatedData, d => +d.energy)])
        .range([height - 50, 50]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // Draw the axes
    svg.append("g")
        .attr("transform", "translate(0," + (height - 50) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(50,0)")
        .call(yAxis);

        var bars = svg.selectAll("rect")
        .data(aggregatedData)
        .enter().append("rect")
        .attr("x", d => xScale(d.genre))
        .attr("y", d => yScale(d.averageEnergy))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - 50 - yScale(d.averageEnergy))
        .style("fill", "#0077b6")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .style("fill", "#ff5733");
    
            // Add tooltip
            svg.append("text")
                .attr("id", "tooltip")
                .attr("x", xScale(d.genre) + xScale.bandwidth() / 2)
                .attr("y", yScale(d.averageEnergy) - 15)
                .attr("text-anchor", "middle")
                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                .attr("font-weight", "bold")
                .attr("fill", "black")
                .text(`Danceability: ${d.danceability}`);
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .style("fill", "#0077b6");
    
            // Remove tooltip
            d3.select("#tooltip").remove();
        });
    // Add annotation
    const annotations = [{
        note: {
            label: "Hover over each point to see danceability.",
            title: "Note"
        },
        x: width / 2,
        y: 30,
        dy: 0,
        dx: 0
    }];

    const makeAnnotations = d3.annotation()
        .annotations(annotations);

    svg.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
}
  function renderScene2(data) {
    clearScene();
  
   
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

async function loadData() {
        const data = await d3.csv("Data/data.csv");
        return data;
 }

 function addParagraphForScene(sceneIndex) {
    const container = document.getElementById('sceneContainer'); // assuming you have a div with id "sceneContainer" where you want to append the paragraph
    container.innerHTML = ""; // Clear existing content

    let paragraphContent;
    switch (sceneIndex) {
        case 0:
            paragraphContent = "Description for Scene 1";
            break;
        case 1:
            paragraphContent = "Description for Scene 2";
            break;
        case 2:
            paragraphContent = "Description for Scene 3";
            break;
        default:
            paragraphContent = ""; // default or for additional scenes
    }

    if (paragraphContent) {
        const paragraph = document.createElement('p');
        paragraph.textContent = paragraphContent;
        container.appendChild(paragraph);
    }
}

function aggregateData(data) {
    let genreMap = new Map();

    data.forEach(d => {
        if (genreMap.has(d.genre)) {
            let current = genreMap.get(d.genre);
            current.count += 1;
            current.totalEnergy += +d.energy;
            genreMap.set(d.genre, current);
        } else {
            genreMap.set(d.genre, { count: 1, totalEnergy: +d.energy });
        }
    });

    let aggregatedData = [];
    genreMap.forEach((value, key) => {
        aggregatedData.push({
            genre: key,
            averageEnergy: value.totalEnergy / value.count
        });
    });

    return aggregatedData;
}
