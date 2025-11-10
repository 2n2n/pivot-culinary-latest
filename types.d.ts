declare global {
  type CustomField = {
    custom_field_name: string;
    custom_field_required: boolean;
    custom_field_id: number;
    id: number;
    value: string;
    custom_field_slug: string;
  };

  type TripleseatDocument = {
    id: number;
    title: string;
    template_document_id: number;
    deleted_at: string | null;
    views: any[];
  };

  // CHORE: Create a type for the return value to make results type dynamic
  type TripleseatResponse<T = any> = {
    total_pages: number;
    results: T[];
  };

  type StatusChange = {
    status: string;
    previous_status?: string | null;
    created_at: string;
    created_by: number;
  };

  type Address = {
    id: number;
    address1: string;
    address2?: string | null;
    address3?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
    zip_code?: string;
    country?: string | null;
  };

  type Location = {
    id: number;
    name: string;
    customer_id: number;
    site_id: number;
    addresses: Address[];
    phone_numbers?: PhoneNumber[];
  };

  type EmailAddress = {
    address: string;
    id: number;
  };

  type PhoneNumber = {
    id: number;
    number: string;
    phone_number_type: string;
    extension?: string;
  };

  type Contact = {
    id?: number;
    account_id: number;
    custom_fields: CustomField[];
    show_financial: boolean;
    addresses: Address[];
    title: string;
    email_addresses: EmailAddress[];
    phone_numbers?: ContactPhoneNumber[];
    customer_id: number;
    contact_type: string;
    owned_by: number;
    first_name?: string;
    last_name?: string;
  };

  type EventRequestResponse = {
    status: number;
    data: TripleseatResponse<Booking>;
  };

  type ContactResponse = {
    accounts?: Contact[];
    first_name: string;
    last_name: string;
    main_phone_number: string;
    site_id: number;
    tokens: string[];
  };

  type AccountSimplified = {
    id: number;
    name: string;
  };
  type Account = AccountSimplified & {
    description?: string;
    owned_by?: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
    customer_id?: number;
    site_id?: number;
    websites?: {
      id: number;
      url: string;
    }[];
    market_segment?: string | null;
    phone_numbers?: PhoneNumber[];
    addresses?: Address[];
    custom_fields?: CustomField[];
  };

  type AccountBookings = {
    account: Account;
    bookings: Booking[];
  };

  type Booking = {
    id: number;
    name: string;
    customer_id: number;
    site_id: number;
    location_id: number;
    event_ids: number[];
    status: Status;
    total_event_actual_amount: number;
    total_actual_amount: number;
    total_event_grand_total: number;
    total_grand_total: number;
    post_as: string;
    updated_by: number;
    created_by: number;
    owned_by: number;
    start_date: string;
    end_date: string | null;
    definite_date: string | null;
    tentative_date: string | null;
    lost_date: string | null;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
    location: Location | Location[];
    market_segment: any;
    contact: Contact;
    secondary_contacts: any[];
    account: Account;
    owner: Contact;
    creator: Contact;
    updator: Contact;
    status_changes: StatusChange[];
    selected_lead_sources: SelectedLeadSource[];
    custom_fields: CustomField[];
    documents?: TripleseatDocument[];
    events?: BookingEvent[];
    event_ids: number[]; // Note: This appears twice in your type
  };

  type TripleseatEvent = {
    id: number;
    name: string;
    customer_id: number;
    site_id: number;
    location_id: number;
    event_ids: number[];
    status: string;
    total_event_actual_amount: number;
    total_actual_amount: number;
    total_event_grand_total: number;
    total_grand_total: number;
    post_as: string;
    updated_by: number;
    created_by: number;
    owned_by: number;
    start_date: string; // ISO format
    end_date: string; // ISO format
    definite_date: string;
    tentative_date?: string | null;
    lost_date?: string | null;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    location: Location;
  };

  type BookingEvent = {
    id: string;
    name: string;
    amount: number | string;
    status: "DEFINITE" | "TENTATIVE" | "CANCELLED";
    startTime: string;
    endTime: string;
    startDate?: Date;
    endDate?: Date;
    address: string;
    guests: number;
    beoUrl?: string;
    managerAccount?: {
      name: string;
      role: string;
      phone: string;
      image: string;
    };
  };

  type CategoryTotal = {
    name: string;
    total: string;
  };

  type BillingTotal = {
    name: string;
    total: string;
  };
}

// This export is required for the file to be treated as a module
export {};
