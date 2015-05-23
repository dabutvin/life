var rows = 40,
    cols = 40,
    cache = new Array(rows);

for (var row = 0; row < rows; row++) {
    cache[row] = new Array(cols);

    for (var col = 0; col < cols; col++) {
        cache[row][col] = 0; // all dead
    }
}

$(document).ready(function () {
    var container = $(".row");
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
        //$(".box").off("click");
        doit();
        setInterval(doit, 1000);
    });
});

function doit() {
    // snapshot
    var localCache = cache.slice(0);

    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            if (localCache[row][col]) {
                // alive
                var matched = numNeighborsAlive(row, col, localCache);
                if (matched !== 3) {
                    localCache[row][col] = 0;
                }
            } else {
                // dead - is there 3 neighbors?

                var matched = numNeighborsAlive(row, col, localCache);
                if (matched > 2) {
                    localCache[row][col] = 1;
                }
            }
        }
    }

    // update after we're done
    cache = localCache;
    updateUI();
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