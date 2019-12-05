$(function() {
  var canvasRect = d3
      .select("#mainCanvas")
      .node()
      .getBoundingClientRect(),
    margin = { top: 20, right: 20, left: 20, bottom: 20 },
    width = canvasRect.width - margin.left - margin.right,
    height = canvasRect.height - margin.top - margin.bottom;

  var nodeW = 60,
    nodeH = 20,
    spaceX = 10,
    spaceY = 20;

  var tree = d3
    .tree()
    .size([width, height])
    .nodeSize([nodeW + spaceX, nodeH + spaceY]);

  // var svg = d3
  //   .select("#mainCanvas")
  //   .append("svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //   .attr("transform", "translate(" + 400 + "," + 80 + ")");

  var newTree = true;

  var Btree, data, svg, oldnode;

  var removedNode = 0;

  var degree = 3; //Default value of degree

  Btree = BTree(degree);

  //Generate a randome btree
  Btree.seed(10);

  data = Btree.toJSON();
  var root = d3.hierarchy(data);

  treeClassification();

  $("#page1_showexample").click(function() {
    var myNode = document.getElementById("mainCanvas");
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
    svg = d3
      .select("#mainCanvas")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + 400 + "," + 80 + ")");

    degree = 3; //Default value of degree

    Btree = BTree(degree);
    //Generate a randome btree
    Btree.seed(10);

    data = Btree.toJSON();
    root = d3.hierarchy(data);
    Btree.numberofChildren(Btree.root)
    oldnode = Btree.numberoftreenode;
    update(data);

    $("#degreetext").fadeOut(0);
    $("#page1_showexample").fadeOut(1000);
    $("#degreetext2")
      .delay(500)
      .fadeIn(1000);

    $("#page11_ok")
      .delay(1000)
      .fadeIn(1000);
  });

  $("#page2_go").click(function() {
    var value = Number(
      document.getElementById("select_staff").getAttribute("value")
    );
    search(value);
  });

  $("#page4_ok").click(function() {
    $(".main").enable();
    $(".main").moveDown();
    $(".main").disable();
    var myNode = document.getElementById("mainCanvas");
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
    $("#addNodeContainer").hide();
    $("#deleteNodeContainer").hide();
    $("#findNodeContainer").hide();
    $("#degreetext2").fadeOut(0);
    $("#degreetext3").fadeIn(500);

    loadingGIF();
  });

  $("#orderdropdown-menu li a").click(function() {
    $(this)
      .parents(".dropdown")
      .find(".btn")
      .html($(this).text());
    $(this)
      .parents(".dropdown")
      .find(".btn")
      .val($(this).data("value"));

    $("#degreetext3").fadeOut(0);
    $("#degreetext4").fadeIn(500);
    document.getElementById("degreetext4").innerHTML =
      "Ready to build an B-tree with order " + $(this).data("value");
    var myNode = document.getElementById("mainCanvas");
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }

    degree = parseInt($(this).data("value")); //Default value of degree
    newTree = true;

    svg = d3
      .select("#mainCanvas")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + 400 + "," + 80 + ")");

    $("#addNodeContainer").fadeIn(500);
    $("#deleteNodeContainer").fadeIn(500);
    $("#findNodeContainer").fadeIn(500);
  });

  $("#add-node-form").submit(async function(event) {
    event.preventDefault();
    if ($("#addNode").val() == "") {
      Newalert("The input cannot be empty!");
      $("#addNode").val("");
    } else {
      var value = parseInt($("#addNode").val());
      if (newTree) {
        Btree = BTree(degree);

        //Generate a randome btree
        Btree.seed(0);
        Btree.insert(value, false);

        $("#addNode").val("");

        data = Btree.toJSON();
        root = d3.hierarchy(data);
        Btree.numberofChildren(Btree.root)
        oldnode = Btree.numberoftreenode;
        console.log(oldnode)
        update(data);
        newTree = false;
      } else {
        Btree.insert(value, false);

        $("#addNode").val("");

        data = Btree.toJSON();
        root = d3.hierarchy(data);
        Btree.numberofChildren(Btree.root)
        oldnode = Btree.numberoftreenode;
        console.log(oldnode)
        update(data);
      }
      document.getElementById("degreetext4").innerHTML =
        "Insert number " + value;
    }
  });

  $("#find-node-form").submit(async function(event) {
    event.preventDefault();
    if ($("#findNode").val() == "") {
      Newalert("The input cannot be empty!");
      $("#findNode").val("");
    } else {
      var value = parseInt($("#findNode").val());
      search(value);
      $("#findNode").val("");
      document.getElementById("degreetext4").innerHTML = "Find number " + value;
    }
  });

  $("#addbutton").click(function() {
    if ($("#addinput").val() == "") {
      Newalert("The input cannot be empty!");
      $("#addinput").val("");
    } else {
    var value = parseInt($("#addinput").val());
    search1(value, () => {
      Btree.insert(value, false);
      $("#addinput").val("");
      data = Btree.toJSON();
      root = d3.hierarchy(data);
      update(data);
    });
  }
  });

  $("#deletebutton").click(function() {
    if ($("#deleteinput").val() == "") {
      Newalert("The input cannot be empty!");
      $("#deleteinput").val("");
    } else {
    var value = parseInt($("#deleteinput").val());
    
    search1(value, () => {
      
      Btree.delete(value);
      Btree.numberofChildren(Btree.root)
      removedNode = oldnode - Btree.numberoftreenode;
      oldnode = Btree.numberoftreenode;
      console.log(removedNode)
      $("#deleteinput").val("");
      data = Btree.toJSON();
      root = d3.hierarchy(data);
      update(data);
    });
  }
  });

  $("#deleteNodebutton").click(function(){
    if ($("#deleteNode").val() == "") {
      Newalert("The input cannot be empty!");
      $("#deleteNode").val("");
    } else {
    var value = parseInt($("#deleteNode").val());
    
    search1(value, () => {
      
      Btree.delete(value);
      Btree.numberofChildren(Btree.root)
      removedNode = oldnode - Btree.numberoftreenode;
      oldnode = Btree.numberoftreenode;
      $("#deleteNode").val("");
      data = Btree.toJSON();
      root = d3.hierarchy(data);
      update(data);
    });
    document.getElementById("degreetext4").innerHTML = "Delete number " + value;
  }
  });

  /*
  $("#delete-form").submit(async function(event) {
    event.preventDefault();
    if($("#deleteinput").val()==""){
      Newalert("The input cannot be empty!");
      $("#deleteinput").val("");
    }else{
    var value = parseInt($("#deleteinput").val());
    Btree.delete(value);
    $("#deleteinput").val("");
    data = Btree.toJSON();
    root = d3.hierarchy(data);
    update(data);
    }
  });*/

  $("#page5_again").click(function() {
    var myNode = document.getElementById("mainCanvas");
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
    $("#degreetext4").fadeOut(0);
    $("#degreetext3").fadeIn(500);
    loadingGIF();
    $("#addNodeContainer").fadeOut(0);
    $("#deleteNodeContainer").fadeOut(0);
    $("#findNodeContainer").fadeOut(0);
    $("#orderdropdown").html("Select a Degree");
  });

  $("#page5_home").click(function() {
    $("#degreetext3").fadeOut(0);
    $("#degreetext4").fadeOut(0);
    $("#degreetext").fadeIn(500);
    var myNode = document.getElementById("mainCanvas");
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
    treeClassification();
    $("#page11_ok").fadeOut(0);
    $("#page1_showexample").fadeIn(500);
    $("#orderdropdown").html("Select a Degree");
  });

  function update(data) {
    var treeData = tree(root);

    var nodes = root.descendants();
    var links = treeData.links();

    // Normalize for fixed-depth.
    nodes.forEach(function(d) {
      d.y = d.depth * 100;
    });

    var i = 0;
    var node = svg.selectAll("g.node").data(nodes, function(d) {
      return d.id || (d.id = ++i);
    });

    var link = svg
      .selectAll("path.link")

      .data(links, function(d) {
        return d.target.id;
      });

    link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr(
        "d",
        d3
          .linkVertical()
          .x(function(d, i) {
            return d.x;
          })
          .y(function(d) {
            return d.y;
          })
      )
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 2.5)
      .style("opacity", 0)
      .transition()
      .style("opacity", 1)
      .duration(1000);

    var nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("id", function(d) {
        return "node" + d.id;
      })
      .attr("transform", function(d) {
        return "translate(" + (d.x - nodeW / 2) + "," + (d.y - nodeH / 2) + ")";
      });

    nodeEnter
      .append("rect")
      .attr("width", nodeW)
      .attr("height", nodeH)
      .attr("x", 0)
      .attr("y", 0)
      .style("fill", "#FFD700")
      .style("opacity", 0)
      .transition()
      .style("opacity", 1)
      .duration(3000);

    nodeEnter
      .append("text")
      .attr("y", nodeH / 2)
      .attr("x", nodeW / 2)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) {
        return d.data.name;
      })
      .style("opacity", 0)
      .transition()
      .style("opacity", 1)
      .duration(3000);

    link.each(function(d, i) {
      var thisLink = d3.select(svg.selectAll("path.link")._groups[0][i]);
      //   diagonal = d3.svg.diagonal()
      //     .projection(function(d) { return [d.x, d.y]; });

      thisLink
        .transition()
        .duration(1500)
        .attr(
          "d",
          d3
            .linkVertical()
            .x(function(d) {
              return d.x;
            })
            .y(function(d) {
              return d.y;
            })
        );
    });

    node.each(function(d, i) {
      console.log(d);
      var thisNode = d3.select("#" + this.id + " text");
      thisNode.text(d.data.name);
      d3.select("#" + this.id)
        .transition()
        .duration(1500)
        .attr(
          "transform",
          "translate(" + (d.x - nodeW / 2) + "," + (d.y - nodeH / 2) + ")"
        );

      //   thisNode.attr("y", d.children || d._children ? -18 : 18);
    });

    if (removedNode!= 0) {
      var nodeIndex = svg.selectAll("g.node")._groups[0].length - 1;
      var linkIndex = svg.selectAll("path.link")._groups[0].length - 1;
      for (var i = 0; i < removedNode; i++) {
        d3.select(svg.selectAll("g.node")._groups[0][nodeIndex]).remove();
        d3.select(svg.selectAll("path.link")._groups[0][linkIndex]).remove();
        nodeIndex -= 1;
        linkIndex -= 1;
      }
    }

    removedNode = 0;


  }

  function search(value) {
    var returnResult = Btree.searchWholePath(value, true);
    var lookupArray = returnResult.path;
    var exactNode = returnResult.node;
    var lookupArray_update = lookupArray.map(function(item) {
      return item.keys.toString();
    });
    var index = 0;

    var rectAnimation = d3.interval(function(elapsed) {
      d3.selectAll(".node")
        .filter(function(d) {
          return lookupArray_update[index] == d.data.name;
        })
        .select("rect")
        .transition()
        .style("stroke", "red")
        .style("stroke-width", "3")
        .transition()
        // .duration(500)
        .style("stroke-width", "0");

      if (index < lookupArray_update.length - 1) {
        d3.selectAll(".link")
          .filter(function(d) {
            return (
              lookupArray_update[index] == d.source.data.name &&
              lookupArray_update[index + 1] == d.target.data.name
            );
          })
          .transition()
          .delay(500)
          .style("stroke", "red")
          .attr("stroke-opacity", 1)
          .style("stroke-width", "3")
          .transition()
          .style("stroke-width", "2.5")
          .attr("stroke-opacity", 0.4)
          .style("stroke", "#555");
      }

      index = index + 1;
      if (index == lookupArray_update.length) {
        rectAnimation.stop();
        if (!exactNode) {
          setTimeout(function() {
            Newalert("The number is not in the tree!");
          }, 1000);
        }
      }
    }, 1000);
    if (lookupArray.length == 0) {
      d3.selectAll(".node")
        .select("rect")
        .transition()
        .style("stroke", "red")
        .style("stroke-width", "3")
        .transition()
        // .duration(500)
        .style("stroke-width", "0");
      if (!exactNode) {
        setTimeout(function() {
          Newalert("The number is not in the tree!");
        }, 800);
      }
    }
  }

  function loadingGIF() {
    var w = 800,
      h = 600;
    var t0 = Date.now();

    var planets = [{ R: 150, r: 5, speed: 8, phi0: 90 }];
    var svg = d3
      .select("#mainCanvas")
      .insert("svg")
      .attr("width", w)
      .attr("height", h);
    var container = svg
      .append("g")
      .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");
    var defs = svg.append("svg:defs");

    defs
      .append("svg:pattern")
      .attr("id", "grump_avatar")
      .attr("width", 300)
      .attr("height", 300)
      .attr("patternUnits", "userSpaceOnUse")
      .append("svg:image")
      .attr("xlink:href", "../lib/earth.png")
      .attr("width", 300)
      .attr("height", 300)
      .attr("x", 0)
      .attr("y", 0);

    container
      .selectAll("g.planet")
      .data(planets)
      .enter()
      .append("g")
      .attr("class", "planetbase")
      .each(function(d, i) {
        d3.select(this)
          .append("circle")
          .attr("class", "orbit")
          .attr("transform", "translate(" + -w / 5.4 + "," + -h / 4 + ")")
          .attr("r", d.R)
          .attr("cx", 150)
          .attr("cy", 150)
          .attr("fill", "url(#grump_avatar)");

        d3.select(this)
          .append("g:image")
          .attr("xlink:href", "lib/treebranch.png")
          .attr("x", d.R - 24)
          .attr("y", 0)
          .attr("width", 80)
          .attr("height", 80)
          .attr("class", "planet");
      });

    d3.timer(function() {
      var delta = Date.now() - t0;
      svg.selectAll(".planet").attr("transform", function(d) {
        return "rotate(" + d.phi0 + (delta * d.speed) / 200 + ")";
      });
    });
  }

  function treeClassification() {
    am4core.ready(function() {
      // Themes begin
      am4core.useTheme(am4themes_kelly);
      am4core.useTheme(am4themes_animated);

      // Themes end

      var chart = am4core.create(
        "mainCanvas",
        am4plugins_forceDirected.ForceDirectedTree
      );
      var networkSeries = chart.series.push(
        new am4plugins_forceDirected.ForceDirectedSeries()
      );

      chart.data = [
        {
          name: "Tree",
          color: am4core.color("#ecbe05"),
          children: [
            {
              name: "Unordered Tree",
              color: am4core.color("#EC7505"),
              value: 3000
            },
            {
              name: "Ordered Tree",
              color: am4core.color("#EC7505"),
              children: [
                {
                  name: "Binary Tree",
                  color: am4core.color("#bd0636"),
                  children: [
                    {
                      name: "Complete BT",
                      color: am4core.color("#ed5c82"),
                      children: [
                        {
                          name: "Full BT",
                          value: 400,
                          color: am4core.color("#ed885c")
                        }
                      ]
                    },
                    {
                      name: "AVL Tree",
                      value: 500,
                      color: am4core.color("#ed5c82")
                    },
                    {
                      name: "Binary Search Tree",
                      value: 500,
                      color: am4core.color("#ed5c82")
                    }
                  ]
                },
                {
                  name: "Huffman Tree",
                  value: 800,
                  color: am4core.color("#bd0636")
                },
                {
                  name: "B Tree",
                  value: 800,
                  color: am4core.color("#bd0636"),
                  image: "../lib/star.png"
                }
              ]
            }
          ]
        }
      ];

      networkSeries.dataFields.value = "value";
      networkSeries.dataFields.color = "color";
      networkSeries.dataFields.name = "name";
      networkSeries.dataFields.children = "children";
      networkSeries.nodes.template.tooltipText = "{name}";
      networkSeries.nodes.template.fillOpacity = 1;
      networkSeries.manyBodyStrength = -20;
      networkSeries.links.template.strength = 0.8;
      networkSeries.links.template.strokeWidth = 5;
      networkSeries.minRadius = am4core.percent(6);
      // networkSeries.nodes.template.label.fill = am4core.color("#000");
      networkSeries.nodes.template.label.text = "{name}";
      networkSeries.fontSize = 12;
      networkSeries.fontWeight = 600;

      var icon = networkSeries.nodes.template.createChild(am4core.Image);
      icon.propertyFields.href = "image";
      icon.horizontalCenter = "left";
      icon.verticalCenter = "bottom";
      icon.width = 60;
      icon.height = 60;
    });
    $("g[aria-labelledby]").hide();
  }

  function insert(value) {
    //var insertPath = Btree.insertWholePath(value, true);
    var insertPath = Btree.searchWholePath(value, true);
    var lookupArray_update = lookupArray.map(function(item) {
      return item.keys.toString();
    });
    var index = 0;

    var rectAnimation = d3.interval(function(elapsed) {
      d3.selectAll(".node")
        .filter(function(d) {
          return lookupArray_update[index] == d.data.name;
        })
        .select("rect")
        .transition()
        .style("stroke", "red")
        .style("stroke-width", "3")
        .transition()
        // .duration(500)
        .style("stroke-width", "0");

      if (index < lookupArray_update.length - 1) {
        d3.selectAll(".link")
          .filter(function(d) {
            return (
              lookupArray_update[index] == d.source.data.name &&
              lookupArray_update[index + 1] == d.target.data.name
            );
          })
          .transition()
          .delay(500)
          .style("stroke", "red")
          .attr("stroke-opacity", 1)
          .style("stroke-width", "3")
          .transition()
          .style("stroke-width", "2.5")
          .attr("stroke-opacity", 0.4)
          .style("stroke", "#555");
      }

      index = index + 1;
      if (index == lookupArray_update.length) rectAnimation.stop();
    }, 1000);
  }

  function search1(value, callback) {
    var returnResult = Btree.searchWholePath(value, true);
    var lookupArray = returnResult.path;
    var lookupArray_update = lookupArray.map(function(item) {
      return item.keys.toString();
    });
    var index = 0;

    var rectAnimation = d3.interval(function(elapsed) {
      d3.selectAll(".node")
        .filter(function(d) {
          return lookupArray_update[index] == d.data.name;
        })
        .select("rect")
        .transition()
        .style("stroke", "red")
        .style("stroke-width", "3")
        .transition()
        // .duration(500)
        .style("stroke-width", "0");

      if (index < lookupArray_update.length - 1) {
        d3.selectAll(".link")
          .filter(function(d) {
            return (
              lookupArray_update[index] == d.source.data.name &&
              lookupArray_update[index + 1] == d.target.data.name
            );
          })
          .transition()
          .delay(500)
          .style("stroke", "red")
          .attr("stroke-opacity", 1)
          .style("stroke-width", "3")
          .transition()
          .style("stroke-width", "2.5")
          .attr("stroke-opacity", 0.4)
          .style("stroke", "#555");
      }

      index = index + 1;
      if (index == lookupArray_update.length) {
        rectAnimation.stop();
        callback();
      }
    }, 1000);
  }

  function Newalert(e) {
    $("body").append(
      '<div id="msg"><div id="msg_top">Warning<span class="msg_close">×</span></div><div id="msg_cont">' +
        e +
        '</div><div class="msg_close" id="msg_clear">OK</div></div>'
    );
    $(".msg_close").click(function() {
      $("#msg").remove();
    });
  }
});
