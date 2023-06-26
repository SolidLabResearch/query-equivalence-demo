import { IncomingMessage, ServerResponse } from "http";
import { QueryRegistry } from "../service/QueryRegistry";
export class GETHandler {
    public static async handle(req: IncomingMessage, res: ServerResponse, minutes: number, solid_server_url: string, query_registry: QueryRegistry, endpoint_queries: any) {
        switch (req.url) {
            case '/':
                res.writeHead(200, { 'Content-Type': 'text/html' });
                break;
            case '/query_one':
                query_registry.register_query(endpoint_queries.get_query('query_one'), minutes, solid_server_url, query_registry);
                res.write(`Query one is registered \n`);
                break;
            case '/query_two':
                query_registry.register_query(endpoint_queries.get_query('query_two'), minutes, solid_server_url, query_registry);
                res.write(`Query two is registered \n`);
                break;
            case '/query_three':
                query_registry.register_query(endpoint_queries.get_query('query_three'), minutes, solid_server_url, query_registry);
                res.write(`Query three is registered \n`);
                break;
            case '/query_four':
                query_registry.register_query(endpoint_queries.get_query('query_four'), minutes, solid_server_url, query_registry);
                res.write(`Query four is registered \n`);
                break;
            case '/query_five':
                query_registry.register_query(endpoint_queries.get_query('query_five'), minutes, solid_server_url, query_registry);
                res.write(`Query five is registered \n`);
                break;
            case '/query_six':
                query_registry.register_query(endpoint_queries.get_query('query_six'), minutes, solid_server_url, query_registry);
                res.write(`Query six is registered \n`);
            default:
                break;
        }
    }
}