'reach 0.1';


const Person = {
  seeOutcome: Fun([], Bool),
};


export const main = Reach.App(() => {
  const Buyer = Participant('Buyer', {
    ...Person,
    amount: UInt,
  });
  const seeOutcome = 0

  const Seller   = Participant('Seller', {
    ...Person,
    acceptAmount: Fun([UInt], Bool),
  });

  const Mediator = Participant('Mediator', {
    ...Person,
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
    const seeOutcomeSeller = declassify(interact.acceptAmount(amount));
  });

  Seller.publish(seeOutcomeSeller);
  commit();
  Mediator.only(() => {
    const seeOutcomeMediator = declassify(interact.acceptComplaint(true));;
  });
  Mediator.publish(seeOutcomeMediator);
  //commit();
  if(seeOutcomeSeller &&  seeOutcomeMediator){
    transfer(amount).to(Seller);
  } else {
    transfer(amount).to(Buyer);
  }

  commit();
});
