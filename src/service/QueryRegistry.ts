import { Logger, ILogObj } from "tslog";
import { is_equivalent } from "rspql-query-equivalence";

export class QueryRegistry {
    registered_queries: Map<number, string>;
    executed_queries: any[];
    future_queries: any[];
    executing_queries: any[];
    query_count: number;
    parser: any;
    logger: Logger<ILogObj>;

    /**
     * Creates an instance of QueryRegistry.
     * @memberof QueryRegistry
     */
    constructor() {
        /**
         * Map of registered queries which are the queries without any analysis by the QueryRegistry but only registered.  
        */
        this.registered_queries = new Map();
        /**
         * Array of executing queries which were unique as compared to all the existing queries in the QueryRegistry. 
         */
        this.executing_queries = [];
        this.executed_queries = [];
        this.future_queries = [];
        this.query_count = 0;
        this.logger = new Logger();
    }
    /**
     *  Register a query in the QueryRegistry.
     *
     * @param {string} rspql_query
     * @return {*} 
     * @memberof QueryRegistry
     */

    register_query(rspql_query: string, latest_minutes_to_retrieve: number, solid_server_url: string, query_registry: QueryRegistry) {
        if (query_registry.add_query_in_registry(rspql_query)) {
            console.log(`The query you have registered is not already executing.`);
        }
        else {
            this.logger.debug(`The query you have registered is already executing.`);
        }

    }

    add_query_in_registry(rspql_query: string) {
        this.registered_queries.set(this.query_count, rspql_query);
        this.query_count++;
        if (this.checkUniqueQuery(rspql_query)) {
            /*
            The query you have registered is already executing.
            */
            return false;
        }
        else {
            /*
            The query you have registered is not already executing.
            */
            this.add_to_executing_queries(rspql_query);
            return true;
        }
    }

    /**
     * Add a query to the executing queries.
     *
     * @param {string} query
     * @memberof QueryRegistry
     */
    add_to_executing_queries(query: string) {
        this.executing_queries.push(query);
    }

    /**
     * Checking if the query is unique or if it is isomorphic with an already executing query.
     *
     * @param {string} query
     * @return {*} 
     * @memberof QueryRegistry
     */
    checkUniqueQuery(query: string) {
        let registered_queries = this.get_executing_queries();
        let queryArray: any[] = [];
        let is_similar: boolean = false;
        registered_queries.forEach((value, key) => {
            queryArray.push(value);
        })
        if (queryArray.length > 1) {
            for (let counter = 0; counter < queryArray.length; counter++) {
                if (is_equivalent(query, queryArray[counter])) {
                    is_similar = true;
                }
            }

        }
        return is_similar;
    }


    get_executing_queries() {
        return this.executing_queries;
    }

    get_registered_queries() {
        return this.registered_queries;
    }
}