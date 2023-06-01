import {AggregatorInstantiator} from "../service/AggregatorInstantiator";
import {AggregationLDESPublisher} from "../service/AggregationLDESPublisher";
import {SPARQLToRSPQL} from "../service/SPARQLToRSPQL";
import { QueryRegistry } from "../service/QueryRegistry";
import { EndpointQueries } from "./EndpointQueries";
const http = require('http');
const express = require('express');
const cors = require('cors');
const websocket = require('websocket');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const { Parser } = require('n3');

export class HTTPServer {
    private readonly minutes: number;
    private readonly serverURL: string;
    private aggregationResourceList: any[] = [];
    private resourceListBatchSize: number = 500;
    private query_registry: QueryRegistry;
    public endpoint_queries: EndpointQueries;  
    constructor(port: number, minutes: number, serverURL: string) {
        this.minutes = minutes;
        this.serverURL = serverURL;
        const app = express();
        this.endpoint_queries = new EndpointQueries(this.minutes);
        this.query_registry = new QueryRegistry();
        let publisher = new AggregationLDESPublisher();
        app.server = http.createServer(app);
        app.use(cors({
            exposedHeaders: '*',
        }));

        app.use(express.urlencoded());
        const wss = new websocket.server({
            httpServer: app.server,
        });

        app.server.listen(port, () => {
            console.log(`Server started on port http://localhost:${app.server.address().port}`);
        });


        app.get('/query_one', (req: any, res: any) => {
            let query_one:string = this.endpoint_queries.get_query('query_one') as string;
            this.query_registry.register_query(query_one, this.minutes, this.serverURL, this.query_registry);
        });


        app.get('/query_two', (req: any, res: any) => {
            let query_two:string = this.endpoint_queries.get_query('query_two') as string;
            this.query_registry.register_query(query_two, this.minutes, this.serverURL, this.query_registry);
        });

        app.get('/query_three', (req: any, res: any) => {
            let query_three:string = this.endpoint_queries.get_query('query_three') as string;
            this.query_registry.register_query(query_three, this.minutes, this.serverURL, this.query_registry);
        });

        app.get('/query_four', (req: any, res: any) => {
            let query_four:string = this.endpoint_queries.get_query('query_four') as string;
            this.query_registry.register_query(query_four, this.minutes, this.serverURL, this.query_registry);
        });

        wss.on('request', async (request: any) => {
            let connection = request.accept('echo-protocol', request.origin);
            console.log('Connection accepted');
            connection.on('message', async (message: any) => {
                if (message.type === 'utf8') {
                    let value = message.utf8Data;
                    eventEmitter.emit('AggregationEvent$', value);
                }
            });

            connection.on('close', function (reasonCode: any, description: any) {
                console.log('Peer ' + connection.remoteAddress + ' disconnected.');
            });

            eventEmitter.on('AggregationEvent$', (value: any) => {
                const parser = new Parser({ 'format': 'N-Triples' });
                const store = parser.parse(value);
                this.aggregationResourceList.push(store);
                if (this.aggregationResourceList.length == this.resourceListBatchSize) {
                    if (!publisher.initialised) {
                        publisher.initialise();
                        publisher.initialised = true;
                    }
                    publisher.publish(this.aggregationResourceList);
                    this.aggregationResourceList = [];
                }
                if (this.aggregationResourceList.length < this.resourceListBatchSize) {
                    if (!publisher.initialised) {
                        publisher.initialise();
                        publisher.initialised = true;
                    }
                    publisher.publish(this.aggregationResourceList);
                    this.aggregationResourceList = [];
                }
                if (this.aggregationResourceList.length === 0) {
                    console.log('No data to publish');
                }
            });
            eventEmitter.on('close', () => {
                console.log('Closing connection');
            });
        });
    }

}
