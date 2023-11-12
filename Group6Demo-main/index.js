const app = require("./server");

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Listening on PORT ${port}`)
})