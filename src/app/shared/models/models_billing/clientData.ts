export class ClientData {
    is_natural_person: boolean;
    fullname:string;
    document_type: string;
    document_number: string;
    address: string;
    phone: string;
    email: string;
    id_third: number;
  
    constructor(
      is_natural_person, fullname, document_type, document_number, address, phone, email, id_third
    ) {
      this.is_natural_person = is_natural_person;
      this.fullname= fullname;
      this.document_type = document_type;
      this.document_number = document_number;
      this.address = address;
      this.phone = phone;
      this.email = email;
      this.id_third = id_third;
    }
  }