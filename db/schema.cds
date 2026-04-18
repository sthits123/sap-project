namespace p2p;

using { cuid, managed } from '@sap/cds/common';

entity Vendor : cuid, managed {
  name    : String(100);
  email   : String(100);
  phone   : String(15);
  address : String(255);
}

entity Product : cuid, managed {
  name  : String(100);
  price : Decimal(10,2);
  stock : Integer;
}

entity PurchaseOrder : cuid, managed {
  vendor      : Association to Vendor;
  status      : String(20);
  totalAmount : Decimal(12,2);

  items       : Composition of many POItem
                on items.parent = $self;
}

entity POItem : cuid {
  parent   : Association to PurchaseOrder;
  product  : Association to Product;
  quantity : Integer;
  price    : Decimal(10,2);
}