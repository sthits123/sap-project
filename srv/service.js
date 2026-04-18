const cds = require('@sap/cds');

module.exports = (srv) => {

  srv.before('CREATE', 'PurchaseOrders', async (req) => {

    const db = await cds.connect.to('db');
    const items = req.data.items;

    if (!items || items.length === 0) {
      req.error(400, "At least one item is required");
    }

    let total = 0;

    for (let item of items) {

      if (!item.quantity || !item.price) {
        req.error(400, "Each item must have quantity and price");
      }

      const product = await db.read('p2p.Product').where({ ID: item.product_ID });

      if (!product || product.length === 0) {
        req.error(400, "Invalid product");
      }

      total += item.quantity * item.price;
    }

    req.data.totalAmount = total;
    req.data.status = 'Created';
  });

  srv.on('approvePO', async (req) => {
    const db = await cds.connect.to('db');
    const { ID } = req.data;

    await db.update('p2p.PurchaseOrder')
      .set({ status: 'Approved' })
      .where({ ID });
  });

  srv.on('goodsReceipt', async (req) => {

    const db = await cds.connect.to('db');
    const { ID } = req.data;

    const poItems = await db.read('p2p.POItem').where({ parent_ID: ID });

    for (let item of poItems) {

      const product = await db.read('p2p.Product').where({ ID: item.product_ID });

      if (!product || product.length === 0) continue;

      await db.update('p2p.Product')
        .set({ stock: product[0].stock + item.quantity })
        .where({ ID: item.product_ID });
    }

    await db.update('p2p.PurchaseOrder')
      .set({ status: 'GR Done' })
      .where({ ID });
  });

  srv.on('completePO', async (req) => {
    const db = await cds.connect.to('db');
    const { ID } = req.data;

    await db.update('p2p.PurchaseOrder')
      .set({ status: 'Completed' })
      .where({ ID });
  });

};