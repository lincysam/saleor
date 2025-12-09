import { gql } from '@apollo/client';

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      email
      firstName
      lastName
      isStaff
      isActive
    }
  }
`;

export const VERIFY_TOKEN = gql`
  mutation VerifyToken($token: String!) {
    tokenVerify(token: $token) {
      payload
      user {
        id
        email
        firstName
        lastName
        isStaff
      }
      errors {
        field
        message
        code
      }
    }
  }
`;