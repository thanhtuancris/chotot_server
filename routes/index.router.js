const dataRouter = require("./data.router.js")
const typeRouter = require("./type.router")
const cityRouter = require("./city.router")
// const typeRouter = require("./type.router")
function routes(app) {
    app.use('/api', dataRouter);
    app.use('/api', typeRouter);
    app.use('/api', cityRouter);
   
}
module.exports = routes;