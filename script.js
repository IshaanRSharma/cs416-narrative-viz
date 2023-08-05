document.addEventListener("DOMContentLoaded", function() {
    const slideData = [
        { title: "Slide 1", content: "Content for slide 1" },
        { title: "Slide 2", content: "Content for slide 2" },
        { title: "Slide 3", content: "Content for slide 3" },
    ];
    
    let currentSlide = 0;
    
    const slideContainer = d3.select("#slide-container");
    const startButton = document.getElementById('start');
    
    function updateSlide() {
        const slide = slideData[currentSlide];
        slideContainer.html(`
            <h2>${slide.title}</h2>
            <p>${slide.content}</p>
        `);
        
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
});
