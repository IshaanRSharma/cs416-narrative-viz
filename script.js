document.addEventListener("DOMContentLoaded", function() {
    const slideData = [
        {  title: "Diabetic Risk Factors", content: "D3", type: "d3" },
        { title: "Slide 2", content: "Content for slide 2" },
        { title: "Slide 3", content: "Content for slide 3" },
    ];
    
    let currentSlide = 0;
    
    const slideContainer = d3.select("#slide-container");
    const startButton = document.getElementById('start');
    
    function updateSlide() {
        const slide = slideData[currentSlide];
    
        if (slide.type === "d3") {
            renderD3Visualization();
    
        } else {
            slideContainer.html(`
                <h2>${slide.title}</h2>
                <p>${slide.content}</p>
            `);
        }
        
        if(currentSlide === slideData.length - 1) {
            startButton.style.display = 'inline';
        } else {
            startButton.style.display = 'none';
        }
    }
    
    updateSlide();
    
    d3.select("#previous").on("click", function() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlide();
        }
    });
    
    d3.select("#next").on("click", function() {
        if (currentSlide < slideData.length - 1) {
            currentSlide++;
            updateSlide();
        }
    });

    function renderD3Visualization() {
        // Load the CSV file using D3
        d3.csv("Data/data.csv").then(function(data) {
            console.log(data);  // You can log the data to the console to check if it's loaded correctly
        
            // Parse the values as numbers (important if your CSV values are strings)
            data.forEach(d => {
                d.value = +d.value;
            });
        
            // Append a table to the body (or any other container)
            let table = d3.select("body").append("table");
            
            // Create table header
            let thead = table.append("thead");
            thead.append("tr")
                .selectAll("th")
                .data(Object.keys(data[0])) // Assuming all rows have the same columns
                .enter().append("th")
                .text(function(d) { return d; });
        
            // Create table body
            let tbody = table.append("tbody");
        
            // Add rows for each data entry
            tbody.selectAll("tr")
                .data(data)
                .enter().append("tr")
                .selectAll("td")
                .data(function(d) {
                    return Object.values(d);
                })
                .enter().append("td")
                .text(function(d) { return d; });
        });
        

    }
});
