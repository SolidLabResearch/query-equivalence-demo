import { HTTPServer } from "./server/HTTPServer";

const program = require('commander');

program
    .version('0.0.1')
    .description('Aggregating LDES streams from a Solid Pod.')
    .name('solid-stream-aggregator')

program
    .command('aggregation')
    .description('Starting the aggregation service.')
    .option(
        '-p, --port <port>',
        'The port of the REST server',
        '8080'
    )
    .option(
        '-s, --minutes <minutes>',
        'The last x minutes to aggregate',
        '30'
    )
    .option(
        '-ss --SolidServer <SolidServer>',
        'URL of the Solid server to use',
        'http://localhost:3000/'
    )
    .action((options: any) => {
        new HTTPServer(options.port, options.minutes, options.SolidServer);
    });


program.parse();
