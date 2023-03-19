import {app} from "./settings";
import {runDb} from "./db/db";

const port = process.env.PORT || 5000;

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`App started at ${port} port!`)
    })
}

startApp()

