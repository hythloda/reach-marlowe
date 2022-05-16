import { loadStdlib, ask } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib();

const startingBalance = stdlib.parseCurrency(100)
const zeroBalance = stdlib.parseCurrency(0);

const fmt = (x) => stdlib.formatCurrency(x, 4);


const OUTCOME = ['Sale Complete', 'Sale Canceled'];

const ROLE = ['Buyer', 'Seller', 'Mediator'];
const ROLES = {
  'Buyer': 0, 'B': 0, 'b': 0,
  'Seller': 1, 'S': 1, 's': 1,
  'Mediator': 2, 'M': 2, 'm': 2,
};



async function who() {
  const role = await ask.ask(`Who are you?`, (x) => {
    const role = ROLES[x];
    if ( role === undefined ) {
      throw Error(`Not a valid role ${role}`);
    }
    return role;
  });
  console.log(`You played ${ROLE[role]}`);
  return ROLE[role];
};

let role = await who()

console.log(role)
console.log("Buyer")
console.log(role == "Buyer")
let acc = null;
const createAcc = await ask.ask(
  `Would you like to create an account? (only possible on devnet)`,
  ask.yesno
);
if (createAcc) {
  acc = await stdlib.newTestAccount(stdlib.parseCurrency(1000));
} else {
  const secret = await ask.ask(
    `What is your account secret?`,
    (x => x)
  );
  acc = await stdlib.newAccountFromSecret(secret);
}

let ctc = null;
if(role == "Buyer"){
  ctc = acc.contract(backend);
  ctc.getInfo().then((info) => {
    console.log(`The contract is deployed as = ${JSON.stringify(info)}`); });
}

if(who == 'Seller'){
  const info = await ask.ask(
    `Please paste the contract information:`,
    JSON.parse
  );
  ctc = acc.contract(backend, info);
};

if(who == 'Mediator'){
  const info = await ask.ask(
    `Please paste the contract information:`,
    JSON.parse
  );
  ctc = acc.contract(backend, info);
};


const interact = { ...stdlib.hasRandom };

interact.informTimeout = () => {
  console.log(`There was a timeout.`);
  process.exit(1);
};

if(who == 'Buyer'){
  const amt = await ask.ask(
    `How much money for the house?`,
    stdlib.parseCurrency
  );
  interact.wager = amt;
  interact.deadline = { ETH: 100, ALGO: 100, CFX: 1000 }[stdlib.connector];
}


if(who == 'Seller'){
  interact.acceptWager = async (amt) => {
    const acceptAmount = await ask.ask(
      `Do you accept the wager of ${fmt(amt)}?`,
      ask.yesno
    );
    if (!accepted) {
      process.exit(0);
    }
  };
}

if(who == 'Mediator'){
  ctcMediator.p.Mediator({
    acceptComplaint: (amt) => {
      console.log(`Mediator accepts the wager of ${fmt(amt)}.`);
      return true;
    },
  });
};


// const afterBuyer = await getBalance(accBuyer);
// const afterSeller = await getBalance(accSeller);
// const afterMediator = await getBalance(accMediator);
//
// console.log(`Buyer went from ${beforeBuyer} to ${afterBuyer}.`);
// console.log(`Seller went from ${beforeSeller} to ${afterSeller}.`);
// console.log(`Mediator went from ${beforeMediator} to ${afterMediator}.`);
//

//const Person = (who) => ({
//  seeOutcome: (outcome) => {
//    console.log(`${who} s`);
//    return true
//  },
//});

ask.done();
