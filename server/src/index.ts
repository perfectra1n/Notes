import startTrilium = require("./www");

startTrilium({
    setupCompleteCallback: (res) => {
        res.redirect('.');
    }
});