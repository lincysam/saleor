// checkout.queries.ts
import { gql } from '@apollo/client';




export const CHECKOUT_EMAIL_UPDATE = gql`
  mutation CheckoutEmailUpdate($checkoutId: ID!, $email: String!) {
    checkoutEmailUpdate(checkoutId: $checkoutId, email: $email) {
      checkout {
        id
        email
      }
      errors {
        field
        code
        message
      }
    }
  }
`;

export const GET_ADDRESS_VALIDATION_RULES = gql`
  query GetAddressValidationRules($countryCode: CountryCode!) {
    addressValidationRules(countryCode: $countryCode) {
      addressFormat
      allowedFields
      requiredFields
      countryAreaType
      postalCodeType
      cityType
      countryAreaChoices {
        verbose
        raw
      }
    }
  }
`;



export const GET_CHECKOUT_SHIPPING_METHODS = gql`
  query GetCheckoutShippingMethods($checkoutId: ID!) {
    checkout(id: $checkoutId) {
      id
      availableShippingMethods {
        id
        name
        price {
          amount
          currency
        }
        minimumDeliveryDays
        maximumDeliveryDays
      }
    }
  }
`;

export const CHECKOUT_PAYMENT_CREATE = gql`
  mutation CheckoutPaymentCreate($checkoutId: ID!, $paymentInput: PaymentInput!) {
    checkoutPaymentCreate(checkoutId: $checkoutId, input: $paymentInput) {
      payment {
        id
        gateway
        token
        chargeStatus
      }
      errors {
        field
        code
        message
      }
    }
  }
`;

export const CHECKOUT_COMPLETE = gql`
  mutation CheckoutComplete($checkoutId: ID!) {
    checkoutComplete(checkoutId: $checkoutId) {
      order {
        id
        number
        status
        total {
          gross {
            amount
            currency
          }
        }
        created
      }
      errors {
        field
        code
        message
      }
    }
  }
`;

export const ChannelDocument = gql`
	query channel($slug: String!) {
		channel(slug: $slug) {
			countries {
				code
			}
		}
	}
`;

export const ValidationRulesFragmentDoc = gql`
	fragment ValidationRulesFragment on AddressValidationData {
		addressFormat
		allowedFields
		requiredFields
		countryAreaType
		postalCodeType
		cityType
		countryAreaChoices {
			raw
			verbose
		}
	}
`;
export const MoneyFragmentDoc = gql`
	fragment Money on Money {
		currency
		amount
	}
`;
export const GiftCardFragmentDoc = gql`
	fragment GiftCardFragment on GiftCard {
		displayCode
		id
		currentBalance {
			...Money
		}
	}
	${MoneyFragmentDoc}
`;
export const AddressFragmentDoc = gql`
	fragment AddressFragment on Address {
		id
		city
		phone
		postalCode
		companyName
		cityArea
		streetAddress1
		streetAddress2
		countryArea
		country {
			country
			code
		}
		firstName
		lastName
	}
`;

export const userFragmentDoc = gql`
	fragment UserFragment on User {
		id
		email
		addresses {
			...AddressFragment
		}
		defaultBillingAddress {
			...AddressFragment
		}
		defaultShippingAddress {
			...AddressFragment
		}
	}`;

export const GET_CUSTOMER_ADDRESSES = gql`
  query GetCustomerAddresses($email: String!) {
    user(email: $email) {
      id
      email
      addresses {
        ...AddressFragment
      }
      defaultBillingAddress {
        ...AddressFragment
      }
      defaultShippingAddress {
        ...AddressFragment
      }
    }
  }
  ${userFragmentDoc}
`;

export const PaymentGatewayFragmentDoc = gql`
	fragment PaymentGatewayFragment on PaymentGateway {
		id
		name
		currencies
		config {
			field
			value
		}
	}
`;
export const CheckoutLineFragmentDoc = gql`
	fragment CheckoutLineFragment on CheckoutLine {
		id
		quantity
		totalPrice {
			gross {
				currency
				amount
			}
		}
		unitPrice {
			gross {
				...Money
			}
		}
		undiscountedUnitPrice {
			...Money
		}
		variant {
			attributes(variantSelection: ALL) {
				values {
					name
					dateTime
					boolean
					translation(languageCode: $languageCode) {
						name
					}
				}
			}
			id
			name
			translation(languageCode: $languageCode) {
				name
			}
			product {
				name
				translation(languageCode: $languageCode) {
					language {
						code
					}
					id
					name
				}
				media {
					alt
					type
					url(size: 72)
				}
			}
			media {
				alt
				type
				url(size: 72)
			}
		}
	}
	${MoneyFragmentDoc}
`;


export const checkoutErrorFragmentDoc = gql`
fragment CheckoutErrorFragment on CheckoutError {
	message
	field
	code
}`


export const CheckoutFragmentDoc = gql`
	fragment CheckoutFragment on Checkout {
		id
		email
		discount {
			...Money
		}
		voucherCode
		discountName
		translatedDiscountName
		giftCards {
			...GiftCardFragment
		}
		channel {
			id
			slug
		}
		shippingAddress {
			...AddressFragment
		}
		billingAddress {
			...AddressFragment
		}
		authorizeStatus
		chargeStatus
		isShippingRequired
		user {
			id
			email
		}
		availableShippingMethods {
        id
        name
        price {
          amount
          currency
        }
        minimumDeliveryDays
        maximumDeliveryDays
      }			
		availablePaymentGateways {
			...PaymentGatewayFragment
		}
		deliveryMethod {
			... on ShippingMethod {
				id
			}
			... on Warehouse {
				id
			}
		}
		shippingMethods {
			id
			name
			price {
				...Money
			}
			maximumDeliveryDays
			minimumDeliveryDays
		}
		totalPrice {
			gross {
				...Money
			}
			tax {
				...Money
			}
		}
		shippingPrice {
			gross {
				...Money
			}
		}
		subtotalPrice {
			gross {
				...Money
			}
		}
		lines {
			...CheckoutLineFragment
		}
	}
	${MoneyFragmentDoc}
	${GiftCardFragmentDoc}
	${AddressFragmentDoc}
	${PaymentGatewayFragmentDoc}
	${CheckoutLineFragmentDoc}
`;

export const CHECKOUT_DELIVERYMETHOD_UPDATE = gql`
mutation checkoutDeliveryMethodUpdate(
	$checkoutId: ID!
	$deliveryMethodId: ID!
	$languageCode: LanguageCodeEnum!
) {
	checkoutDeliveryMethodUpdate(id: $checkoutId, deliveryMethodId: $deliveryMethodId) {
		errors {
			...CheckoutErrorFragment
		}
		checkout {
			...CheckoutFragment
		}
	}}
	${checkoutErrorFragmentDoc}
  	${CheckoutFragmentDoc} 		
`;

export const ShippingFragmentDoc = gql`
	fragment ShippingFragment on ShippingMethod {
		name
		minimumDeliveryDays
		maximumDeliveryDays
	}
`;
export const OrderLineFragmentDoc = gql`
	fragment OrderLineFragment on OrderLine {
		id
		quantity
		variant {
			name
			attributes(variantSelection: ALL) {
				values {
					name
					dateTime
					boolean
					translation(languageCode: $languageCode) {
						name
					}
				}
			}
		}
		totalPrice {
			gross {
				...Money
			}
		}
		undiscountedUnitPrice {
			gross {
				...Money
			}
		}
		unitPrice {
			gross {
				...Money
			}
		}
		productName
		variantName
		thumbnail {
			alt
			url
		}
	}
	${MoneyFragmentDoc}
`;

export const OrderFragmentDoc = gql`
	fragment OrderFragment on Order {
		id
		number
		userEmail
		isPaid
		discounts {
			type
			name
			amount {
				...Money
			}
		}
		chargeStatus
		authorizeStatus
		shippingAddress {
			...AddressFragment
		}
		billingAddress {
			...AddressFragment
		}
		deliveryMethod {
			...ShippingFragment
		}
		total {
			gross {
				...Money
			}
			tax {
				...Money
			}
		}
		voucher {
			code
		}
		shippingPrice {
			gross {
				...Money
			}
		}
		subtotal {
			gross {
				...Money
			}
		}
		lines {
			...OrderLineFragment
		}
		totalBalance {
			...Money
		}
		totalCaptured {
			...Money
		}
	}
	${MoneyFragmentDoc}
	${AddressFragmentDoc}
	${ShippingFragmentDoc}
	${OrderLineFragmentDoc}
`;
export const AccountErrorFragmentDoc = gql`
	fragment AccountErrorFragment on AccountError {
		message
		field
		code
	}
`;

export const CheckoutDocument = gql`
	query checkout($id: ID!, $languageCode: LanguageCodeEnum!) {
		checkout(id: $id) {
			...CheckoutFragment
		}
	}
	${CheckoutFragmentDoc}
`;


export const AddressValidationRulesDocument = gql`
	query addressValidationRules($countryCode: CountryCode!) {
		addressValidationRules(countryCode: $countryCode) {
			...ValidationRulesFragment
		}
	}
	${ValidationRulesFragmentDoc}
`;


export const GET_COUNTRIES = gql`
  query GetCheckoutCountries {
    shop {
      countries {
        code
        country
      }
    }
  }
`;

export const CHECKOUT_QUERY = gql`
  query Checkout($id: ID!, $languageCode: LanguageCodeEnum!) {
    checkout(id: $id) {
      ...CheckoutFragment
    }
  }
  ${CheckoutFragmentDoc}
`;

export const CHECKOUT_SHIPPING_ADDRESS_UPDATE = gql`
  mutation checkoutShippingAddressUpdate(
    $checkoutId: ID!
    $shippingAddress: AddressInput!
    $validationRules: CheckoutAddressValidationRules
	$languageCode: LanguageCodeEnum! 
  ) {
    checkoutShippingAddressUpdate(
      id: $checkoutId
      shippingAddress: $shippingAddress
      validationRules: $validationRules
    ) {
      errors {
        ...CheckoutErrorFragment
      }
      checkout {
        ...CheckoutFragment
      }
    }
  }
  ${checkoutErrorFragmentDoc}
  ${CheckoutFragmentDoc} 
`;

export const CHECKOUT_BILLING_ADDRESS_UPDATE = gql`
mutation checkoutBillingAddressUpdate(
	$checkoutId: ID!
	$billingAddress: AddressInput!
	$validationRules: CheckoutAddressValidationRules
	$languageCode: LanguageCodeEnum!
) {
	checkoutBillingAddressUpdate(
		id: $checkoutId
		billingAddress: $billingAddress
		validationRules: $validationRules
	) {
		errors {
			...CheckoutErrorFragment
		}
		checkout {
			...CheckoutFragment
		}
	}
}	
${checkoutErrorFragmentDoc}
  ${CheckoutFragmentDoc} 

`;

