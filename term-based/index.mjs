import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib();

const startingBalance = stdlib.parseCurrency(100)
const zeroBalance = stdlib.parseCurrency(0);
const accBuyer = await stdlib.newTestAccount(startingBalance);
const accSeller  = await stdlib.newTestAccount(zeroBalance);
const accMediator  = await stdlib.newTestAccount(zeroBalance);

const fmt = (x) => stdlib.formatCurrency(x, 4);
const getBalance = async (who) => fmt(await stdlib.balanceOf(who));
const beforeBuyer = await getBalance(accBuyer);
const beforeSeller = await getBalance(accSeller);
const beforeMediator = await getBalance(accMediator);

const ctcBuyer = accBuyer.contract(backend);
const ctcSeller = accSeller.contract(backend, ctcBuyer.getInfo());

const OUTCOME = ['Sale Complete', 'Sale Canceled'];

const Person = (Who) => ({
  seeOutcome: (outcome) => {
    console.log(`${Who} s`);
  },
});

await Promise.all([
  ctcBuyer.p.Buyer({
    wager: stdlib.parseCurrency(5),
  }),
  ctcSeller.p.Seller({
    acceptAmount: (amt) => {
      console.log(`Seller accepts the wager of ${fmt(amt)}.`);
    },
  }),
  ctcMediator.p.Mediator({
    acceptComplaint: (amt) => {
      console.log(`Mediator accepts the wager of ${fmt(amt)}.`);
    },
  }),
]);

const afterBuyer = await getBalance(accBuyer);
const afterSeller = await getBalance(accSeller);
const afterMediator = await getBalance(accMediator);

console.log(`Buyer went from ${beforeBuyer} to ${afterBuyer}.`);
console.log(`Seller went from ${beforeSeller} to ${afterSeller}.`);
console.log(`Mediator went from ${beforeMediator} to ${afterMediator}.`);
