import startTrilium = require("./www");

startTrilium({
    setupCompleteCallback: (res) => {
        res.redirect('.');
    },
    
    getInitialTheme() {
        // default based on the poll in https://github.com/zadam/trilium/issues/2516
        return "dark";
    }
});