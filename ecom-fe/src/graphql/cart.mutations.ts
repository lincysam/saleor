import { gql } from '@apollo/client';

const CHECKOUT_CREATE = gql`
  mutation CheckoutCreate($channel: String!, $lines: [CheckoutLineInput!]!) {
    checkoutCreate(input: { channel: $channel, lines: $lines }) {
      checkout {
        id
        token
        email
        lines {
          id
          quantity
          variant {
            id
            name
            sku
            product {
              id
              name
              slug
              thumbnail {
                url
                alt
              }
            }
            pricing {
              price {
                gross {
                  amount
                  currency
                }
              }
            }
          }
          totalPrice {
            gross {
              amount
              currency
            }
          }
        }
        subtotalPrice {
          gross {
            amount
            currency
          }
        }
        totalPrice {
          gross {
            amount
            currency
          }
        }
        shippingPrice {
          gross {
            amount
            currency
          }
        }
        availablePaymentGateways {
          id
          name
        }
        availableShippingMethods {
          id
          name
          price {
            amount
            currency
          }
        }
      }
      errors {
        field
        code
        message
      }
    }
  }
`;

const CHECKOUT_LINES_UPDATE = gql`
  mutation CheckoutLinesUpdate($checkoutId: ID!,$lines: [CheckoutLineUpdateInput!]!) {
    checkoutLinesUpdate(checkoutId: $checkoutId, lines: $lines) {
      checkout {
        id
        lines {
          id
          quantity
          variant {
            id
            product {
              name
              thumbnail {
                url
              }
            }
            pricing {
              price {
                gross {
                  amount
                  currency
                }
              }
            }
          }
        }
        totalPrice {
          gross {
            amount
            currency
          }
        }
      }
      errors {
        field
        code
        message
      }
    }
  }
`;
export { CHECKOUT_CREATE, CHECKOUT_LINES_UPDATE };