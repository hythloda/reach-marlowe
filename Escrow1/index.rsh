'reach 0.1';

const [ isStatus, COMPLAINT, NO_COMPLAINT, TIME ] = makeEnum(3);
const [ isOutcome, Seller_funds, Buyer_funds ] = makeEnum(2);

const winner = (handBuyer, handSeller) =>
  ((handBuyer + (4 - handSeller)) % 3);

assert(winner(NO_COMPLAINT, NO_COMPLAINT) == Seller_funds);
assert(winner(NO_COMPLAINT, COMPLAINT) == Seller_funds);
assert(winner(COMPLAINT, COMPLAINT) == Buyer_funds);
assert(winner(COMPLAINT, NO_COMPLAINT) == Seller_funds);

forall(UInt, handBuyer =>
  forall(UInt, handSeller =>
    assert(isOutcome(winner(handBuyer, handSeller)))));

forall(UInt, (hand) =>
  assert(winner(hand, hand) == TIME));


export const main = Reach.App(() => {
  const Buyer = Participant('Buyer', {
    amount: UInt, // atomic units of currency
    deadline: UInt, // time delta (blocks/rounds)
  });
  const Seller   = Participant('Seller', {
    acceptAmount: Fun([UInt], Null),
  });
  const Seller   = Participant('Mediator', {
    acceptComplaint: Fun([UInt], Null),
  });
  init();

  const informTimeout = () => {
    each([Buyer, Seller], () => {
      interact.informTimeout();
    });
  };

  Buyer.only(() => {
    const amount = declassify(interact.amount);
    const deadline = declassify(interact.deadline);
  });
  Buyer.publish(amount, deadline)
    .pay(amount);
  commit();

  Seller.only(() => {
    interact.acceptAmount(amount);
  });
  Seller.pay(amount)
    .timeout(relativeTime(deadline), () => closeTo(Buyer, informTimeout));

  var outcome = TIME;
  invariant( balance() == 2 * amount && isOutcome(outcome) );
  while ( deadline <= TIME ) {
    commit();

    Buyer.only(() => {
      const _handBuyer = interact.getHand();
      const [_commitBuyer, _saltBuyer] = makeCommitment(interact, _handBuyer);
      const commitBuyer = declassify(_commitBuyer);
    });
    Buyer.publish(commitBuyer)
      .timeout(relativeTime(deadline), () => closeTo(Seller, informTimeout));
    commit();

    unknowable(Seller, Buyer(_handBuyer, _saltBuyer));
    Seller.only(() => {
      const handSeller = declassify(interact.getHand());
    });
    Seller.publish(handSeller)
      .timeout(relativeTime(deadline), () => closeTo(Buyer, informTimeout));
    commit();

    Buyer.only(() => {
      const saltBuyer = declassify(_saltBuyer);
      const handBuyer = declassify(_handBuyer);
    });
    Buyer.publish(saltBuyer, handBuyer)
      .timeout(relativeTime(deadline), () => closeTo(Seller, informTimeout));
    checkCommitment(commitBuyer, saltBuyer, handBuyer);

    outcome = winner(handBuyer, handSeller);
    continue;
  }

  assert(outcome == Buyer_funds || outcome == Seller_funds);
  transfer(2 * amount).to(outcome == Buyer_funds ? Buyer : Seller);
  commit();

  each([Buyer, Seller], () => {
    interact.seeOutcome(outcome);
  });
});
