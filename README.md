# Query Equivalence Demo

This repository is to demonstrate the equivalence relation between two RSPQL queries registered in the query registry of the [solid stream aggregator](https://github.com/argahsuknesib/solid-stream-aggregator) for the [SolidLabResearch Challenge 106](https://github.com/SolidLabResearch/Challenges/issues/106)

### Prerequisites

**NOTE** : The community solid server works only with the LTS versions of NodeJS.

- Clone the repository.
  `https://github.com/argahsuknesib/query-equivalence-demo.git`
- Install the dependencies from the root of the repository.
  `npm install`

## Setup

To spin up the Solid pods, run the following command from the root of the repository.

`npm run start-solid-server`

In this demonstration, we will not aggregate the data, rather focus on the equivalence of a newly registered query with an existing registered query. In case you are interested in demonstration of the aggregation of the data you can checkout [Solid Stream Aggregator Demo](https://github.com/SolidLabResearch/ssa-demo).

The queries in the aggregator are registered in [RSPQL](https://www.igi-global.com/article/rsp-ql-semantics/129761) syntax.

## Demonstration Steps

1. Start the aggregator's server with,

```ts
npm run start aggregation
```

This will start the aggregator's server on port 8080.

Now for the queries,

```ts
let query_one = `PREFIX saref: <https://saref.etsi.org/core/> 
        PREFIX dahccsensors: <https://dahcc.idlab.ugent.be/Homelab/SensorsAndActuators/>
        PREFIX : <https://rsp.js/>
        REGISTER RStream <output> AS
        SELECT (AVG(?o) AS ?averageHR1)
        FROM NAMED WINDOW :w1 ON STREAM <http://localhost:3000/dataset_participant1/data/> [RANGE 10 STEP 2]
        WHERE{
            WINDOW :w1 { ?s saref:hasValue ?o .
                         ?s saref:relatesToProperty dahccsensors:wearable.bvp .}
        }`;
```

and for

```ts
let query_two = `
        PREFIX saref: <https://saref.etsi.org/core/> 
        PREFIX dahccsensors: <https://dahcc.idlab.ugent.be/Homelab/SensorsAndActuators/>
        PREFIX : <https://rsp.js/>
        REGISTER RStream <output> AS
        SELECT (AVG(?timestamp) AS ?averageTimestamp)
        FROM NAMED WINDOW :w1 ON STREAM <http://localhost:3000/dataset_participant1/data/> [RANGE 10 STEP 2]
        WHERE{
            WINDOW :w1 { ?s saref:hasTimestamp ?timestamp .}
        }`;
```

These queries are on the same data stream source, but the basic graph patterns are not isomorphic. Therefore, the aggregator will register both the queries.

To confirm this,

2. Do a request to first query's endpoint with,

   ```bash
   curl http://localhost:8080/query_one
   ```

3. and then on second query's endpoint with,

   ```bash
   curl http://localhost:8080/query_two
   ```

Now to demonstrate the equivalence of the queries, we take two queries which are isomorphic but have different variable names.

So for the queries,

```ts
let query_three = `
        PREFIX saref: <https://saref.etsi.org/core/> 
        PREFIX dahccsensors: <https://dahcc.idlab.ugent.be/Homelab/SensorsAndActuators/>
        PREFIX : <https://rsp.js/>
        REGISTER RStream <output> AS
        SELECT (AVG(?o) AS ?averageHR1)
        FROM NAMED WINDOW :w1 ON STREAM <http://localhost:3000/dataset_participant1/data/> [RANGE 10 STEP 2]
        WHERE{
            WINDOW :w1 { ?s saref:hasValue ?o .
                         ?s saref:relatesToProperty dahccsensors:wearable.heartRate .}
        }
`;
```

and,

```ts
let query_four = `PREFIX saref: <https://saref.etsi.org/core/> 
        PREFIX dahccsensors: <https://dahcc.idlab.ugent.be/Homelab/SensorsAndActuators/>
        PREFIX : <https://rsp.js/>
        REGISTER RStream <output> AS
        SELECT (AVG(?o) AS ?averageHR1)
        FROM NAMED WINDOW :w1 ON STREAM <http://localhost:3000/dataset_participant1/data/> [RANGE 10 STEP 2]
        WHERE{
            WINDOW :w1 {
                         ?subject saref:relatesToProperty dahccsensors:wearable.heartRate .
                        ?subject saref:hasValue ?object . }
        }`;
```

These queries are on the same data stream source, and the basic graph patterns are isomorphic. Therefore, the aggregator will register only one of the queries.

To confirm this,

4. Do a request to the third query's endpoint with,

   ```bash
   curl http://localhost:8080/query_three
   ```
5. and then on fourth query's endpoint with,

   ```bash
   curl http://localhost:8080/query_four
   ```
On registering the fourth query, the aggregator will give a console on the terminal, that the registered query is already running.


## License

This code is copyrighted by [Ghent University - imec](https://www.ugent.be/ea/idlab/en) and released under the [MIT Licence](./LICENCE)

## Contact

For any questions, please contact [Kush](mailto:kushagrasingh.bisen@ugent.be).
