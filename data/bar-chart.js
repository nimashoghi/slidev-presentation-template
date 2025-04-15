export default ({d3, container, width, height, margin, fontFamily, data}) => {
    // Set up SVG
    const svg = container
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)

    // Calculate inner dimensions
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Use provided data or sample data if none provided
    const chartData = data.length
        ? data
        : [
              {name: "A", value: 5},
              {name: "B", value: 10},
              {name: "C", value: 15},
              {name: "D", value: 7},
              {name: "E", value: 12},
          ]

    // Create scales
    const x = d3
        .scaleBand()
        .domain(chartData.map((d) => d.name))
        .range([0, innerWidth])
        .padding(0.1)

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(chartData, (d) => d.value)])
        .nice()
        .range([innerHeight, 0])

    // Add bars
    svg.selectAll(".bar")
        .data(chartData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => x(d.name))
        .attr("y", (d) => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", (d) => innerHeight - y(d.value))
        .attr("fill", "#4F46E5")

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("font-family", fontFamily)
        .style("font-size", "12px")

    // Add y-axis
    svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("font-family", fontFamily)
        .style("font-size", "12px")

    // Add a resize function for responsive behavior
    const resize = () => {
        // Update width and height
        const newWidth = container.node().clientWidth
        const newHeight = container.node().clientHeight
        const newInnerWidth = newWidth - margin.left - margin.right
        const newInnerHeight = newHeight - margin.top - margin.bottom

        // Update SVG dimensions
        container
            .select("svg")
            .attr("width", newWidth)
            .attr("height", newHeight)

        // Update scales
        x.range([0, newInnerWidth])
        y.range([newInnerHeight, 0])

        // Update bars
        svg.selectAll(".bar")
            .attr("x", (d) => x(d.name))
            .attr("y", (d) => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", (d) => newInnerHeight - y(d.value))

        // Update axes
        svg.select(".x-axis")
            .attr("transform", `translate(0,${newInnerHeight})`)
            .call(d3.axisBottom(x))

        svg.select(".y-axis").call(d3.axisLeft(y))
    }

    // Return an object with methods that can be called by the parent component
    return {
        resize,
        update: (newData) => {
            // Update data and redraw
            const updatedData = newData || chartData

            // Update scales
            x.domain(updatedData.map((d) => d.name))
            y.domain([0, d3.max(updatedData, (d) => d.value)]).nice()

            // Update bars with transition
            const bars = svg.selectAll(".bar").data(updatedData)

            // Exit
            bars.exit().remove()

            // Update
            bars.transition()
                .duration(500)
                .attr("x", (d) => x(d.name))
                .attr("y", (d) => y(d.value))
                .attr("width", x.bandwidth())
                .attr("height", (d) => innerHeight - y(d.value))

            // Enter
            bars.enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", (d) => x(d.name))
                .attr("y", innerHeight)
                .attr("width", x.bandwidth())
                .attr("height", 0)
                .attr("fill", "#4F46E5")
                .transition()
                .duration(500)
                .attr("y", (d) => y(d.value))
                .attr("height", (d) => innerHeight - y(d.value))

            // Update axes
            svg.select(".x-axis")
                .transition()
                .duration(500)
                .call(d3.axisBottom(x))

            svg.select(".y-axis")
                .transition()
                .duration(500)
                .call(d3.axisLeft(y))
        },
    }
}
