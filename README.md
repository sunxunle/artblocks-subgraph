# Art Blocks Subgraph
[![GitPOAPs](https://public-api.gitpoap.io/v1/repo/ArtBlocks/artblocks-subgraph/badge)](https://www.gitpoap.io/gh/ArtBlocks/artblocks-subgraph)

The Art Blocks subgraph definitions for The Graph.

For more information on Art Blocks subgraph schema and queries, see the [Art Blocks documentation](https://docs.artblocks.io/creator-docs/art-blocks-api/queries/) website.

## Initial Setup

If you haven't already connected your Github account to The Graph's account system, please do so by following the [instructions here](https://thegraph.com/docs/en/hosted-service/deploy-subgraph-hosted/).

**Art Blocks Internal Devs:** Ensure that you connect your account _and_ set the appropriate auth-token for Art Blocks using the `graph auth --product hosted-service <ACCESS_TOKEN>` command. This will enable you to deploy our subgraphs.

<img width="1433" alt="Screen Shot 2022-02-22 at 1 01 20 PM" src="https://user-images.githubusercontent.com/8602661/155210396-e211b2a8-d386-4a49-96ce-8bb66c2ac07f.png">

Please take care to ensure that you are copy-pasting the auth-token for _Art Blocks_ and not for your personal account.

## Subgraph Deployments

### Testnet (Sepolia)

Sepolia subgraph deployments can be performed on any day of the working week, other than Friday, in order to avoid causing an outage on https://artist-staging.artblocks.io going into a weekend, when the team will not be readily available to look into it.

For Sepolia subgraph deployments, we deploy directly to a hosted subgraph service provided by The Graph, which takes ~20 minutes to sync.

### Mainnet

Mainnet subgraph deployments should **only** be done on Wednesdays, barring the need to push out a hotfix to resolve an outage or related breaking issue, in order to avoid adding to the risk of creating an outage on a drop-day.

For mainnet subgraph deployments, we deploy first to the hosted subgraph service provided by The Graph, which takes ~36 hours to sync, and then proceed to deploying to the decentralized Graph network if all is confirmed to be working as intended, which takes an additional ~12 hours to sync.

## Decentralized Graph Network Subgraph Publish Checklist

1. Deploy any contracts to be indexed
   - Please see [ArtBlocks/artblocks-contracts](https://github.com/ArtBlocks/artblocks-contracts) for more info on contract deployment.
2. Update the corresponding `config/` file for the desired network (e.g. `mainnet.json` for mainnet EVM) to include the newly deployed contracts
   - Verify that contract addresses added are for the correct contracts by checking Etherscan at the contract address
   - When adding a new contract address to the config file, make sure you are adding it under the appropriate contract grouping. These contract groupings map to values used in the `subgraph.template.yaml` and will ultimately impact what ABIs/handlers get used with the provided contracts in the config.
3. Run `yarn prepare:{NETWORK}`, (e.g. `yarn prepare:mainnet` for mainnet) to generate subgraph manifest (subgraph.yaml)
4. Manually look over the generated subgraph manifest to make sure it is correct
5. Run `yarn codegen` to generate contract mappings
6. Deploy subgraph to subgraph studio `yarn deploy:studio`
7. Wait for subgraph to sync fully in subgraph studio (~36hrs)
8. **Art Blocks Devs:** Verify that entities/fields expected to be unchanged match the previous deployment

   - Run the subgraph-comparison.ts script in the internal artblocks monorepo. When prompted input the url of the new subgraph deployment.
   - The new URL will be `https://gateway.thegraph.com/api/[api key]/deployments/id/[new deployment id]`. The new deployment id can be found on the Graph Explorer overview page for our subgraph (https://thegraph.com/explorer/subgraph?id=0x3c3cab03c83e48e2e773ef5fc86f52ad2b15a5b0-0&view=Overview). Make sure to select the new version.
   - <img width="446" alt="deployment id" src="https://user-images.githubusercontent.com/1716299/144694801-2f9f3708-0b6f-4101-83fa-0997a3d876a0.png">

9. **Art Blocks Devs:** Make sure Hasura `ARTBLOCKS_SUBGRAPH_URL` environment variable is pointing to the previous deployment url. If it is pointed to the subgraph id url, things will break because no indexers will have picked up the updated subgraph but the subgraph id url will point to it anyway
10. Wait for the published subgraph to sync (~12hrs)
11. **Art Blocks Devs:** Update the Hasura `ARTBLOCKS_SUBGRAPH_URL` environment variable to be the new subgraph deployment url (`https://gateway.thegraph.com/api/<API KEY>/deployments/id/<DEPLOYMENT ID>`)
12. **Art Blocks Devs:** Reload remote schema and ensure new subgraph URL is working
13. **Art Blocks Devs:** Verify that the frontend is working as expected
14. **Art Blocks Devs:** If the newly published changes include indexing any new contracts run the sync-from.ts script in the artblocks repo. When prompted enter the list of added contract addresses separated by spaces and the unix timestamp from which to sync from (use the time the earliest deployed contract was deployed).

## Testing

To run unit tests using [Matchstick](https://thegraph.com/docs/en/developer/matchstick) (Graph protocol's recommended testing framework), simply run `yarn test`.

**Testing pattern:** unit tests in a `.test.ts` file will mock a Solidity call or event using newMockCal(). Additional mocks are needed for any Solidity function calls (say, contract.projectDetails()). Next, make a call to a handler in a `mapping.ts` file to create/edit/delete a GraphQL entity in a local in-memory store. Finally, `assert()` against the entity to confirm your logic ran as expected.

Logging utils can be imported from matchstick-as and used to:

1. Print all GraphQL entities currently saved in the local store (`logStore()`)
2. Print from a given line and print a stored val (`log.info("user_message"{}’, [user_val.toString()])`)
   Note: - the array is required as a second argument with or without a value to print. - Curly braces after the logged messages are only required to interpolate a printed var. - Multiple vars can be printed like so: (`log.info("testing..."{}{}{}’, [val1.toString(), val2.toString(), val3.toString()])`)

To write to & read from the in-memory data store, use .save() and .load(). You can delete and re-build the store between tests using clearStore().

`derivedFrom` GraphQL entity fields cannot be tested by Matchstick (v0.2.2). These are added at query time.

**Matchstick error handling "gotcha's" -**

- Test assertions can still "pass" with a green checkmark... with broken logic in your code (without creating & asserting against a GraphQL entity, for example). To fix, write assertions that will fail first with an incorrect value --> then once your mocks & setup are correct, update your assert. value to pass to confirm your call handler is covered. You can also use logStore() to confirm your entity was created/modified successfully - Type conversion is a MUST, especially when mocking the Solidity call inputValues. Matchstick won't always flag a type mismatch. Instead, the test might pass, or break with no verbose error message. You may want to set logging breakpoints throughout your test to see which are missed by the unit test breaking. Try logging your inputValues in your mapping file to confirm the type conversion was successful- if not, your log message will print but your val will be missing.

## Errors not caught by Testing

If a handler triggers a contract call, that contract's abi needs to be in the subgraph manifest entry. This will not be caught until the subgraph is deployed and syncing, only if the handler is triggered and cannot find the contract's abi. (This is an issue we are working on with the Graph team.)

## End To End Testing

While matchstick tests do a decent job of ensuring our handlers work as expected they don't work quite like an actual subgraph and can fail to surface certain types of errors. Within the tests/e2e directory we have a docker compose file that sets up a number of containers to more precisely replicate the subgraph runtime environment. End to end tests should be added under tests/e2e/runner/\_\_tests\_\_. 

In order to run these tests you must have docker installed on your machine. If running with an M1 machine you may need to rebuild the graph-node image as described [here](https://github.com/graphprotocol/graph-node/tree/master/docker#running-graph-node-on-an-macbook-m1).

### Containers

- hardhat
  - Spins up a local hardhat network and saves the mnemonic phrase that's used by default by hardhat to a shared volume
  - Should not typically be modified
- seed
  - Once the hardhat network is up and running the seed container is responsible for deploying any configuring any contracts that should be indexed by the subgraph (not including dynamic sources). Configuration can also occur through transactions in the test files.
  - This container is also responsible for writing a subgraph config for the deployed contracts to a shared volume. The config will be read by the subgraph container
- graph-node, ipfs, postgres
  - Containers required to run a graph-node, copied with some minor modifications from the graph-node repo [here](https://github.com/graphprotocol/graph-node/blob/master/docker/docker-compose.yml)
- subgraph
  - Responsible for compiling and deploying the subgraph based on the subgraph manifest generated from the config file generated by the seed container.
- runner
   - This container actually runs the end to end tests. Tests here should typically start with contract interactions followed by assertions about data returned by the subgraph GraphQL endpoint.

## Hosted Subgraph Publish Checklist

> slightly less involved than publishing to the decentralized graph network

1. Deploy any contracts to be indexed
   - Please see [ArtBlocks/artblocks-contracts](https://github.com/ArtBlocks/artblocks-contracts) for more info on contract deployment.
2. Update the corresponding `config/` file for the desired network (e.g. `mainnet.json` for mainnet EVM) to include the newly deployed contracts
   - Verify that contract addresses added are for the correct contracts by checking Etherscan at the contract address
   - When adding a new contract address to the config file, make sure you are adding it under the appropriate contract grouping. These contract groupings map to values used in the `subgraph.template.yaml` and will ultimately impact what ABIs/handlers get used with the provided contracts in the config.
3. Run `yarn prepare:{NETWORK}`, (e.g. `yarn prepare:mainnet` for mainnet) to generate subgraph manifest (subgraph.yaml)
4. Manually look over the generated subgraph manifest to make sure it is correct

- [Grafting](https://thegraph.com/docs/en/developer/create-subgraph-hosted/#grafting-onto-existing-subgraphs_) is possible on hosted subgraphs. If using this functionality, the following information must be manually added near the top of the generated `subgraph.yaml` file:
  - ```
    features:
      - grafting
    graft:
      base: Qm... # Subgraph ID of base subgraph
      block: 7345624 # Block number
    ```
    > :warning: Any manually added grafting information will be overwritten if scripts re-call `yarn prepare:{network}`, so be aware of any scripts being used in `package.json`
  - Grafting on the decentralized network is not recommended at this time because it requires that the Indexer has indexed the base subgraph.

5. Run `yarn codegen` to generate contract mappings
6. Deploy subgraph to The Graph's hosted service `yarn deploy:{NETWORK}-hosted` (e.g. `yarn deploy:mainnet-hosted`)

- 6A. **Art Blocks Devs:** If you are deploying `mainnet-hosted`, don't forget to also prepare and deploy `mainnet-with-secondary-hosted` to keep those subgraphs in sync

## Adding New Minters Checklist

The following typical steps should be followed when adding new minters to Art Blocks flagship MinterSuite.

> In general, the process should be completed on testnet entirely before deploying on mainnet

1. Deploy new minter contracts (testnet, mainnet, etc).
2. If new minter is a new minter type or version, add the new minter type to off-chain metadata DB via a new Hasura migration.
3. (any order, with the caveat that if the existing subgraph deployment cannot handle the new minters, blockchain transactions MUST be performed AFTER the new subgraph syncs)
   - Deploy subgraph that indexes and handles the new minters, and wait for new subgraph to sync
   - (must wait for new subgraph to be deployed if minter is a new minter type that requires a new item in our subgraph schema `enum MinterType`) Admin submits transactions to allowlist the new minter contracts on MinterFilter
4. Observe the new minter options on the frontend, ensure no subgraph errors
