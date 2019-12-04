$(document).ready(function() {
  $(".main").onepage_scroll({
    sectionContainer: "section",
    responsiveFallback: 600,
    afterMove: function(index) {
      if (index == 2) {
        // load data for dropdown menu

        var list = document.getElementById("projectSelectorDropdown");
        var old = document.querySelectorAll("#projectSelectorDropdown li");
        if (old) {
          // document.getElementById('select_staff').getAttribute('value')="Select a key";

          old.forEach(function(item) {
            list.removeChild(item);
          });
        }
        var rows = d3.selectAll(".node").data();
        var array = [];
        rows.forEach(function(item, index) {
          array = array.concat(item.data.name.split(","));
        });

        for (var i = 0; i < array.length; i++) {
          var li = document.createElement("li");
          var link = document.createElement("a");
          var text = document.createTextNode(array[i]);
          link.appendChild(text);
          link.href = "#";
          li.appendChild(link);
          list.appendChild(li);
        }
      }
    },
    beforeMove: function(index) {
      if (index == 2) {
        $(".dropdown-toggle").val("Select a key");
        document.querySelector("#page2_go").style.opacity = 0;
      }
      $(".uniquescrollbar").scrollTop(0);
    },
    loop: true
  });
  $(".main").disable();
  $("#degreetext")
    .hide(0)
    .delay(100)
    .fadeIn(2000);
  $("#degreetext2").hide();
  $("#degreetext3").hide();
  $("#degreetext4").hide();
  $("#page11_ok").hide();
});

var width = 200,
  height = 123;

var coordsX = [0, 20, 40, 60, 80];

var i = 0;

var svg = d3
  .select("#navTopSub")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

$("svg").css({ top: 0, left: 190, position: "absolute" });

var g = svg.append("g");

var t = d3.interval(function(elapsed) {
  g.append("svg:image")

    .attr("xlink:href", "lib/tree.png")
    .attr("width", 20)
    .attr("height", 20)
    .attr("id", "tree_" + i)
    .attr("x", coordsX[i])
    .attr("y", 0)
    .on("mouseover", handleMouseOver)
    .transition()
    .duration(1000)
    .attr("y", document.getElementById("navTop").clientHeight - 23)
    .ease(d3.easeBounce);

  i = i + 1;
  if (i == 5) t.stop();
}, 200);


$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();
});
