import { IncomingMessage, ServerResponse } from "http";
import { QueryRegistry } from "../service/QueryRegistry";
import fs from 'fs';
export class GETHandler {
    public static async handle(req: IncomingMessage, res: ServerResponse, minutes: number, solid_server_url: string, query_registry: QueryRegistry, endpoint_queries: any) {
        switch (req.url) {
            case '/':
                const file = fs.readFileSync('dist/static/index.html');
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(file.toString());
                break;
            case '/query_one':
                query_registry.register_query(endpoint_queries.get_query('query_one'), minutes, solid_server_url, query_registry);
                break;
            case '/query_two':
                query_registry.register_query(endpoint_queries.get_query('query_two'), minutes, solid_server_url, query_registry);
                break;
            case '/query_three':
                query_registry.register_query(endpoint_queries.get_query('query_three'), minutes, solid_server_url, query_registry);
                break;
            case '/query_four':
                query_registry.register_query(endpoint_queries.get_query('query_four'), minutes, solid_server_url, query_registry);
                break;
            default:
                break;
        }
    }
}