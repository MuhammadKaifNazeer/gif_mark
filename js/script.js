let submitBtn = document.getElementById("submit-btn");
let searchBox = document.getElementById("search-box");
let loadMoreBtn = document.getElementById("load-more"); // Assuming you have an element with id "load-more"

let displayedGifs = 0; // Keeps track of the number of GIFs displayed
let offset = 0; // Offset for API call to retrieve new GIFs

let generateGif = () => {
  // Display loader until gifs load
  let loader = document.querySelector(".loader");
  loader.style.display = "block";
  document.querySelector(".wrapper").style.display = "none";

  let q = searchBox.value;
  let gifCount = 9; // Number of GIFs to display initially

  // API URL
  let finalURL = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${q}&limit=${gifCount}&offset=${offset}&rating=g&lang=en`;
  document.querySelector(".wrapper").innerHTML = "";

  // Make a call to API
  fetch(finalURL)
    .then((resp) => resp.json())
    .then((info) => {
      let gifsData = info.data;

      gifsData.forEach((gif) => {
        // Generate cards for every gif
        let container = document.createElement("div");
        container.classList.add("container");

        let img = document.createElement("img");
        img.setAttribute("src", gif.images.downsized_medium.url);

        // Handle image load event (optional)
        img.onload = () => {
          // You can perform actions here after the image loads (e.g., remove loader)
        };

        container.append(img);

        // Copy link button
        let copyBtn = document.createElement("button");
        copyBtn.innerText = "Copy Link";
        copyBtn.onclick = () => {
          // Append the obtained ID to default URL
          let copyLink = `https://media4.giphy.com/media/${gif.id}/giphy.mp4`;
          // Copy text inside the text field
          navigator.clipboard
            .writeText(copyLink)
            .then(() => {
              alert("GIF copied to clipboard");
            })
            .catch(() => {
              // If navigator is not supported
              alert("GIF copied to clipboard");
              // Create temporary input
              let hiddenInput = document.createElement("input");
              hiddenInput.setAttribute("type", "text");
              document.body.appendChild(hiddenInput);
              hiddenInput.value = copyLink;
              // Select input
              hiddenInput.select();
              // Copy the value
              document.execCommand("copy");
              // Remove the input
              document.body.removeChild(hiddenInput);
            });
        };
        container.append(copyBtn);

        document.querySelector(".wrapper").append(container);
      });

      displayedGifs += gifsData.length; // Update displayed GIFs count

      // Hide loader and show/hide "Load More" button
      loader.style.display = "none";
      document.querySelector(".wrapper").style.display = "grid";
      loadMoreBtn.style.display = gifsData.length < gifCount ? "none" : "block";
    });
};

// Generate Gifs on submit or Enter key press
submitBtn.addEventListener("click", generateGif);
searchBox.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    generateGif();
    offset = 0; // Reset offset for new search
    displayedGifs = 0; // Reset displayed GIFs count
  }
});

// Load More button click handler (assuming you have one)
loadMoreBtn.addEventListener("click", () => {
  offset += 9; // Increase offset for next set of GIFs
  generateGif();
});
