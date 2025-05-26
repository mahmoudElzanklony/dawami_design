<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 100vh;">
    <div class="d-flex justify-center align-center" >
      <svg ref="treeContainer" width="80%" height="500"></svg>
    </div>
  </v-container>
</template>

<script setup>
import { onMounted, ref, nextTick } from "vue";
import * as d3 from "d3";
import dagre from "@dagrejs/dagre";

const treeContainer = ref(null);

const data = [
  { id: "1", name: "Electronics", parentId: null },
  { id: "2", name: "Home Appliances", parentId: null },
  { id: "3", name: "Computers", parentId: "1" },
  { id: "4", name: "Laptops", parentId: "3" },
  { id: "5", name: "Phones", parentId: "1" },
  { id: "6", name: "Washing Machines", parentId: "2" },
  { id: "7", name: "Refrigerators", parentId: "2" },
  { id: "8", name: "Mac", parentId: "4" },
  { id: "9", name: "M1", parentId: "8" },
  { id: "10", name: "M2", parentId: "8" },
];

onMounted(async () => {
  await nextTick();
  if (!treeContainer.value) return console.error("SVG container not found!");

  // Initialize DAG graph
  const g = new dagre.graphlib.Graph();
  g.setGraph({rankdir: "TB", nodesep: 50, edgesep: 10}); // Use TB for vertical layout
  g.setDefaultEdgeLabel(() => ({})); // Avoid undefined edge properties

  // **Step 1: Add Nodes First**
  const fontSize = 14;
  const padding = 10;
  data.forEach((d) => {
    const textWidth = d.name.length * fontSize * 0.6 + padding * 2;
    g.setNode(d.id, {label: d.name, width: textWidth, height: 40});
  });

  // **Step 2: Add Edges Only If Parent Exists**
  data.forEach((d) => {
    if (d.parentId && g.hasNode(d.parentId) && g.hasNode(d.id)) {
      g.setEdge(d.parentId, d.id);
    }
  });

  dagre.layout(g); // Perform the layout

  const svg = d3.select(treeContainer.value);
  const gElem = svg.append("g");

  // **Step 3: Draw Edges Safely**
  g.edges().forEach((edge) => {
    const edgeData = g.edge(edge);
    if (!edgeData || !edgeData.points) return; // Prevent errors

    const points = edgeData.points;
    gElem.append("path")
        .attr("d", d3.line().x((d) => d.x).y((d) => d.y)(points))
        .attr("stroke", "black")
        .attr("fill", "none");
  });

  // **Step 4: Draw Nodes**
  g.nodes().forEach((nodeId) => {
    const node = g.node(nodeId);
    const group = gElem.append("g").attr("transform", `translate(${node.x - node.width / 2},${node.y - node.height / 2})`);

    // Node box with color #699190
    group.append("rect")
        .attr("width", node.width)
        .attr("height", node.height)
        .attr("fill", "#699190")  // Updated color
        .attr("stroke", "black")
        .attr("rx", 5);

    // Node label with white text color
    group.append("text")
        .attr("x", node.width / 2)
        .attr("y", node.height / 2)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("fill", "white")  // Set text color to white
        .text(node.label);
  });
});
</script>
