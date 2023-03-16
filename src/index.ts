import {app} from "./settings";

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`App started at ${port} port!`)
});