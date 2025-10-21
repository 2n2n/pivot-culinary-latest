type CustomField = {
  custom_field_name: string;
  custom_field_required: boolean;
  custom_field_id: number;
  id: number;
  value: string;
  custom_field_slug: string;
};

type Address = {
  city: string;
  country: string;
  id: number;
  address1: string;
  address_type: string;
  zip_code: string;
  state: string;
  address2: string;
};

type EmailAddress = {
  address: string;
  id: number;
};

type Contact = {
  account_id: number;
  custom_fields: CustomField[];
  show_financial: boolean;
  addresses: Address[];
  title: string;
  email_addresses: EmailAddress[];
  customer_id: number;
  contact_type: string;
  owned_by: number;
};

type ContactResponse = {
  accounts?: Contact[];
  first_name: string;
  last_name: string;
  main_phone_number: string;
  site_id: number;
  tokens: string[];
};

type Account = {
  id: number;
  name: string;
  description: string;
  owned_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  customer_id: number;
  site_id: number;
  websites: {
    id: number;
    url: string;
  }[];
  market_segment: string | null;
  phone_numbers: {
    id: number;
    number: string;
    phone_number_type: string;
    extension: string;
  }[];
  addresses: Address[]; // Use Address from types.d.ts
  custom_fields: CustomField[]; // Use CustomField from types.d.ts
};
