# Dealing with slow resolvers in a subgraph

Use this query:

```graphql
query GetSearchResults {
  search(term: "taco") {
    results {
      name
      rating
    }
    # resolving this blocks calls to the business subgraph :(
    bannerAd {
      text
    }
  }
}
```
