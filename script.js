function checkOther() {
  document.getElementById("otherR").style.display = "block";
}

function check() {
  document.getElementById("otherR").style.display = "none";
}

$(document).ready(function() {
  $("form").submit(function(event) {
    
    let rbs = document.querySelectorAll('input[name="radioB"]');
    let selectedValue = "";
    
    // this for loop is used to check which radio button is selected
    for (let rb of rbs) {
      if (rb.checked) {
        selectedValue = rb.value;
        break;
      }
    }

    if (selectedValue === "") {
      selectedValue = undefined;
      alert("Please select a resource");
    } else if (selectedValue === "other") {
      if ($("#otherR").val()) {
        selectedValue = $("#otherR").val();
      } else {
        selectedValue = undefined;
        alert("Please enter a resource");
      }
    }

    let cityValue = $("#usr").val();

    if (cityValue === "") {
      cityValue = undefined;
      alert("Please enter a city name");
    }

    var formData = {
      city: cityValue,
      res: selectedValue
    };

    $.ajax({
      type: "POST",
      url: "https://covid-resources-project.herokuapp.com",
      data: formData,
      dataType: "json",
      encode: true,
    }).done(function(data) {
      let k = 0;
      deleteDiv(k);
      // This is used to delete previous results 
      function deleteDiv(k) {
        let myNode = document.getElementById("divTweet" + k);
        while (true) {
          myNode = document.getElementById("divTweet" + k);
          if (myNode) {
            myNode.parentNode.removeChild(myNode);
          } else {
            break;
          }
          k++;
        }
      }
      let i = 0;
      let count = 0;
      data.forEach((tweetData) => {

        let element = document.createElement("div");

        element.id = 'divTweet' + i;

        let para1 = document.createElement("p");
        let node1 = document.createTextNode("Tweet: " + tweetData.text);

        para1.appendChild(node1);
        element.appendChild(para1);

        let para2 = document.createElement("p");
        let node2 = document.createTextNode("Posted At: " + tweetData.postedAt.slice(0, tweetData.postedAt.indexOf('+')));

        para2.appendChild(node2);
        element.appendChild(para2);

        let main = document.getElementById('main');

        main.appendChild(element);
        
        // windows open function is used to open tweet on twitter 
        element.onclick = function() {
          window.open("http://" + tweetData.tweetLink, "_blank");
        }
        i++;
        count++;
      });
      document.getElementById('results').innerHTML = count + " results found";
    });
    event.preventDefault();
  });
});
