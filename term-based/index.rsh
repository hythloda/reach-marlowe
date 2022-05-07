'reach 0.1';


const Person = {
  seeOutcome: Fun([], Bool),
};



export const main = Reach.App(() => {
  const Buyer = Participant('Buyer', {
    amount: UInt,
  });

  const Seller   = Participant('Seller', {
    acceptAmount: Fun([UInt], Bool),
  });

  const Mediator   = Participant('Mediator', {
    acceptComplaint: Fun([Bool], Bool),
  });

  init();

  Buyer.only(() => {
    const amount = declassify(interact.amount);
  });

  Buyer.publish(amount)
    .pay(amount);
  commit();

  Seller.only(() => {
    const accept_buyer_price = declassify(interact.acceptAmount(amount));
  });

  Mediator.only(() => {
    const sale = declassify(interact.acceptComplaint(true));
  });
  const outcome = (1 + (4 - 1)) % 3;
const            [forSeller, forBuyer] =
  outcome == 2 ? [       2,      0] :
  outcome == 0 ? [       0,      2] :
  /* tie      */ [       1,      1];
transfer(forSeller * amount).to(Seller);
transfer(forBuyer   * amount).to(Buyer);
commit();
});
