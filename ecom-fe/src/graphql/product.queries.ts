import { gql } from '@apollo/client';


export const GET_PRODUCTS = gql`
  query GetProducts(
    $first: Int!
    $after: String
    $channel: String!
    $filter: ProductFilterInput
  ) {
    products(first: $first, after: $after, channel: $channel, filter: $filter) {
      edges {
        node {
          id
          name
          description
          thumbnail {
            url
            alt
          }
          category {
            id
            name
            slug
          }
          pricing {
            priceRange {
              start {
                gross {
                  amount
                  currency
                }
              }
            }
          }
          rating
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;



export const GET_PRODUCTS_BY_CATEGORY = gql`
  query ProductsByCategory($first: Int, $channel: String!, $filter: ProductFilterInput) {
    products(first: $first, channel: $channel, filter: $filter) {
      edges {
        node {
          id
          name
          slug
          description
          thumbnail { url }
          pricing {
            priceRange {
              start {
                net { amount currency }
                gross { amount currency }
                currency
              }
              stop {
                net { amount currency }
                gross { amount currency }
                currency
              }
            }
          }
          category { id name slug }
          attributes { attribute { name id slug } values { name id } }
          media { url(size: 10) }
          images { url(size: 10, format: ORIGINAL) }
        }
      }
      pageInfo { startCursor endCursor hasNextPage hasPreviousPage }
    }
  }
`;


export const GET_PRODUCT_DETAIL = gql`
  query GetProductDetail($id: ID!, $channel: String!) {
    product(id: $id, channel: $channel) {
      id
      name
      description
      slug
      category {
        id
        name
        slug
        parent {
          id
          name
          slug
          parent {
            id
            name
            slug
          }
        }
        children(first: 10) {
          edges {
            node {
              id
              name
              slug
            }
          }
        }
      }
      thumbnail {
        url
        alt
      }
      media {
        url
        alt
      }
      images {
        url
      }
      pricing {
        priceRange {
          start {
            net {
              amount
              currency
            }
            gross {
              amount
              currency
            }
          }
          stop {
            net {
              amount
              currency
            }
            gross {
              amount
              currency
            }
          }
        }
        priceRangeUndiscounted {
          start {
            gross {
              amount
              currency
            }
          }
        }
        discount {
          gross {
            amount
            currency
          }
        }
        onSale
      }
      rating
      isAvailable
      attributes {
        attribute {
          name
          id
          slug
        }
        values {
          name
          id
        }
      }
      variants {
      id
      name
      sku
      attributes {
        attribute {
          id
          name
        }
        values {
          name
          id
        }
      }
    } 
    }
  }
`;

export const GET_CATEGORIES = gql`
  query  {
  categories(first: 100) {
    edges {
      node {
        id
        name
        slug
        level
        parent {
          id
          name
        }
        children(first: 20) {
          edges {
            node {
              id
              name
              slug
              level
              children(first: 20) {
                edges {
                  node {
                    id
                    name
                    slug
                    level
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($search: String!, $channel: String!, $first: Int) {
    products(first: $first, channel: $channel, filter: { search: $search }) {
      edges {
        node {
          id
          name
          description
          thumbnail {
            url
            alt
          }
          category {
            id
            name
            slug
          }
          pricing {
            priceRange {
              start {
                gross {
                  amount
                  currency
                }
              }
            }
          }
          rating
        }
      }
    }
  }
`;

export const GET_COLLECTIONS_WITH_PRODUCTS = gql`
  query GetCollectionsWithProducts(
    $first: Int!
    $channel: String!
    $filter: CollectionFilterInput
  ) {
    collections(
      first: $first
      channel: $channel
      filter: $filter
    ) {
      edges {
        node {
          id
          name
          slug
          description
          backgroundImage {
            url
            alt
          }
          products(first: 8, filter: { isAvailable: true, isPublished: true }) {
            edges {
              node {
                id
                name
                slug
                description
                thumbnail {
                  url
                  alt
                }
                category {
                  id
                  name
                  slug
                  parent {
                    id
                    name
                    slug
                    parent {
                      id
                      name
                      slug
                    }
                  }
                }
                pricing {
                  priceRange {
                    start {
                      net {
                        amount
                        currency
                      }
                      gross {
                        amount
                        currency
                      }
                      currency
                    }
                    stop {
                      net {
                        amount
                        currency
                      }
                      gross {
                        amount
                        currency
                      }
                      currency
                    }
                  }
                  priceRangeUndiscounted {
                    start {
                      gross {
                        amount
                        currency
                      }
                    }
                  }
                  discount {
                    gross {
                      amount
                      currency
                    }
                  }
                  onSale
                }
                rating
                attributes {
                  attribute {
                    name
                    id
                    slug
                  }
                  values {
                    name
                    id
                  }
                }
                isAvailable
              }
            }
            totalCount
          }
        }
      }
    }
  }
`;