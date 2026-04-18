using { p2p } from '../db/schema';

service CatalogService {

  entity Vendors        as projection on p2p.Vendor;
  entity Products       as projection on p2p.Product;
  entity PurchaseOrders as projection on p2p.PurchaseOrder;

  action approvePO(ID: UUID);
  action goodsReceipt(ID: UUID);
  action completePO(ID: UUID);
}