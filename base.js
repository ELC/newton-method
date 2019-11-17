var parameters = {
    target: '#graph',
    data: [],
    width: 500,
    height: 370,
    grid: true,
    yAxis: {
        domain: [-0.5, 4]
    },
    xAxis: {
        domain: [-2.5, 2.5]
    }
};

function plot_event(event) {
    if (event.keyCode === 13) {
        plot();
    }
}

function plot() {

    var start = performance.now();

    // Cleaning
    parameters.data = [];
    document.querySelector("#results").innerHTML = "";
    document.querySelector("#graph").innerHTML = "";
    document.querySelector("#exec-time").innerHTML = "";

    // Getting Elements
    var f = document.querySelector("#function").value.toLowerCase();
    var guess_x = document.querySelector("#guess_x").value;
    var iterations = document.querySelector("#iterations").value;

    // Parsing Function
    f = f.replace(/pi/g, 3.1415);
    f = f.replace(/[e]/g, 2.7182);
    var fun = nerdamer(f);
    var derivative = nerdamer.diff(fun);

    // Plot Function
    parameters.data.push({
        'fn': fun.text(),
        'graphType': 'polyline'
    });

    // Plot Guess Point
    var point = {
        'x': guess_x
    };

    var colors = ['darkred', 'darkgreen', 'darkcyan', 'goldenrod', 'hotpink', 'saddlebrown', 'darkslateblue'];

    var iteration_description = "";

    for (var i = 0; i < iterations; i++) {
        var iteration_color = colors[i];
        var iteration_alpha = 0.6;

        guess_x = point.x;

        var guess_x_point = [guess_x, 0];

        var function_value = fun.evaluate(point).text();

        var guess_point = [guess_x, function_value];

        var points = [guess_x_point, guess_point];
        parameters.data.push(create_points(points, iteration_color, iteration_alpha));

        var segment = create_segment(points, iteration_color, iteration_alpha);
        parameters.data.push(segment);


        var slope = derivative.evaluate(point).text();
        var tangent = slope + "* (x - " + guess_x + ") + " + function_value;
        parameters.data.push(create_function(tangent, iteration_color, iteration_alpha));

        point.x = nerdamer(nerdamer.solveEquations(tangent + "= 0", 'x').toString()).evaluate().text();
        parameters.data.push(create_points([
            [point.x, 0]
        ], iteration_color, iteration_alpha));

        var x_value = Number(parseFloat(point.x).toFixed(3));
        var y_value = Number(parseFloat(fun.evaluate(point).text()).toFixed(3));

        var iteration_text = `<span class="iteration" style="color: ${iteration_color}">Iteration ${i + 1}: </span>`;
        iteration_description += `${iteration_text} x=${x_value} f(x)=${y_value} <br>`;
    }

    var elapsed_time = 0;
    var end_calulation = performance.now();
    elapsed_time = Number((end_calulation - start).toFixed(0));
    document.querySelector("#exec-time").innerHTML += `<span>Calc. Time: <strong>${elapsed_time}ms</strong> <br></span>`;

    document.querySelector("#results").innerHTML = iteration_description;
    functionPlot(parameters);

    var end_ploting = performance.now();
    elapsed_time = Number((end_ploting - end_calulation).toFixed(0));
    document.querySelector("#exec-time").innerHTML += `<span>Ploting Time: <strong>${elapsed_time}ms</strong> <br></span>`;
    elapsed_time = Number((end_ploting - start).toFixed(0));
    document.querySelector("#exec-time").innerHTML += `<span>Total Time: <strong>${elapsed_time}ms</strong> <br></span>`;
}

function test_function(fun, guess_point, iterations) {
    document.querySelector("#function").value = fun;
    document.querySelector("#guess_x").value = guess_point;
    document.querySelector("#iterations").selectedIndex = iterations - 1;
    plot();
}

function create_function(fun, color, alpha) {
    return {
        'fn': fun,
        'color': color,
        'graphType': 'polyline',
        'attr': {
            'opacity': alpha
        }
    };
}

function create_points(points, color, alpha) {
    return {
        points: points,
        fnType: 'points',
        graphType: 'scatter',
        color: color,
        attr: {
            'r': 2,
            'opacity': alpha
        }
    };
}

function create_segment(points, color, alpha) {
    return {
        points: points,
        fnType: 'points',
        graphType: 'polyline',
        color: color,
        attr: {
            'r': 2,
            'opacity': alpha
        }
    };
}