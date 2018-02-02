var treeData = [
  {
    "name": "DefCon",
    "parent": "null",
    "ctf": true,
    "children": [
      {
        "name": "Winner",
        "parent": "DefCon",
        "ctf": false,
        "children": [
          {
            "name": "Small CTF 1",
            "parent": "Winner",
            "ctf": true,
          },
          {
            "name": "Friend",
            "parent": "Winner",
            "ctf": false
          }
        ]
      },
      {
        "name": "Winner",
        "parent": "DefCon",
        "ctf": false
      }
    ]
  }
];


// ************** Generate the tree diagram	 *****************
var margin = {top: 0, right: 120, bottom: 20, left: 120},
	width = 600 - margin.right - margin.left,
  height = 250 - margin.top - margin.bottom;
  
if (window.innerWidth < 600) {
  width = window.innerWidth - 100;
  margin.right = 20;
  margin.left = 60;
}
	
var i = 0,
	duration = 750,
	root;

var tree = d3.layout.tree()
	.size([height, width]);

var diagonal = d3.svg.diagonal()
	.projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("#graph").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
  .append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeData[0];
root.x0 = height / 2;
root.y0 = 0;

update(root);

d3.select(self.frameElement).style("height", "250px");

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
	  links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
	  .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
	  .attr("class", "node")
	  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; });

  nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("stroke", function(d) { return d.ctf ? "rgb(54, 224, 255)" : "#363636"} )
      .style("fill", function(d) { return d.ctf ? "white" : "gray"} );

  nodeEnter.append("text")
	  .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
	  .attr("dy", ".35em")
	  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
	  .text(function(d) { return d.name; })
	  .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
	  .attr("r", 10)
	  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
	  .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
	  .remove();

  nodeExit.select("circle")
	  .attr("r", 1e-6);

  nodeExit.select("text")
	  .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
	  .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
	  .attr("class", "link")
	  .attr("d", function(d) {
		var o = {x: source.x0, y: source.y0};
		return diagonal({source: o, target: o});
	  }).attr("stroke", "#ccc").attr("stroke-width", "2px");

  // Transition links to their new position.
  link.transition()
	  .duration(duration)
	  .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
	  .duration(duration)
	  .attr("d", function(d) {
		var o = {x: source.x, y: source.y};
		return diagonal({source: o, target: o});
	  })
	  .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
	d.x0 = d.x;
	d.y0 = d.y;
  });
}

function animateRandom() {
    var links = svg.selectAll("path.link");
    var randIdx = Math.floor(Math.random() * links[0].length);

    links = links.filter(function (d, i) { return i === randIdx;});

    links
        .transition()
        .attr("stroke", "#686868")
        .attr("stroke-width", "3px").duration(500);

    setTimeout(function() {
        links.transition()
        .attr("stroke", "#ccc").attr("stroke-width", "2px").duration(500);

    }, 2000);
    setTimeout(animateRandom, 2500);
}

setTimeout(animateRandom, 2500);