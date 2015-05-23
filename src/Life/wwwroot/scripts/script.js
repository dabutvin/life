var rows = 40,
    cols = 50,
    cache = new Array(rows);

for (var row = 0; row < rows; row++) {
    cache[row] = new Array(cols);

    for (var col = 0; col < cols; col++) {
        cache[row][col] = 0; // all dead
    }
}

var stepsEnabled = false;
setInterval(doit, 1000);

$(document).ready(function () {
    var container = $("#container");
    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            container.append("<div class='box' data-row='" + row + "' data-col='" + col + "'></div>");
        }
        container.append("<div></div>")
    }
    $(".box").on("click", function () {
        $(this).toggleClass("alive");
        cache[$(this).data("row")][$(this).data("col")] = 1;
    });

    $(".start").on("click", function (e) {
        e.preventDefault();
        doit();
        stepsEnabled = true;
    });

    $(".stop").on("click", function (e) {
        e.preventDefault();
        stepsEnabled = false;
    });
});

function doit() {
    if (stepsEnabled) {
        // snapshot
        var snapshotCache = cache.map(function (arr) {
            return arr.slice(0);
        });

        for (var row = 0; row < rows; row++) {
            for (var col = 0; col < cols; col++) {
                if (snapshotCache[row][col]) {
                    // alive
                    var matched = numNeighborsAlive(row, col, snapshotCache);
                    if (matched !== 3) {
                        cache[row][col] = 0;
                    }
                } else {
                    // dead - is there 3 neighbors?

                    var matched = numNeighborsAlive(row, col, snapshotCache);
                    if (matched > 2) {
                        cache[row][col] = 1;
                    }
                }
            }
        }

        // update after we're done
        updateUI();
    }
};

function updateUI() {
    // clear board
    $(".box").removeClass("alive");

    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            if (cache[row][col]) {
                $(".box[data-row='" + row + "'][data-col='" + col + "']").addClass("alive");
            }
        }
    }
};

function numNeighborsAlive(row, col, data) {
    var matched = 0;

    if (row < rows - 1) {
        if (data[row + 1][col]) {
            matched++;
        }
    }

    if (col < cols - 1) {
        if (data[row][col + 1]) {
            matched++;
        }
    }

    if (row > 0) {
        if (data[row - 1][col]) {
            matched++;
        }
    }

    if (row > 0 && col < cols - 1) {
        if (data[row - 1][col + 1]) {
            matched++;
        }
    }

    if (col > 0) {
        if (data[row][col - 1]) {
            matched++;
        }
    }

    if (col > 0 && row < rows - 1) {
        if (data[row + 1][col - 1]) {
            matched++;
        }
    }

    if (row > 0 && col > 0) {
        if (data[row - 1][col - 1]) {
            matched++;
        }
    }

    if (row < rows - 1 && col < cols - 1) {
        if (data[row + 1][col + 1]) {
            matched++;
        }
    }

    return matched;
};