---
description: Query the existing knowledge graph
---
Check if graphify-out/graph.json exists. If it does, prompt the user for a question about the codebase, then run the graphify skill's query workflow: traverse the graph using BFS/DFS to answer the question using only what the graph contains, citing source_location when referencing specific facts.
