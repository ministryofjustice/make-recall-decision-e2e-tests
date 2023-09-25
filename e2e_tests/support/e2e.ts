cy.on("uncaught:exception", (e, runnable) => {
    console.log("error", e)
    console.log("runnable", runnable)
    console.log("error", e.message)
    return false
});