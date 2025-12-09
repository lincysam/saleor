import { gql } from '@apollo/client';

export const ACCOUNT_REGISTER = gql`
  mutation AccountRegister(
    $email: String!
    $password: String!
    $redirectUrl: String!
    $firstName: String
    $lastName: String
    $channel: String!
  ) {
    accountRegister(
      input: {
        email: $email
        password: $password
        redirectUrl: $redirectUrl
        firstName: $firstName
        lastName: $lastName
        channel: $channel
      }
    ) {
      requiresConfirmation
      errors {
        field
        message
        code
      }
    }
  }
`;

export const TOKEN_CREATE = gql`
  mutation TokenCreate($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      token
      refreshToken
      csrfToken
      user {
        id
        email
        firstName
        lastName
        isActive
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const TOKEN_REFRESH = gql`
  mutation TokenRefresh($refreshToken: String!, $csrfToken: String!) {
    tokenRefresh(refreshToken: $refreshToken, csrfToken: $csrfToken) {
      token
      errors {
        field
        message
        code
      }
    }
  }
`;

export const PASSWORD_RESET_REQUEST = gql`
  mutation RequestPasswordReset(
    $email: String!
    $redirectUrl: String!
    $channel: String!
  ) {
    requestPasswordReset(
      email: $email
      redirectUrl: $redirectUrl
      channel: $channel
    ) {
      errors {
        field
        message
        code
      }
    }
  }
`;

export const CONFIRM_ACCOUNT = gql`
  mutation ConfirmAccount($email: String!, $token: String!) {
    confirmAccount(email: $email, token: $token) {
      user {
        id
        email
        isActive
        firstName
        lastName
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const SET_PASSWORD = gql`
  mutation SetPassword($token: String!, $email: String!, $password: String!) {
    setPassword(token: $token, email: $email, password: $password) {
      user {
        id
        email
        isActive
        firstName
        lastName
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation PasswordChange($oldPassword: String!, $newPassword: String!) {
    passwordChange(oldPassword: $oldPassword, newPassword: $newPassword) {
      errors {
        field
        message
        code
      }
    }
  }
`;