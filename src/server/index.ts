import * as express from 'express';
import * as ajv from 'ajv';

import Kroger from 'kroger/dist';
import Database from './database';
import { router } from './controllers/Router';

console.log("Setting up");

var kroger = new Kroger("https://www.fredmeyer.com/");

var database = new Database();

let app = express();
let ajvValidator = ajv();
let expressRouter = router(database, ajvValidator);

app.use(express.json());
app.use("/", expressRouter);

app.listen(8000);

async function test() {
    await kroger.setUp();

    console.log(await kroger.search("ice cream and cookies", "00664", "701"));
    // await kroger.productDetails(["0000000004305","0000000004048","0000000094048","0002840006404","0007143001741","0003338314681","0005200013224","0081829001271","0081829001227","0001111050645","0001111001698","0007047000321","0001299322125"]);

    // var authenticated = await kroger.authenticate("username", "password");
    // if(authenticated) {
    //     console.log("Sucessfully authenticated");
    // } else {
    //     console.log("Authentication failed");
    // }
    // await kroger.delay(1000);
    // var orders = await kroger.receiptList();
    // await kroger.delay(300);
    // console.log(orders[0]);

    // var tests = await kroger.receiptData(orders[0]);
    // console.log(tests);
    // for(var item of tests.items) {
    //     console.log(item.detail.description);
    // }
    // await kroger.cleanUp();
}

// test();