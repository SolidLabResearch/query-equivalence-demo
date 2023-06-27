# Query Equivalence Demo

This repository is to demonstrate the equivalence relation between two RSPQL queries registered in the query registry of the [solid stream aggregator](https://github.com/argahsuknesib/solid-stream-aggregator) for the [SolidLabResearch Challenge 106](https://github.com/SolidLabResearch/Challenges/issues/106). A package called [rspql-query-equivalence](https://github.com/argahsuknesib/rspql-query-equivalence) was developed to check the equivalence of the queries. The package is used in the aggregator and will be used in the demonstration.

### Prerequisites

**NOTE** : The community solid server works only with the LTS versions of NodeJS.

- Clone the repository.
  `https://github.com/argahsuknesib/query-equivalence-demo.git`
- Install the dependencies from the root of the repository.
  `npm install`

## Setup

To spin up the Solid pods, run the following command from the root of the repository.

`npm run start-solid-server`

In this demonstration, we will not aggregate the data, but rather focus on the equivalence of a newly registered query with an existing registered query. In case you are interested in the demonstration of the aggregation of the data you can check out [Solid Stream Aggregator Demo](https://github.com/SolidLabResearch/ssa-demo).

The queries in the aggregator are registered in [RSPQL](https://www.igi-global.com/article/rsp-ql-semantics/129761) syntax.

## Demonstration Steps

1. Start the aggregator's server with,

```ts
npm run start demo
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

These queries are on the same data stream source, but the basic graph patterns are not isomorphic. Therefore, the aggregator will register both queries.

To confirm this, we will do curl requests to the endpoints of the queries.

2. Do a curl request to first query's endpoint with,

   ```bash
   npm run query-one
   ```

   You will obtain a response.
   ```bash
   The query you have registered is not already executing.
   ```

3. and then on the second query's endpoint with,

   ```bash
   npm run query-two
   ```

   You will obtain a response.
    ```bash
    The query you have registered is not already executing.
    ```

Now to demonstrate the equivalence of the queries, we take two queries that are isomorphic but have different variable names.

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
   npm run query-three
   ```
   You will obtain a response.
   ```bash
   The query you have registered is not already executing. 
   ```

5. and then on the fourth query's endpoint with,

   ```bash
   npm run query-four
   ```

   You will obtain a response.
   ```bash
   The query you have registered is already executing.
   ```

On registering the fourth query, the aggregator will give a console on the terminal, that the registered query is already running.

6. Try re-registering the queries with any of the commands above, and confirm that the queries are the same and registered already.

Let's consider if the basic graph patterns of the queries are isomorphic but the data stream sources are different. In this case, the aggregator will register both queries. To demonstrate this, we take the queries from different sources,

```ts
let query_five = ` 
        PREFIX saref: <https://saref.etsi.org/core/> 
        PREFIX dahccsensors: <https://dahcc.idlab.ugent.be/Homelab/SensorsAndActuators/>
        PREFIX : <https://rsp.js/>
        REGISTER RStream <output> AS
        SELECT (AVG(?object) AS ?averageHR1)
        FROM NAMED WINDOW :w1 ON STREAM <http://localhost:3000/dataset_participant1/data/> [RANGE 10 STEP 2]
        WHERE{
            WINDOW :w1 {
                        ?subject saref:relatesToProperty dahccsensors:wearable.Accelerometer .
                        ?subject saref:hasValue ?object . }
        }`;
```

and,

```ts
let query_six = `
        PREFIX saref: <https://saref.etsi.org/core/> 
        PREFIX dahccsensors: <https://dahcc.idlab.ugent.be/Homelab/SensorsAndActuators/>
        PREFIX : <https://rsp.js/>
        REGISTER RStream <output> AS
        SELECT (AVG(?object) AS ?averageHR1)
        FROM NAMED WINDOW :w1 ON STREAM <http://localhost:3000/dataset_participant2/data/> [RANGE 10 STEP 2]
        WHERE{
            WINDOW :w1 {
                        ?subject saref:relatesToProperty dahccsensors:wearable.Accelerometer .
                        ?subject saref:hasValue ?object . }
        }`;
```

To confirm this,

7. Do a request to the fifth query's endpoint with,

   ```bash
   npm run query-five
   ```

   You will obtain a response.
   ```bash
   The query you have registered is not already executing.
   ```

8. and then on the sixth query's endpoint with,

   ```bash
   npm run query-six
   ```
   You will obtain a response.
   ```bash
   The query you have registered is not already executing.
   ```

As you can see, the aggregator will register both queries.


### Conclusion

The aggregator is now able to do optimisation if the basic graph patterns of the queries are isomorphic and the data stream sources are the same. In future, the work will be extended to support query containment as well as sharing of intermediate RDF result sharing between data streams. 

### Lessons Learned

Isomorphism of the basic graph patterns is a neccessary but not a sufficient condition for query optimisation. In future, The queries needs to be described in a more declarative manner to be able to do reasoning to determine query containment relation.

## License

This code is copyrighted by [Ghent University - imec](https://www.ugent.be/ea/idlab/en) and released under the [MIT Licence](./LICENCE)

## Contact

For any questions, please contact [Kush](mailto:kushagrasingh.bisen@ugent.be).
