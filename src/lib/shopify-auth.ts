import { storefrontApiRequest } from './shopify';

// Customer Types
export interface ShopifyCustomer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  acceptsMarketing: boolean;
  defaultAddress: {
    id: string;
    address1: string | null;
    city: string | null;
    province: string | null;
    country: string | null;
    zip: string | null;
  } | null;
  nailSizes?: NailSizes | null;
}

export interface NailSizes {
  leftPinky: string;
  leftRing: string;
  leftMiddle: string;
  leftIndex: string;
  leftThumb: string;
  rightThumb: string;
  rightIndex: string;
  rightMiddle: string;
  rightRing: string;
  rightPinky: string;
}

interface CustomerAccessToken {
  accessToken: string;
  expiresAt: string;
}

interface CustomerUserError {
  code: string;
  field: string[];
  message: string;
}

// GraphQL Mutations for Customer Authentication
const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_RECOVER_MUTATION = `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      acceptsMarketing
      defaultAddress {
        id
        address1
        city
        province
        country
        zip
      }
      metafield(namespace: "custom", key: "nail_sizes") {
        value
      }
    }
  }
`;

const CUSTOMER_UPDATE_MUTATION = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        metafield(namespace: "custom", key: "nail_sizes") {
          value
        }
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// Auth Functions
export async function customerCreate(
  email: string, 
  password: string,
  firstName?: string,
  lastName?: string
): Promise<{
  customer?: { id: string; email: string; firstName: string | null; lastName: string | null };
  customerUserErrors?: CustomerUserError[];
}> {
  const input: Record<string, string> = { email, password };
  if (firstName) input.firstName = firstName;
  if (lastName) input.lastName = lastName;

  const response = await storefrontApiRequest<{
    data: {
      customerCreate: {
        customer: { id: string; email: string; firstName: string | null; lastName: string | null } | null;
        customerUserErrors: CustomerUserError[];
      };
    };
  }>(CUSTOMER_CREATE_MUTATION, { input });

  return {
    customer: response.data.customerCreate.customer || undefined,
    customerUserErrors: response.data.customerCreate.customerUserErrors,
  };
}

export async function customerLogin(
  email: string,
  password: string
): Promise<{
  customerAccessToken?: CustomerAccessToken;
  customerUserErrors?: CustomerUserError[];
}> {
  const response = await storefrontApiRequest<{
    data: {
      customerAccessTokenCreate: {
        customerAccessToken: CustomerAccessToken | null;
        customerUserErrors: CustomerUserError[];
      };
    };
  }>(CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION, { 
    input: { email, password } 
  });

  return {
    customerAccessToken: response.data.customerAccessTokenCreate.customerAccessToken || undefined,
    customerUserErrors: response.data.customerAccessTokenCreate.customerUserErrors,
  };
}

export async function customerRecover(
  email: string
): Promise<{
  customerUserErrors?: CustomerUserError[];
}> {
  const response = await storefrontApiRequest<{
    data: {
      customerRecover: {
        customerUserErrors: CustomerUserError[];
      };
    };
  }>(CUSTOMER_RECOVER_MUTATION, { email });

  return {
    customerUserErrors: response.data.customerRecover.customerUserErrors,
  };
}

export async function fetchCustomer(
  accessToken: string
): Promise<ShopifyCustomer | null> {
  const response = await storefrontApiRequest<{
    data: {
      customer: (Omit<ShopifyCustomer, 'nailSizes'> & { 
        metafield: { value: string } | null 
      }) | null;
    };
  }>(CUSTOMER_QUERY, { customerAccessToken: accessToken });

  if (!response.data.customer) return null;

  const { metafield, ...customerData } = response.data.customer;
  
  return {
    ...customerData,
    nailSizes: metafield ? JSON.parse(metafield.value) : null,
  };
}

export async function updateCustomerNailSizes(
  accessToken: string,
  nailSizes: NailSizes
): Promise<{
  success: boolean;
  customerUserErrors?: CustomerUserError[];
}> {
  const response = await storefrontApiRequest<{
    data: {
      customerUpdate: {
        customer: { id: string } | null;
        customerUserErrors: CustomerUserError[];
      };
    };
  }>(CUSTOMER_UPDATE_MUTATION, {
    customerAccessToken: accessToken,
    customer: {
      metafields: [
        {
          namespace: "custom",
          key: "nail_sizes",
          type: "json",
          value: JSON.stringify(nailSizes),
        },
      ],
    },
  });

  return {
    success: response.data.customerUpdate.customer !== null,
    customerUserErrors: response.data.customerUpdate.customerUserErrors,
  };
}