module.exports = ({ mode }) => {
    if (mode === "real") {
        return () => {}
    }

    if (mode === "recordActionsInDb") {
        return () => {}
    }

    if (mode === "local") {
        return () => {}
    }
}
